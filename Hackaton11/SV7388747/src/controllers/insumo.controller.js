const Insumo = require("../models/Insumo");

exports.comprar = async (req, res, next) => {
    const { nombre, cantidadComprada } = req.body;
    if (!nombre || cantidadComprada <= 0) {
        return res.status(400).json({ error: "Datos invalidos" });
    };
    const nuevaCompra = await Insumo.create({ nombre, cantidadComprada });
    
    res.status(201).json({ message: "Insumo comprado", data: nuevaCompra });
}

exports.getAll = async (req,res,next)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)*limit;

    if(page<1 || limit<1){
        return res.status(400).json({message:"Pagina o limite invalido"});
    }

    const [insumos, total] = await Promise.all([
        (await Insumo.find({}).skip(skip).limit(limit).sort({fechaCompra: -1})),
        Insumo.countDocuments({})
    ]);

    res.status(200).json({
        message: "Lista de insumos",
        page,
        limit,
        total,
        data: insumos
    })
}

exports.getById = async(req,res,next)=>{
    const id = req.params.id;
    if(!id){
        return res.status(400).json({message:"ID requerido"});
    }
    const insumo = await Insumo.findById(id);
    if(!insumo){
        return res.status(404).json({message:"Insumo no encontrado"});
    }
    res.status(200).json({message:"Insumo encontrado", data: insumo})
}

exports.actualizar = async(req,res,next)=>{
    const id = req.params.id;
    const {nombre, cantidadComprada} = req.body;
    if(!id || (!nombre && !cantidadComprada)){
        return res.status(400).json({message:"Faltan campos requeridos."});
    }
    const insumoActualizado = await Insumo.findByIdAndUpdate(
        id,
        {nombre, cantidadComprada},
        {new: true, runValidators: true}
    )
    if(!insumoActualizado){
        return res.status(404).json({message:"Insumo no encontrado."});
    }
    res.status(200).json({message:"Insumo actualizado", data: insumoActualizado})
}

exports.eliminarUno = async(req,res,next)=>{
    const id = req.params.id;
    if(!id){
        return res.status(400).json({message:"ID requerido"});
    }
    const insumoEliminado = await Insumo.findByIdAndDelete(id);
    if(!insumoEliminado){
        return res.status(404).json({message:"Insumo no encontrado"});
    }
    res.status(204).json({message:"Insumo eliminado exitosamente!"})
}