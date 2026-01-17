const express = require('express');
const morgan = require('morgan');

const materiaPrimaRoute = require('./routes/materiaPrima.route');
const insumoRoute = require('./routes/insumo.route');
const horaTrabajadaRoute = require('./routes/horaTrabajada.route');
const produccionRoute = require('./routes/produccion.route');
const e = require('express');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => res.json({ok: true}));
app.use('/api/materiaPrima', materiaPrimaRoute);
app.use('/api/insumos', insumoRoute);
app.use('/api/horasTrabajadas', horaTrabajadaRoute);
app.use('/api/producciones', produccionRoute);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: err.message,
        stack: err.stack
    })
});

module.exports = app;