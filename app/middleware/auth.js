const jwt = require('jsonwebtoken');



const authCheck = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];

        if (!token) {
            return res.status(401).json({ message: 'Token is required!' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token access!' });
    }
    
    return next();
}

module.exports = authCheck;