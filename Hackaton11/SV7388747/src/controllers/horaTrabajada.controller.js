const HoraTrabajada = require('../models/HoraTrabajada');

exports.getAll = async(req,res,next)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)*limit;

    if(page<1 || limit<1){
        return res.status(400).json({message: "Pagina o limite no validos."})
    }

    const [registros, total] = await Promise.all([
        (await HoraTrabajada.find({}).skip(skip).limit(limit).sort({fechaCompra: -1})),
        HoraTrabajada.countDocuments({})
    ]);

    res.status(200).json({
        message: "Lista de horas trabajadas",
        page,
        limit,
        total,
        data: registros
    })
}

exports.getById = async(req,res,next)=>{
    const id = req.params.id;
    if(!id){
        return res.status(400).json({message:"ID requerido"});
    }
    const registro = await HoraTrabajada.findById(id);
    if(!registro){
        return res.status(404).json({message: "No se encontro registro de horas con ese ID."})
    }
    res.status(200).json({
        message: "Hora trabajada encontrada",
        data: registro
    })
}

exports.registrar = async (req,res,next)=> {
    const { empleadoNombre, horasTrabajadas } = req.body;
    if(!empleadoNombre || horasTrabajadas<=0) {
        return res.status(400).json({message: "Faltan campos requeridos."});
    }
    const nuevoRegistro = await HoraTrabajada.create({empleadoNombre, horasTrabajadas });
    res.status(201).json({message: 'Hora trabajada registrada', data: nuevoRegistro});
}

exports.actualizar = async(req,res,next)=>{
    const id = req.params.id;
    const {nombre, horasTrabajadas} = req.body;

    if(!id || (!nombre && horasTrabajadas===undefined)){
        return res.status(400).json({message: "Faltan campos requeridos."})
    }
    const registroActualizado = await HoraTrabajada.findByIdAndUpdate(
        id,
        {nombre, horasTrabajadas},
        {new: true, runValidators: true}
    )
    if(!registroActualizado){
        return res.status(404).json({message: "No se encontro registro de horas con ese ID."})
    }
    res.status(200).json({message: "Hora trabajada actualizada", data: registroActualizado})
}

exports.eliminarUno = async(req,res,next)=>{
    const id = req.params.id;
    if(!id){
        return res.status(400).json({message: "ID requerido."})
    }
    const registroEliminado = await HoraTrabajada.findByIdAndDelete(id);
    if(!registroEliminado){
        return res.status(404).json({message: "No se encontro registro de horas con ese ID."})
    }
    res.status(204).json({message: "Hora trabajada eliminada."})
}