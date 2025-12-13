const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGOURI,{
        autoIndex: true
    })
    console.log(`MongoDB conectado: ${mongoose.connection.name} `);
}
module.exports = connectDB;