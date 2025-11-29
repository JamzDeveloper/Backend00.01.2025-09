const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');

exports.addUser = (req,res)=>{
    const usuarioNuevo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 8)
    };
    User.create(usuarioNuevo).then(data=>{
        res.status(201).send(data)
    }).catch(error=>{
        res.status(500).send({message:error});
    })
}
exports.updateUser = async (req,res)=>{
    let userId = req.params.id;
    const usuarioNuevo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 8)
    };
    await User.update(usuarioNuevo,{
        where: {
            id: userId
        }
    }).then(result=>{
        res.status(200).send({message: "Actualizado correctamente"})
    }).catch(error=>{
        res.status(500).send({message:error})
    })
}

exports.deleteUser = async(req,res)=>{
    let userId = req.params.id;
    await User.destroy({
        where: {
            id:userId
        }
    }).then(()=>{
         res.status(200).send({message: "Borrado correctamente"})
    }).catch(error=>{
        res.status(500).send({message:error})
    })
}