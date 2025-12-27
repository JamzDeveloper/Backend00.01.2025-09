const controllerHealth = require('../controllers/health');
const v1Router = require('./v1')

const router = require('express').Router();


router.get("/health",controllerHealth.getHealthAPI);
router.post("/health",(req,res)=>res.json({status:"Ok desde POST"}));

router.route('/profile')
    .get((req,res)=>res.json({message:"GET Profile"}))
    .post((req,res)=>res.json({message:"POST Profile"}))
    .put((req,res)=>res.json({message:"PUT Profile"}))
    .delete((req,res)=>res.json({message:"DELETE Profile"}))
    .patch((req,res)=>res.json({message:"PATCH Profile"}))


    
router.use('/user',require('./user.route'))
router.use('/v1',v1Router);

module.exports = router;