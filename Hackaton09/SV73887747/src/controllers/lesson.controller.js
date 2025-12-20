const { Lesson, Course, sequelize} = require('../models');

const slugify = str => str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

exports.createLesson = async(req,res)=>{
    const t = await sequelize.transaction();
    try {
        const course = await Course.findByPk(req.params.courseId, { transaction: t} );
        if(!course) throw new Error('Curso no encontrado');

        const count = await Lesson.count({where: {courseId: req.params.courseId}, transaction:t} );
        const lesson = await Lesson.create({
            ...req.body,
            slug: slugify(req.body.title),
            courseId: req.params.courseId,
            order: count + 1
        }, {transaction:t});

        await t.commit();
        res.status(201).json(lesson);

    } catch (error) {
        await t.rollback();
        res.status(400).json({error: error.message});
    }
};

exports.getLessonsByCourse = async(req,res)=>{
    const lessons = await Lesson.findAll({
        where: {courseId: req.params.courseId},
        order: [['order', 'ASC']]
    });
    res.json(lessons);
}