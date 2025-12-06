const express = require('express');
const { getDB } = require('./db');
const { ObjectId } = require('mongodb');
const alumnoRouter = express.Router();

alumnoRouter.get('/',async(req,res)=>{
    try {
        const db = await getDB();
        let registros = await db.collection('alumnos').find().toArray();
        res.status(200).send({data:registros})
    } catch (error) {
        res.status(500).send({message:error})
    }
});
alumnoRouter.get('/:id',async(req,res)=>{
    try {
        const db = await getDB();
        const id = req.params.id;
        let registros = await db.collection('alumnos').find(
            {_id: new ObjectId(id)},
            {projection:{
                nombre:1,
                apellido:1
            }}
        ).toArray();
        res.status(200).send({data:registros})
    } catch (error) {
        res.status(500).send({message:error})
    }
});

alumnoRouter.put('/:id',async(req,res)=>{
    try {
        const db = await getDB();
        const id = req.params.id;
        let {nombre, apellido,edad} = req.body;
        let registros = await db.collection('alumnos').findOneAndUpdate(
            {_id: new ObjectId(id)},
            { $set:{nombre,apellido,edad, updateAt:new Date()}},
            {returnDocument: 'after'}
        )
        res.status(200).send({data:registros.value})
    } catch (error) {
        res.status(500).send({message:error})
    }
})

alumnoRouter.delete('/:id',async(req,res)=>{
    try {
        const db = await getDB();
        const id = req.params.id;
       
        let registros = await db.collection('alumnos').deleteOne(
            {_id: new ObjectId(id)}
        )
        res.status(200).send({data:registros.value})
    } catch (error) {
        res.status(500).send({message:error})
    }
})


alumnoRouter.post('/',async(req,res)=>{
    try {
        const db = await getDB();
        const data = req.body;
        if(Array.isArray(data)){
            db.collection('alumnos').insertMany(data);
        }
        else{
            db.collection('alumnos').insertOne(data);
        }
        res.status(201).send({message:"Guardado correctamente"})
    } catch (error) {
        res.status(500).send({message:error})
    }
})

module.exports = {alumnoRouter}