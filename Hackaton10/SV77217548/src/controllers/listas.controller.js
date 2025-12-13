const {ObjectId} = require('mongodb');
const {getDB} = require('../db');
const {parseDdMmYyToDate} = require('../utils/date-utils');

const COLLECTION = process.env.LISTS_COLLECTION || 'listas';

function buildEstado(items){
    const total = items.length;
    const completados = items.filter((it) => it.esCompletado).length;
    if (total === 0) return 'pendiente';
    if (completados === 0) return 'pendiente';
    if (completados === total) return 'terminado';
    return 'en_proceso';
}

function sanitizeItem(item){
    const fecha = parseDdMmYyToDate(item.fecha);
    return {
        _id: new ObjectId(),
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        fecha,
        esCompletado: item.esCompletado === true,
        creadoEn: new Date(),
        completadoEn: item.esCompletado ? new Date() : null,
    };
}

async function crearLista(req, res) {
    const db = await getDB();
    const {titulo, items} = req.body;
    const ownerId = String(req.userId || '');

    if (!titulo || !Array.isArray(items) || items.length === 0){
        return res.status(400).json({message: 'Se requiere titulo e items'});
    }
    const faltantes = items.filter((it) => !it.nombre || !it.descripcion || !it.fecha);
    if (faltantes.length > 0){
        return res.status(400).json({message: 'Todos los items necesitan nombre, descripcion y fecha (dd/mm/aa)'});
    }

    const itemsSanitizados = items.map(sanitizeItem).map((it) => ({
        ...it,
        esCompletado: false,
        completadoEn: null,
    }));

    const estado = buildEstado(itemsSanitizados);
    const doc = {
        titulo,
        estado,
        ownerId,
        items: itemsSanitizados,
        createdAt: new Date(),
        updatedAt: new Date(),
        eliminado: false,
        deletedAt: null,
    };

    const resultado = await db.collection(COLLECTION).insertOne(doc);
    res.status(201).json({data: {...doc, _id: resultado.insertedId}});
}

async function listarListas(req, res){
    const db = await getDB();
    const ownerId = String(req.userId || '');
    const listas = await db
        .collection(COLLECTION)
        .find({ownerId, eliminado: {$ne: true}})
        .sort({createdAt: -1})
        .toArray();
    res.status(200).json({data: listas});
}

async function obtenerLista(req, res) {
    const { id } = req.params;
    const ownerId = String(req.userId || '');
    if (!ObjectId.isValid(id)){
        return res.status(400).json({message: 'Id no valido'});
    }
    const db = await getDB();
    const lista = await db
        .collection(COLLECTION)
        .findOne({_id: new ObjectId(id), ownerId, eliminado: {$ne: true}});
    if (!lista){
        return res.status(404).json({message: 'Lista no encontrada'});
    }
    res.status(200).json({data: lista});
}

