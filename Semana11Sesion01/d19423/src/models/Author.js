const {Schema, model} = require('mongoose');

const authorSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 80
    },
    country:{
        type: String,
        trim: true,
        default: "Desconocido"
    }
},{timestamps:true});

authorSchema.index({name:1},{unique:true});

module.exports = model("Author", authorSchema);