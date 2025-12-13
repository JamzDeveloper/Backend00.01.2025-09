const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db');

const USERS_COLLECTION = process.env.USERS_COLLECTION || 'users';
const JWT_SECRET = process.env.JWT_SECRET || 'cambiame';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function normalizeEmail(email){
    return (email || '').trim().toLowerCase();
}

function signToken(userId){
    return jwt.sign({sub: userId}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
}

async function register(req, res){
    const db = await getDB();
    const { email, password } = req.body;
    const emailNormalizado = normalizeEmail(email);
    
    if (!emailNormalizado || !password){
        return res.status(400).json({message: 'Email y password son requeridos'});
    }
    if (password.length < 5){
        return res.status(400).json({message: 'Password minimo 5 caracteres'});
    }

    const existing = await db.collection(USERS_COLLECTION).findOne({email: emailNormalizado});
    if (existing){
        return res.status(409).json({message: 'Email ya registrado'});
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        email: emailNormalizado,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.collection(USERS_COLLECTION).insertOne(user);
    const token = signToken(result.insertedId.toString());

    res.status(201).json({
        data: {_id: result.insertedId, email: emailNormalizado},
        token,
    });
}

async function login(req, res){
    const db = await getDB();
    const {email, password} = req.body;
    const emailNormalizado = normalizeEmail(email);

    if (!emailNormalizado || !password){
        return res.status(400).json({message: 'Email y password son requeridos'});
    }

    const user = await db.collection(USERS_COLLECTION).findOne({email: emailNormalizado});
    if (!user){
        return res.status(401).json({message: 'Credenciales invalidas'});
    }

    const isValid = await bcrypt.compare(password, user.passwordHash || '');
    if (!isValid){
        return res.status(401).json({message: 'Credenciales invalidas'});
    }

    const token = signToken(user._id.toString());
    res.status(200).json({
        data: { _id: user._id, email: user.email },
        token,
    });
}

module.exports = {register, login};
