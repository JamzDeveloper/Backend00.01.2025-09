const dtoCreateOrder = (req,res,next)=>{
    if(!req.body) return res.status(400).json({error: "data required"});

    const {items, customerID} = req.body;

    if(!Array.isArray(items) || items.length ===0) return res.status(400).json({error: "items required"});
    if(!customerID) return res.status(400).json({error: "customerID required"});

    next();
}

module.exports ={
    dtoCreateOrder
}