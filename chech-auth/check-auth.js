const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    // if (!token) {
    //     return res.status(401).json({ message: "Auth failed: Token not provided" });
    // }

    try {
        const decoded = jwt.verify(token, "secretKey");
        req.user = decoded;  // Store decoded user info in request object
        next();  // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Auth failed: Invalid token", error });
    }
};
