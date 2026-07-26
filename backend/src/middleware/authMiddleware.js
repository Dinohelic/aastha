import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {

    console.log("Authorization Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token);

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded:", decoded);

        req.user = decoded;

        next();

    } catch (err) {

        console.log("JWT Error:", err.message);

        return res.status(401).json({
            success: false,
            message: err.message
        });

    }
};

export default authenticateToken;