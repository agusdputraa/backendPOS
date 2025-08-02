const db = require("../configs/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const registerUser = async (req, res) => {
    try {
        db.query("SELECT COUNT(*) as userCount FROM users", async (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Failed to check database." });
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
                    return res.status(500).json({ error: "Failed to register: " + error.message });
                }

                res.status(201).json({
                    message: `User successfully registered as ${role}!`,
                    userId: userId
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
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
            token: token,
            
            user: {
                fullName: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role
            }
        });
    });
};

const getUsers = (req, res) => {
    const query = "SELECT id, CONCAT(first_name, ' ', last_name) AS fullName, email, role FROM users";

    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Internal Server Error." });
        }

        res.status(200).json({
            message: "Getting all users data successfully.",
            data: results
        });
    });
};

const updateUserProfile = (req, res) => {
    const userId = req.user.id
    const { first_name, last_name, email } = req.body
    
    const query = "UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?"
    db.query(query, [first_name, last_name, email, userId], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "Failed to update profile: " + error.message })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found." })
        }
        res.status(200).json({ message: "Profile successfully updated."})
    })
}

const updateUserPassword = async (req, res) => {
    const userID = req.user.id
    const { oldPassword, newPassword } = req.body

    db. query("SELECT password FROM users WHERE id = ?", [userId], async (error, results) => {
        if (error || results.length === 0) {
            return res.status(500).json({ error: "User not found."})
        }
        
        const user = results[0]

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Old Password incorrect"})
        }
        
        const newHashedPassword = await bcrypt.hash(newPassword, 10)

        db.query("UPDATE users SET password = ? WHERE id = ?", [newHashedPassword, userId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Failed to update password."})
            }
            res.status(200).json({ message: "Password successfully updated."})
        })
    })
}

const deleteUser = (req, res) => {
    const userIdToDelete = req.params.id

    const query = "DELETE FROM users WHERE id = ?"
    db.query(query, [userIdToDelete], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "Failed to delete user"})
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found."})
        }
        res.status(200).json({ message: "User successfully deleted."})
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    updateUserProfile,
    updateUserPassword,
    deleteUser
};