module.exports = function logger(req, res, next){
    if (req.skipLogger){
        return next()
    };
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
        // Muestra Metodo / URL / duración.
        console.log(`${req.method} ${req.originalUrl} - ${durationMs.toFixed(2)}ms`);
    });
    next();
};
