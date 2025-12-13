require('dotenv').config();
const PORT = process.env.PORT || 8080

const app = require('./app');
const connectDB = require('./config/db');

(async()=>{
    await connectDB();
    app.listen(PORT,()=> console.log(`API running in ${PORT}`))
})();