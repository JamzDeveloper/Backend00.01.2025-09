const { Comment, sequelize} = require('../models')

exports.createComment = async(req,res)=>{
    const t=await sequelize.transaction();
    try {
        const comment = await Comment.create({
            body: req.body.body.trim(),
            lessonId: req.params.lessonId,
            userId: req.params.userId
        }, {transaction:t});
        await t.commit();
        res.status(201).json(comment);
    } catch (error) {
        await t.rollback();
        res.status(400).json({error: error.message});
    }
}