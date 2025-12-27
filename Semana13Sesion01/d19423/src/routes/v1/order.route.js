const router = require('express').Router();
const {dtoCreateOrder} = require('../../middlewares/validateOrders');
const {validateAuth} = require('../../middlewares/validateAuth');

const multer = require('multer');
const upload = multer({
    dest: 'uploads',
    limits: {
        fieldSize: 2*1024*1024,
        files: 1
    }
})

router.use('/',validateAuth);

router.post('/', [dtoCreateOrder], (req,res)=>{
    res.status(201).json({message: "Created", order: req.body})
})

router.post('/envio-captura',upload.single('captura'), (req,res)=>{
    res.json(
        {
            originalName: req.file.originalname,
            storedAt: req.file.filename,
            size: req.file.size
        }
    )
});

const imgOnly = (req,file,cb)=>{
    if(!file.mimetype.startsWith('image/')) return cb(new Error("Only images allowed"));
    cb(null,true);
}

const uploadImage = multer(
    {
        dest: 'uploads',
        fileFilter: imgOnly
    }
);


router.post('/fotos', uploadImage.array('photos',3),(req,res)=>{
    res.json({
        count: req.files.length
    })
})

const cryptoRandom = ()=>{
    return Math.random().toString(36).slice(2);
}

const seen = new Map();

router.post('/payment',(req,res)=>{
    const key = req.headers['idempotency-key'];
    if(!key) return res.status(400).json({error: 'header required'});
    if(seen.has(key)) return res.status(200).json(seen.get(key));
    const result = {paymentID: cryptoRandom(), status: 'ok'};
    seen.set(key, result);
    res.status(201).json(result);
})

module.exports = router;