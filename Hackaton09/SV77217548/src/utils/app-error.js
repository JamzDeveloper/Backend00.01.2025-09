// Error personalizado con statusCode por defecto 500 para enviarlo al middleware de errores
class AppError extends Error {
    constructor(message, statusCode = 500){
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = {AppError};
