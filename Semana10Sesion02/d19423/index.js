console.log("Inicio de la aplicacion")
require('dotenv').config()
const express = require('express');
const { alumnoRouter } = require('./alumno.router');
// const {getDB} = require('./db');

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.get('/',(req,res)=>{
    res.send({message:"online"})
})
app.use('/alumnos', alumnoRouter)

app.listen(PORT,()=>{
    // getDB()
    console.log(`Escuchando en el puerto ${PORT}`)
})
// const { MongoClient } = require('mongodb');
// const uri = process.env.MONGOURI;
// const client = new MongoClient(uri);

// async function run() {
//     try {
//         await client.connect();
//         const db = client.db('sample_mflix');
//         const collection = db.collection('movies');

//         const first = await collection.findOne();
//         return first;
//     } catch (error) {
//         throw new Error(error)
//     }
// }

// run().then(data=>{
//     console.log(data);
// })
// .catch(error=>{
//     console.error(error)
// })