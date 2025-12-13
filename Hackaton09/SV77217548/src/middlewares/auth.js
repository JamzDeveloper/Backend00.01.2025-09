const jwt = require('jsonwebtoken');
const {User} = require('../models');
const {AppError} = require('../utils/app-error');

function generateToken(user){
    const payload = {id: user.id, role: user.role, email: user.email};
    return jwt.sign(payload, process.env.JWT_SECRET || 'cambiame',{
        expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    });
}

async function authenticate(req, res, next){
    try{
        const header = req.headers.authorization || '';
        const [, token] = header.split(' ');
        if (!token) throw new AppError('Token requerido', 401);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cambiame');
        const user = await User.findByPk(decoded.id);
        if (!user) throw new AppError('Usuario no encontrado', 401);
        req.user = { id: user.id, role: user.role, email: user.email };
        next();
    } catch (err){
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError'){
            return next(new AppError('Token invalido o expirado', 401));
        }
        next(err);
    }
}

function authorizeRoles(...roles){
    return (req, res, next) => {
        if (!req.user) return next(new AppError('No autenticado', 401));
        if (!roles.includes(req.user.role)) return next(new AppError('No autorizado', 403));
        next();
    };
}

module.exports = {generateToken, authenticate, authorizeRoles};
