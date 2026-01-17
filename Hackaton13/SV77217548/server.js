console.log("Inicio de la aplicacion");

require('dotenv').config();

const app = require('./src/app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
