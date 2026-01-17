const HttpError = require('./httpError');

exports.validateCreateUser = (req, res, next) => {
    const {name, email} = req.body || {};
    if (!name || !email){
        return next(new HttpError(400, 'name y email son requeridos'))
    }
    if (!email.includes('@')){
        return next(new HttpError(400, 'email invalido'))
    }
    next();
};
