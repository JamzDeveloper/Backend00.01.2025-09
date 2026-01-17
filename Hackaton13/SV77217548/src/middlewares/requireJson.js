module.exports = function requireJson(req, res, next){
    const methodsWithBody = ['POST', 'PUT', 'PATCH'];
    if (!methodsWithBody.includes(req.method)){
        return next()
    };

    const contentType = req.headers['content-type'] || '';
    // Verifica si estoy subiendo una iamgen antes de bloquear por no ser application/json.
    if (contentType.includes('multipart/form-data')){
        return next()
    };
    // Bloquea peticiones sin content-type(application/json).
    if (!contentType.includes('application/json')){
        return res.status(415).json({error: 'Content-Type debe ser application/json'})
    };

    return next();
};
