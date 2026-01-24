require('dotenv').config();
const cors  = require('cors');
const express  = require('express');

const Culqi = require('culqi-node');
const culqi = new Culqi({
    privateKey: process.env.CULQI_PRIVATE_KEY,
    publicKey: process.env.CULQI_PUBLIC_KEY,
    pciCompliant:true
});

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({origin:'*'}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hola desde el back de Culqi")
})

app.post('/api/proccess/pay',async (req,res)=>{
    const product = req.body;
    console.log(product)

    await culqi.tokens.createToken({
        card_number:product.card_number,
        cvv: product.cvv,
        expiration_month: product.month,
        expiration_year: product.year,
        email: product.email
    }).then(data=>{
        try {
            culqi.charges.createCharge({
                amount:product.amount,
                currency_code: product.currency_code,
                email: product.email,
                installments:product.installments,
                description:product.description,
                source_id:data.id
            }).then(respuesta=>{
                console.log(respuesta);
                res.send({message:"Pago correcto"})
            }).catch(err=>{
                res.status(401).send({message:err})
            })

            
        } catch (error) {
            res.status(401).send({message:error})
        }
    }).catch(err2=>{
        console.log(err2)
        res.status(401).send({message:err2})
    })
    
})

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})