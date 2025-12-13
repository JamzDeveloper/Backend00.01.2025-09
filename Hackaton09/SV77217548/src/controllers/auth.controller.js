const bcrypt = require('bcrypt');
const {User} = require('../models');
const {AppError} = require('../utils/app-error');
const {generateToken} = require('../middlewares/auth');

async function register(req, res){
    const {firstName, lastName, email, password, role} = req.body;
    if (!firstName || !lastName || !email || !password) throw new AppError('firstName, lastName, email y password son obligatorios', 400);
    const passwordHash = bcrypt.hashSync(password, 10);
    try{
        const user = await User.create({firstName, lastName, email, passwordHash, role: role || 'student'});
        const safe = user.toJSON();
        const token = generateToken(user);
        res.status(201).json({user: safe, token});
    } catch (err){
        if (err.name === 'SequelizeUniqueConstraintError') throw new AppError('El email ya existe', 409);
        throw err;
    }
}

async function login(req, res){
    const {email, password} = req.body;
    if (!email || !password) throw new AppError('email y password son obligatorios', 400);
    const user = await User.scope('withPassword').findOne({where: {email}});
    if (!user) throw new AppError('Credenciales invalidas', 401);
    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) throw new AppError('Credenciales invalidas', 401);
    const token = generateToken(user);
    const safe = user.toJSON();
    delete safe.passwordHash;
    res.json({user: safe, token});
}

module.exports = {register, login};
