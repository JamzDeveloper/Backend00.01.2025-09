const {AppError} = require('../utils/app-error');

function notFound(req, res, next) {
    next(new AppError('No encontrado', 404));
}

function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    res.status(status).json({message: err.message || 'Error interno del servidor'});
}

module.exports = {notFound, errorHandler};
