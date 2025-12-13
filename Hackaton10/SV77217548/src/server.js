console.log('Inicio de la aplicacion');

require('dotenv').config();

const cors = require('cors'); // Para poder usar mi front desde otro puerto
const express = require('express');
const routes = require('./routes');
const {notFound, errorHandler} = require('./middlewares/error-handler');
const {getDB} = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ok: true, timestamp: new Date().toISOString()});
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API lista en http://localhost:${PORT}`);
    getDB().catch((err) => {
        console.error('No se pudo conectar a MongoDB', err.message);
    });
});
