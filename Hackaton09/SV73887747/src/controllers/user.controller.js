const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res)=> {
    try{
        const{firstName, lastName, email, password, role} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        const user = await User.create({firstName, lastName, email, passwordHash, role});
        res.status(201).json(user);
    }catch(error){
        res.status(400).json({error:error.message});
    }
};

exports.getUsers = async (req,res)=>{
    const users = await User.findAll({attributes: {exclude: [passwordHash] } } );
    res.json(users);
}

exports.updateUser = async(req,res)=>{
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if(!user) return res.status(400).json({error: 'Usuario no encontrado'});
    await user.update(req.body);
    res.json(user)
}

exports.deleteUser = async(req,res)=>{
    const userId = req.params.id;
    const deleted = await User.destroy({where: {id: userId}})
    if(!deleted) return res.status(404).json({error: "Usuario no encontrado."});
    res.json({message: "Usuario eliminado."})
}