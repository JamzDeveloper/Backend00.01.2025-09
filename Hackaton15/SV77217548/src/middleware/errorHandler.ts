import {Request, Response, NextFunction} from "express";

const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err.name === "ValidationError"){
        res.status(400).json({message: err.message});
        return;
    }

    if (err.name === "CastError"){
        res.status(400).json({message: "Id invalido"});
        return;
    }

    const anyError = err as {code?: number};
    if (anyError.code === 11000){
        res.status(400).json({message: "Dato duplicado"});
        return;
    }

    res.status(500).json({message: "Error inesperado"});
};

export default errorHandler;
