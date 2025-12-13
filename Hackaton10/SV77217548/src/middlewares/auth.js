const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cambiame';

function authenticate(req, res, next){
    const authHeader = req.header('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token){
        return res.status(401).json({message: 'Token requerido'});
    }
    try{
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.sub;
        next();
    } catch (err){
        return res.status(401).json({message: 'Token invalido'});
    }
}

module.exports = {authenticate};
