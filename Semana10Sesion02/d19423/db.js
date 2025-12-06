const {MongoClient} = require('mongodb');
const uri = process.env.MONGOURI;

const client = new MongoClient(uri,{maxPoolSize:20});
let db;

async function getDB() {
    if(!db){
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log("Base Conectada");
    }
    return db;
}

async function closeDB() {
    await client.close();
}

module.exports = {db, getDB,closeDB};