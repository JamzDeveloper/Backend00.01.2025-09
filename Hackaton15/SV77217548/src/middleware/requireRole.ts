import {Request, Response, NextFunction} from "express";

const requireRole = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const role = req.session?.user?.role || req.auth?.role;

    if (!role){
        return res.status(401).json({message: "Autenticacion requerida"});
    }

    if (!roles.includes(role)){
        return res.status(403).json({message: "No tienes permisos"});
    }

    return next();
};

export default requireRole;
