const express = require('express');
require('dotenv').config();
const syncDB = require('./sync-db');

const userRoutes = require('./routes/user.route');
const courseRoutes = require('./routes/course.route');
const lessonRoutes = require('./routes/lesson.route');
const enrollmentRoutes = require('./routes/enrollment.route');
const commentRoutes = require('./routes/comment.route');

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/comments', commentRoutes);

app.get('/health',(req,res)=>{
    res.json({
        ok:true,
        time: new Date()
    });
})

app.listen(process.env.PORT || 3000, async()=>{
    try { 
        await syncDB();
        console.log('Sincronizando base de datos');
    }catch (error){
        console.error(error)
    }
    console.log('Server Ready')
})
