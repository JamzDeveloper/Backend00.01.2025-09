const Produccion = require('../models/Produccion');

exports.producir = async (req,res,next) => {
    const {cantidadArmarios } = req.body || {};
    if(cantidadArmarios<=0 || !cantidadArmarios) {
        return res.status(400).json({error:"Cantidad Invalida"});
    };

    const tablonesUsados = cantidadArmarios*3;
    const gomaUsada = cantidadArmarios*0.25;
    const horasUsadas = cantidadArmarios*8;

    const nuevaProduccion = await Produccion.create({
        cantidadArmarios,
        tablonesUsados,
        gomaUsada,
        horasUsadas
    });
    res.status(201).json({message: "Produccion registrada", data: nuevaProduccion});
}

exports.getAll = async(req,res,next)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)*limit;

    if(page<1 || limit<1){
        return res.status(400).json({message:"Pagina o limite invalido"});
    }

    const [compras, total] = await Promise.all([
        (await Produccion.find({}).skip(skip).limit(limit).sort({fechaCompra: -1})),
        Produccion.countDocuments({})
    ]);
    res.status(200).json({
        message: "Lista de producciones",
        page,
        limit,
        total,
        data: compras
    })
}

exports.getById = async(req,res,next)=>{
    const id = req.params.id;
    if(!id){
        return res.status(400).json({message:"ID requerido"});
    };
    const produccion = await Produccion.findById(id);
    if(!produccion){
        return res.status(404).json({message: "Produccion no encontrada"});
    }
    res.status(200).json({message: "Produccion encontrada", data: produccion})
}

exports.actualizar = async(req,res,next)=>{
    const id = req.params.id;
    const {cantidadArmarios} = req.body;
    if(!id || !cantidadArmarios){
        return res.status(400).json({message:"Faltan campos requeridos"});
    }
    const produccionActualizada = await Produccion.findByIdAndUpdate(
        id,
        {cantidadArmarios},
        {new: true, runValidators: true}
    )
    if(!produccionActualizada){
        return res.status(404).json({message: "Produccion no encontrada"});
    }
    res.status(200).json({message: "Produccion actualizada", data: produccionActualizada})
}

exports.eliminarUno = async(req,res,next)=>{
    const id = req.params.id;
    if(!id){
        return res.status(400).json({message:"ID requerido"});
    }
    const insumoEliminado = await Produccion.findByIdAndDelete(id);
    if(!insumoEliminado){
        return res.status(404).json({message:"Produccion no encontrada"});
    }
    res.status(204).json({message:"Produccion eliminada exitosamente!"})
}