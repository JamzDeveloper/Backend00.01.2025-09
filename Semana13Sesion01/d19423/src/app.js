const fs = require("fs");
const path = require('path');

const express = require('express');


const morgan = require('morgan');
const helmet = require('helmet')
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const logger = require('./middlewares/logger');
const error = require('./middlewares/errorHandler');


const router = require('./routes');

const app = express();

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
//app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(cors({
    origin: process.env.ORIGINS,
    methods:["GET", "POST"]
}))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
})

app.use(limiter)

console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV==='production')
    app.set('trust proxy',1)

app.use(express.json({limit:'200kb'}));
app.use(express.urlencoded({extended:true}));

app.use(logger);
app.use(error);

app.use('/api',router)


module.exports = app;