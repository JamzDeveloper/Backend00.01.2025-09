import mongoose, { mongo } from "mongoose";



export async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB conectado")
    }catch(err){
        console.error("Error al conectar MongoDB", err.message);
        process.exit(1);
    }
}