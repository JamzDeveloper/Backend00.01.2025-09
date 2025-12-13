const express = require('express');
const morgan = require('morgan');
const ticketRoute = require('./routes/ticket.route')
const errorHandler = require('./middlewares/errorHandler')

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req,res)=> res.json({ok:true}));
app.use('/api/tickets', ticketRoute);

app.use(errorHandler);

module.exports = app;