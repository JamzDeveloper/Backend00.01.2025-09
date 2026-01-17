const mongoose = require('mongoose');

async function connectDB() {

    const uri = process.env.MONGOURI;

    if (!uri) throw new Error("MONGO_URI is missing in .env");

    mongoose.set('strictQuery', true);

    await mongoose.connect(uri);

    console.log('MongoDB conectado exitosamente!');
}

module.exports = connectDB;