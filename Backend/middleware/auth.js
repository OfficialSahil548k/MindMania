import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
            req.userId = decodedData?.userId;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }

        next();
    } catch (error) {
        console.log(error);
        const message = error.name === "TokenExpiredError"
            ? "Session expired. Please log in again."
            : "Unauthenticated";

        res.status(401).json({ message });
    }
};

export default auth;
