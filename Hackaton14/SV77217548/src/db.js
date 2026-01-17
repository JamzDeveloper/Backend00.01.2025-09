const {MongoClient} = require('mongodb');

const DEFAULT_DB_NAME = 'sv77217548_h14';
const DEFAULT_MESSAGES_COLLECTION = 'messages';
const DEFAULT_USERS_COLLECTION = 'users';

let client;
let db;

async function getDB(){
    const uri = process.env.MONGOURI;
    if (!uri){
        throw new Error('Variable MONGOURI no configurada');
    }
    if (!client){
        client = new MongoClient(uri, {maxPoolSize: 20});
    }
    if (!db){
        await client.connect();
        const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;
        db = client.db(dbName);
        console.log(`Conectado a la base: ${dbName}`);
    }
    return db;
}

async function getMessagesCollection(){
    const database = await getDB();
    const collectionName = process.env.MESSAGES_COLLECTION || DEFAULT_MESSAGES_COLLECTION;
    return database.collection(collectionName);
}

async function getUsersCollection(){
    const database = await getDB();
    const collectionName = process.env.USERS_COLLECTION || DEFAULT_USERS_COLLECTION;
    return database.collection(collectionName);
}

async function closeDB(){
    if (client){
        await client.close();
    }
    client = undefined;
    db = undefined;
}

module.exports = {getDB, getMessagesCollection, getUsersCollection, closeDB};
