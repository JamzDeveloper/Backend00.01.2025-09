module.exports = function conditionalLogger(req, res, next){
    const allowed = ['POST', 'PUT'];
    if (!allowed.includes(req.method)){
        return next()
    };
    // Logger condicional solo para POST y PUT.
    req.skipLogger = true;
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
        console.log(`${req.method} ${req.originalUrl} - ${durationMs.toFixed(2)}ms`);
    });
    next();
};
