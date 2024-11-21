import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (req.path === '/public') {
        return next(); // Si la ruta es /public, no verifica el token
    }

    if (!token) return res.sendStatus(401); // No autorizado

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ message: 'El token ha expirado' });
            } else {
                return res.sendStatus(403); // Prohibido
            }
        }
        req.user = user;
        next();
    });
};

export default authenticateToken;