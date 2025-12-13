console.log("Inicio de la aplicacion")

require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const {errorHandler, notFound} = require('./middlewares/error-handler');
//const {sequelize} = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;
//console.log(DB_HOST);

app.use(express.json());

app.get('/health', (req, res) => res.json({ok: true, timestamp: new Date().toISOString()}));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API lista en http://${DB_HOST}:${PORT}`);
    /* Ahora uso migraciones con sequelize cli
    // Sincroniza al iniciar si DB_SYNC se configuró con alter o force
    const strategy = process.env.DB_SYNC || 'none';
    if (strategy !== 'none') {
        sequelize
        .sync(strategy === 'alter' ? {alter: true, logging: false} : strategy === 'force' ? {force: true, logging: false} : {})
        .then(() => console.log(`[sync] strategy=${strategy}`))
        .catch((err) => console.error(err));
    }
    */
});


