const db = require("../configs/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const registerUser = async (req, res) => {
    try {
        db.query("SELECT COUNT(*) as userCount FROM users", async (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Gagal memeriksa database." });
            }

            const { userCount } = results[0];
            const role = userCount === 0 ? "Superadmin" : "Customer";

            const { first_name, last_name, email, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);
            
            const userId = uuidv4();

            const query = "INSERT INTO users (id, first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?, ?)";
            const params = [userId, first_name, last_name, email, hashedPassword, role];

            db.query(query, params, (error, result) => {
                if (error) {
                    return res.status(500).json({ error: "Gagal mendaftarkan user: " + error.message });
                }

                res.status(201).json({
                    message: `User berhasil terdaftar sebagai ${role}!`,
                    userId: userId
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan pada server." });
    }
};

const loginUser = (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Internal Server Error." });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: "Email or password is incorrect." });
        }

        const user = results[0];

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Email or password is incorrect." });
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        
        const token = jwt.sign(payload, "CLASSIFIED", { expiresIn: '3h' });

        res.status(200).json({
            message: "Login successfull",
            token: token
        });
    });
};

const getUsers = (req, res) => {
    const query = "SELECT id, first_name, last_name, email, role, password FROM users";

    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Internal Server Error." });
        }

        res.status(200).json({
            message: "Getting all users data successfull.",
            data: results
        });
    });
};

module.exports = {
    registerUser,
    loginUser,
    getUsers
};