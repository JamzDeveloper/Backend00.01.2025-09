const Ticket = require('../models/ticket.model');

function httpError(status, message){
    const err = new Error(message);
    err.status = status;
    return err;
}

exports.createTicket = async(req,res)=>{
    const ticket = await Ticket.create(req.body);
    res.status(201).json(ticket);
}
exports.listTickets = async(req,res)=>{
    const {status, priority, tags, sort} = req.query;
    let page = parseInt(req.query.page||"1",10);
    let limit = parseInt(req.query.limit||"10",10);
    if(page<1) page = 1;
    if(limit<1) limit = 1;
    if(limit>50) limit = 50;
    const filter = {};
    if(status) filter.status = status;
    if(priority) filter.priority = priority;
    if(tags) filter.tags = tags;

    const sortValue = sort||"-createAt";
    const skip = (page-1)*limit;
    console.log(filter)
    const [total, items] = await Promise.all([
        Ticket.countDocuments(filter),
        Ticket.find(filter).sort(sortValue).skip(skip).limit(limit)
    ]);

    res.json({page, limit,total,items});

}

exports.getTicketById = async(req,res)=>{
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket) throw httpError(404,"Ticket Not Found");
    res.json(ticket)
}

exports.replaceTicket = async(req,res)=>{
    const updated = Ticket.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
            overwrite: true
        }
    );
    if(!updated) throw httpError(404,"Ticket Not Found");
    res.json(updated);
}

exports.updateTicket = async(req,res)=>{
    const allowed = ["title","description","status","priority","customerEmail","tags"];
    const payload = {}
    for(const key of allowed){
        if(req.body[key]!==undefined) payload[key] = req.body[key];
    }
    const updated = Ticket.findByIdAndUpdate(
        req.params.id,
        payload,
        {
            new: true,
            runValidators: true,
        }
    );
    if(!updated) throw httpError(404,"Ticket Not Found");
    res.json(updated);
}

exports.deleteTicket = async(req,res)=>{
    const deleted = await Ticket.findByIdAndDelete(req.params.id);
    if(!deleted) throw httpError(404,"Ticket Not Found");
    res.status(204).send();
}

exports.closeTicket = async(req,res)=>{
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket) throw httpError(404,"Ticket Not Found");
    if(ticket.status === "closed") httpError(409,"Ticketis already closed");
    ticket.status = "closed";
    await ticket.save();
    res.json(ticket);
}