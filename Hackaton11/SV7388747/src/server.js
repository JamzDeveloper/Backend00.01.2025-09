require('dotenv').config();
const app = require('./app');

const connectDB = require('./config/db');

const PORT = process.env.PORT || 8000;

(async() => {
    try{
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`Servidor iniciado en el puerto ${PORT} 🚀`)
        })
    }catch(error){
        console.error('Error al iniciar', error);
        process.exit(1);
    }
})();
