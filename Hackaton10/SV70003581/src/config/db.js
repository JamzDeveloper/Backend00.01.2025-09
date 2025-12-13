// src/config/db.js

const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;

const client = new MongoClient(uri); //, { maxPoolSize: 20 }
let db;

async function getDB() {
    try{
        if (!db) {
            await client.connect();
            db = client.db(process.env.DB_NAME);            
            console.log("✔️  DB conectada correctamente: ", process.env.DB_NAME);            
        }
        
        return db;
    }catch(error){
        console.error("❌ Error conectando la DB:", error);
    }    
}

async function closeDB() {
    await client.close();    
}

module.exports = { getDB, closeDB };