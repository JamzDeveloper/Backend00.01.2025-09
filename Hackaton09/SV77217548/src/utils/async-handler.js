// Envuelve controladores async y pasa errores a next() para que los maneje el middleware de errores
function asyncHandler(fn){
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {asyncHandler};