import {Request, Response, NextFunction} from "express";

const requireAuthSession = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.user){
        return res.status(401).json({message: "No hay sesion activa"});
    }
    return next();
};

export default requireAuthSession;
