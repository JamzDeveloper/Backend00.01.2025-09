const HttpError = require('../middlewares/httpError');
const storage = require('../services/storage');

const USERS_FILE = 'users.json';

exports.listUsers = async (req, res) => {
    const users = storage.readJson(USERS_FILE, []);
    res.json({data: users});
};

exports.createUser = async (req, res) => {
    const users = storage.readJson(USERS_FILE, []);
    const nextId = storage.getNextId(users);
    const {name, email} = req.body;
    const user = {
        id: String(nextId),
        name,
        email
    };
    users.push(user);
    storage.writeJson(USERS_FILE, users);
    res.status(201).json(user);
};

exports.getUserById = async (req, res) => {
    const users = storage.readJson(USERS_FILE, []);
    const {id} = req.params;
    const user = users.find((item) => item.id === id);
    if (!user){
        throw new HttpError(404, 'Usuario no encontrado')
    }
    res.json(user);
};
