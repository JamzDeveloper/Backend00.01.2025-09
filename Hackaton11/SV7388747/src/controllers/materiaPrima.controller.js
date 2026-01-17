const MateriaPrima = require('../models/MateriaPrima');

exports.getAll = async(req,res,next)=> {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)*limit;

    if(page<1 || limit<1){
        return res.status(400).json({message:"Pagina o limite invalido"});
    }

    const [compras, total] = await Promise.all([
        (await MateriaPrima.find({}).skip(skip).limit(limit).sort({fechaCompra: -1})),
        MateriaPrima.countDocuments({})
    ]);

    res.status(200).json({
        message: "Lista de materia prima",
        page,
        limit,
        total,
        data: compras
    })
};

exports.getById = async(req,res,next)=> {
    const id = req.params.id;
    if(!id){
        return res.status(400).json({message: "ID requerido."})
    };
    const compra = await MateriaPrima.findById(id);
    if(!compra){
        return res.status(404).json({message: 'Compra no encontrada.'})
    };
    res.status(200).json({message: "Compra encontrada", data: compra})
}

exports.comprar = async (req,res,next) => {
    const {nombre, cantidadComprada} = req.body;
    if(!nombre || cantidadComprada<=0) {
        return res.status(400).json({error:"Faltan campos requeridos"});
    };
    const nuevaCompra = await MateriaPrima.create({nombre, cantidadComprada});
    res.status(201).json({message: "Materia Prima comprada", data: nuevaCompra});
}

exports.actualizar = async(req,res,next)=>{
    const id = req.params.id;
    const {nombre, cantidadComprada} = req.body;

    if(!id || (!nombre && cantidadComprada===undefined)){
        return res.status(400).json({message:"Faltan campos requeridos"});
    };

    const compraActualizada = await MateriaPrima.findByIdAndUpdate(
        id,
        {nombre, cantidadComprada},
        {new: true, runValidators: true}
    );

    if(!compraActualizada){
        return res.status(404).json({message: 'Compra no encontrada.'})
    };

    res.status(200).json({message: 'Compra actualizada', data: compraActualizada})
}

exports.eliminarUno = async(req,res,next)=>{
    const id = req.params.id;

    if(!id){
        return res.status(400).json({message: 'ID requerido.'});
    };

    const compraEliminada = await MateriaPrima.findByIdAndDelete(id);
    
    if(!compraEliminada){
        return res.status(404).json({message: 'Compra no encontrada.'})
    }
    
    res.status(204).json({message: 'Compra eliminada exitosamente!'});
}