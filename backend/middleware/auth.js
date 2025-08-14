const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).json({error: "access denied, Access key not found"})
    }

    jwt.verify(token, "CLASSIFIED", (err, user) => {
        if (err) {
            return res.status(403).json({error: "Access Key not valid or Expired"})
        }
        
        req.user = user
        
        next()
    })
}

const authorizeSuperadmin = (req, res, next) => {
    if (req.user.role !== 'Superadmin') {
        return res.status(403).json({error: "Access Denied. Only Superadmin has Access"})
    }

    next()
}

module.exports = {
    authenticateToken,
    authorizeSuperadmin
}