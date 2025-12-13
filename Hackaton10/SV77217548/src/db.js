const {MongoClient} = require('mongodb');

const DEFAULT_DB_NAME = 'hackaton10';
let client;
let db;

async function getDB(){
    const uri = process.env.MONGOURI;
    if (!uri){
        throw new Error('Variable MONGOURI no configurada');
    }
    if (!client){
        client = new MongoClient(uri, {maxPoolSize:20});
    }
    if (!db){
        await client.connect();
        const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;
        db = client.db(dbName);
        console.log(`Conectado a la base: ${dbName}`);
    }
    return db;
}

async function closeDB(){
    if (client){
        await client.close();
    }
    client = undefined;
    db = undefined;
}

module.exports = {getDB, closeDB};
