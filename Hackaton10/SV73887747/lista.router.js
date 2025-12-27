const express = require('express');
const { getDB } = require('./db');
const { ObjectId } = require('mongodb');

const listaRouter = express.Router();

listaRouter.post('/', async(req,res)=>{
    try{
        const db = await getDB();
        const { nombre,descripcion } = req.body;

        if( !nombre || !descripcion ) {
            return res.status(400).send({message: 'Nombre y descripcion son obligatorios'});
        }

        const nuevoItem = {
            nombre, 
            descripcion,
            fecha: new Date(),
            esCompletado: false
        }
        const resultado = await db.collection('compras').insertOne(nuevoItem);

        res.status(201).send({
            message: 'Item agregado a la lista de compras',
            data: {_id: resultado.insertedId, ...nuevoItem}
        });
    }catch(error){
        res.status(500).send({message:error.toString() });
    }
});

listaRouter.get('/pendientes', async (req,res)=>{
    try{
        const db = await getDB();
        const pendientes = await db.collection('compras').find({ esCompletado:false }).sort({fecha:-1}).toArray();

        res.status(200).send({
            message: 'Items pendientes',
            cantidad: pendientes.length,
            data: pendientes
        });
    }catch(error){
        res.status(500).status({ message: error.toString() });
    }
});

listaRouter.get('/completados', async(req,res)=>{
    try{
        const db = await getDB();
        const completados = await db.collection('compras').find({ esCompletado:true }).sort({ fecha:-1 }).toArray();

        res.status(200).send({
            message:'Items completados',
            cantidad: completos.length,
            data: completados
        });
    }catch(error){
        res.status(500).send({ message: error.toString() });
    }
});

listaRouter.put('/completar/:id', async(req,res)=>{
    try{
        const db = await getDB();
        const id = req.params.id;

        if(!ObjectId.isValid(id)){
            return res.status(400).send({ message: 'ID invalido' });
        }

        const resultado = await db.collection('compras').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { esCompletado: true } },
            { returnDocument: 'after' }
        );

        if(!resultado.value){
            return res.status(400).send({ message:'Item no encontrado' });
        }

        res.status(200).send({
            message: 'Item marcado como completado!',
            data: resultado.value
        });
    }catch(error){
        res.status(500).send({ message: error.toString() })
    }
});

module.exports = { listaRouter };