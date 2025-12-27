const http = require('node:http');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const listSales = [];
const dataFilePath = path.join(__dirname, 'listSales.json');

const sendJson = (res, statusCode, payload) => {
    res.writeHead(statusCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(payload));
};

const getJsonBody = (req) =>
    new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            if (!body) return resolve({});
            try{
                const parsed = JSON.parse(body);
                return resolve(parsed);
            } catch (error){
                return reject(error);
            }
        });

        req.on('error', reject);
  });

const loadData = () => {
    try{
        const content = fs.readFileSync(dataFilePath, 'utf8');
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)){
            listSales.push(...parsed);
        }
    } catch (error){
        // Si no existe archivo se usa lista vacia.
    }
};

const persistData = () => {
    try{
        fs.writeFileSync(dataFilePath, JSON.stringify(listSales, null, 2));
    } catch (error){
        console.error('No se pudo guardar la data', error);
    }
};

loadData();

const server = http.createServer((req, res) => {
    const {method, url} = req;
    const parsedUrl = new URL(url, 'http://localhost');
    const pathname = parsedUrl.pathname;
    const status = parsedUrl.searchParams.get('status');

    if (method === 'GET' && pathname === '/api/lista'){
        if (status === 'pendiente'){
            const pendientes = listSales.filter((item) => item.esCompletado === false);
            return sendJson(res, 200, pendientes);
        }
        if (status === 'completado'){
            const completados = listSales.filter((item) => item.esCompletado === true);
            return sendJson(res, 200, completados);
        }
        return sendJson(res, 200, listSales);
    }

    if (method === 'GET' && pathname === '/api/lista/pendientes'){
        const pendientes = listSales.filter((item) => item.esCompletado === false);
        return sendJson(res, 200, pendientes);
    }

    if (method === 'GET' && pathname === '/api/lista/completados'){
        const completados = listSales.filter((item) => item.esCompletado === true);
        return sendJson(res, 200, completados);
    }

    if (method === 'POST' && pathname === '/api/lista'){
        return getJsonBody(req)
            .then((body) => {
                const {name, description, date, esCompletado} = body;
                const faltaCampo =
                    typeof name !== 'string' ||
                    typeof description !== 'string' ||
                    typeof date !== 'string' ||
                    typeof esCompletado !== 'boolean';

                if (faltaCampo){
                    return sendJson(res, 400, {message: 'faltan campos'});
                }
                const newItem = {id: crypto.randomUUID(), name, description, date, esCompletado};
                listSales.push(newItem);
                persistData();
                return sendJson(res, 201, newItem);
            })
            .catch(() => sendJson(res, 400, {message: 'invalid json'}));
    }

    if ((method === 'PUT' || method === 'DELETE') && pathname.startsWith('/api/lista/')){
        const parts = pathname.split('/');
        const id = parts[3];
        if (!id){
            return sendJson(res, 404, {message: 'endpoint not found'});
        }
        const index = listSales.findIndex((item) => item.id === id);
        if (index === -1){
            return sendJson(res, 404, {message: 'item not found'});
        }
        if (method === 'PUT'){
            return getJsonBody(req)
                .then((body) => {
                    const {esCompletado} = body;
                    if (typeof esCompletado !== 'boolean'){
                        return sendJson(res, 400, {message: 'faltan campos'});
                    }
                    listSales[index].esCompletado = esCompletado;
                    persistData();
                    return sendJson(res, 200, listSales[index]);
                })
                .catch(() => sendJson(res, 400, {message: 'invalid json'}));
        }
        const removed = listSales.splice(index,1)[0];
        persistData();
        return sendJson(res, 200, removed);
    }
    return sendJson(res, 404, {message: 'endpoint not found'});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
