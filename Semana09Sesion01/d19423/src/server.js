console.log("Inicio de la aplicacion")

const express = require('express');
const {sequelize, User} = require('./models');
const syncDB = require('./sync-db');
const {userRouter} = require('./routes/user.route')
const {postRouter} = require('./routes/post.route')
const {commentRouter} = require('./routes/comment.route')


const app = express();

app.use(express.json());
app.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});

app.use('/user',userRouter);
app.use('/post',postRouter);
app.use('/comment',commentRouter);

app.get('/health',(req,res)=>{
    res.json({ok:true})
})

app.listen(process.env.PORT || 3000, async()=>{
    try {
        await syncDB();
        console.log("Sincronizando bse de datos");
    } catch (error) {
        console.error(error)
    }
    console.log("Server Ready")
})