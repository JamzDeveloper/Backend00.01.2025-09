const HttpError = require('./httpError');

const dtoCreateOrder = (req, res, next) => {
    const {items, customerId} = req.body || {};
    if (!Array.isArray(items) || items.length === 0){
        return next(new HttpError(400, 'items requeridos'))
    }
    if (!customerId){
        return next(new HttpError(400, 'customerId requerido'))
    }
    next();
};

module.exports = {dtoCreateOrder};
