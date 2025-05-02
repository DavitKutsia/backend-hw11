const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = async (req, res, next) => {
    const headers = req.headers['authorization'];
    if(!headers) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const [ type , token ] = headers.split(' ');
    
    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        req.directorId = payload.directorId;
        
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

}

module.exports = isAuth;