async function duplicarLista(req, res){
    const {id} = req.params;
    const ownerId = String(req.userId || '');
    if (!ObjectId.isValid(id)){
        return res.status(400).json({message: 'Id no valido'});
    }
    const db = await getDB();
    const original = await db
        .collection(COLLECTION)
        .findOne({_id: new ObjectId(id), ownerId, eliminado: {$ne: true}});
    if (!original){
        return res.status(404).json({message: 'Lista no encontrada'});
    }

    const itemsReset = original.items.map((it) => ({
        ...it,
        _id: new ObjectId(),
        esCompletado: false,
        completadoEn: null,
        creadoEn: new Date(),
    }));

    const duplicada = {
        titulo: `${original.titulo} (copia)`,
        estado: 'pendiente',
        ownerId,
        items: itemsReset,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const resultado = await db.collection(COLLECTION).insertOne(duplicada);
    res.status(201).json({data: {...duplicada, _id: resultado.insertedId}});
}

async function marcarItem(req, res){
    const {id, itemId} = req.params;
    const {esCompletado} = req.body;
    const ownerId = String(req.userId || '');

    if (!ObjectId.isValid(id) || !ObjectId.isValid(itemId)){
        return res.status(400).json({message: 'Id no valido'});
    }
    if (typeof esCompletado !== 'boolean'){
        return res.status(400).json({message: 'esCompletado debe ser booleano'});
    }

    const db = await getDB();
    const lista = await db
        .collection(COLLECTION)
        .findOne({_id: new ObjectId(id), ownerId, eliminado: {$ne: true}});
    if (!lista){
        return res.status(404).json({message: 'Lista no encontrada'});
    }

    const items = lista.items.map((it) =>
        it._id.toString() === itemId
        ? {...it, esCompletado, completadoEn: esCompletado ? new Date() : null}
        : it
    );

    const estado = buildEstado(items);
    const updated = await db.collection(COLLECTION).findOneAndUpdate(
        {_id: new ObjectId(id), ownerId, eliminado: {$ne: true}},
        {$set: {items, estado, updatedAt: new Date()}},
        {returnDocument: 'after'}
    );
    const updatedDoc = updated?.value ?? updated;
    if (!updatedDoc){
        return res.status(404).json({message: 'Lista no encontrada'});
    }

    res.status(200).json({data: updatedDoc});
}

async function actualizarLista(req, res){
    const {id} = req.params;
    const ownerId = String(req.userId || '');
    const {titulo, items} = req.body;

    if (!ObjectId.isValid(id)){
        return res.status(400).json({message: 'Id no valido'});
    }
    if (!titulo || !Array.isArray(items) || items.length === 0){
        return res.status(400).json({message: 'Se requiere titulo e items'});
    }
    const faltantes = items.filter((it) => !it.nombre || !it.descripcion || !it.fecha);
    if (faltantes.length > 0){
        return res.status(400).json({message: 'Todos los items necesitan nombre, descripcion y fecha (dd/mm/aa)'});
    }

    const itemsSanitizados = items.map((it) => {
        const fecha = parseDdMmYyToDate(it.fecha);
        return{
            _id: it._id && ObjectId.isValid(it._id) ? new ObjectId(it._id) : new ObjectId(),
            nombre: it.nombre,
            descripcion: it.descripcion || '',
            fecha,
            esCompletado: it.esCompletado === true,
            creadoEn: it.creadoEn ? new Date(it.creadoEn) : new Date(),
            completadoEn: it.esCompletado ? (it.completadoEn ? new Date(it.completadoEn) : new Date()) : null,
        };
    });

    const estado = buildEstado(itemsSanitizados);
    const db = await getDB();
    const resultado = await db.collection(COLLECTION).findOneAndUpdate(
        {_id: new ObjectId(id), ownerId, eliminado: {$ne: true}},
        {$set: {titulo, items: itemsSanitizados, estado, updatedAt: new Date()}},
        {returnDocument: 'after'}
    );
    const updatedDoc = resultado?.value ?? resultado;
    if (!updatedDoc){
        return res.status(404).json({message: 'Lista no encontrada'});
    }
    res.status(200).json({data: updatedDoc});
}

async function eliminarLista(req, res){
    const {id} = req.params;
    const ownerId = String(req.userId || '');
    if (!ObjectId.isValid(id)){
        return res.status(400).json({message: 'Id no valido'});
    }
    const db = await getDB();
    const resultado = await db.collection(COLLECTION).findOneAndUpdate(
        {_id: new ObjectId(id), ownerId, eliminado: {$ne: true}},
        {$set: {eliminado: true, deletedAt: new Date(), updatedAt: new Date()}},
        {returnDocument: 'after'}
    );
    const deletedDoc = resultado?.value ?? resultado;
    if (!deletedDoc){
        return res.status(404).json({message: 'Lista no encontrada'});
    }
    res.status(200).json({data: deletedDoc});
}

module.exports = {crearLista, listarListas, obtenerLista, duplicarLista, marcarItem, eliminarLista, actualizarLista};
