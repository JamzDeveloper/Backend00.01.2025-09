const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const {logger, requireJson, metrics, conditionalLogger} = require('./middlewares');
const errorHandler = require('./middlewares/errorHandler');

const router = require('./routes');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

const rawOrigins = process.env.ORIGINS || '';
const allowedOrigins = rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins.length ? allowedOrigins : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}

app.use(express.json({limit: '200kb'}));
app.use(express.urlencoded({extended: true}));

// Middleware de metricas para monitorear las rutas.
app.use(metrics.trackMetrics);
// Logger condicional solo para POST y PUT.
app.use(conditionalLogger);
app.use(logger);
app.use(requireJson);

app.use('/api', router);

app.use(errorHandler);

module.exports = app;
