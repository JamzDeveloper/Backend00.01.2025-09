const { ObjectId } = require('mongodb');
const {getDB} = require('../config/db');
const moment = require('moment');

exports.addItem = async (req,res) => {
    try{
        const db = await getDB();
        const data = req.body;
        if(Array.isArray(data)){
            data.forEach(e =>{
                e.fecha = moment().format('D MMMM YYYY, h:mm:ss a');
                e.completado = false;
            });            
            await db.collection('items').insertMany(data);
        }else{
            data.fecha = moment().format('D MMMM YYYY, h:mm:ss a');
            data.completado = false;
            await db.collection('items').insertOne(data);
        }
        res.status(201).send({message:"Item guardado correctamente"});
    }catch(error){
        res.status(500).send({message:error.message});
    }
}

exports.getItem = async (req,res) => {
    try{
        const db = await getDB();
        const id = req.params.id;
        const data = await db.collection('items').findOne({_id: new ObjectId(id)});
        return res.status(200).json(data);
    }catch(error){
        return res.status(500).send({message:error.message})
    }
}

exports.updateItem = async (req,res) => {
    try{
        const db = await getDB();
        const id = req.params.id;
        const data = req.body;
        await db.collection('items').updateOne(
            {_id: new ObjectId(id)}, {
                $set: {
                    /*nombre: data.nombre,
                    descripcion: data.descripcion,*/
                    completado: data.completado || false,
                    updateAt: moment().format('D MMMM YYYY, h:mm:ss a')}
            });
        return res.status(200).send({message:"Item actualizado correctamente"});
    }catch(error){
        return res.status(500).send({message:error.message});
    }
}

exports.deleteItem = async (req,res) => {
    try{
        const db = await getDB();
        const id = req.params.id;
        await db.collection('items').deleteOne({_id: new ObjectId(id)});
        return res.status(200).send({message:"Item eliminado correctamente"});
    }catch(error){
        return res.status(500).send({message:error.message});
    }
}

exports.getItems = async (req,res) => {
    try{
        const db = await getDB();
        const data = await db.collection('items').find().toArray();        
        return res.status(200).json(data);        
    }catch(error){        
        return res.status(500).send({message:error.message})
    }
}

exports.getPendingItems = async (req,res) => {
    try{
        const db = await getDB();        
        const data = await db.collection('items').find({completado: false}).toArray();        
        return res.status(200).json(data);
    }catch(error){        
        return res.status(500).send({message:error.message})
    }
}

exports.getCompletedItems = async (req,res) => {
    try{
        const db = await getDB();
        const data = await db.collection('items').find({completado: true}).toArray();   
        return res.status(200).json(data);
    }catch(error){
        return res.status(500).send({message:error.message})
    }
}