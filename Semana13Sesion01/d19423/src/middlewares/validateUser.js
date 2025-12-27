const HttpError = require("./httpError");
const errorHandler = require('./errorHandler');

exports.validateCreateUser = (req,res,next)=>{
    const {email,name} = req.body || {};
    if(!email||!name) 
        return next(new Error("name y email son requeridos"));
    next();
}

exports.validateAccess = (req,res,next)=>{
    const ok = Math.random()>0.5;
    if(!ok) return res.status(400).json({message:"acceso no valido"}); 
    next();
}