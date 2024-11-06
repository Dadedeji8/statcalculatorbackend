const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers['Authorization'];  // Correct header case



    const token = authHeader;  // Extract token from 'Bearer <token>'

    try {
        const decoded = jwt.verify(token, "secretKey");  // Use environment variable for the secret key
        req.user = decoded;  // Store decoded user info in request object
        next();  // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Auth failed: Invalid token", error });
    }
};
