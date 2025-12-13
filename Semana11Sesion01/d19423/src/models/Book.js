const {Schema, model, Types} = require('mongoose');

const bookSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    year:{
        type: Number,
        min:[1450,'Año demasiado antiguo'],
        max:[new Date().getFullYear(), "Año en el futuro no permitido"]
    },
    author:{
        type: Types.ObjectId,
        ref:'Author',
        required: true 
    },
    tags:[
        {
            type: String,
            lowercase:true,
            trim: true
        }
    ],
    price:{
        type: Number,
        required: true,
        min: 0,
        set: v=>Math.round(v*100)/100
    },
    inStock:{
        type: Boolean,
        default: true,
    },
    deletedAt:{
        type: Date,
        default: null
    }
},{timestamps:true});

bookSchema.index({title: 'text'});
bookSchema.virtual('isClassic').get(function(){
    return this.year && this.year < 1980
});

module.exports = model('Book', bookSchema);