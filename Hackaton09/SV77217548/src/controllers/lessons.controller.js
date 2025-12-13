const {Lesson, Course} = require('../models');
const {AppError} = require('../utils/app-error');
const {buildPagination} = require('../utils/pagination');

async function createLesson(req, res){
    const pathCourseId = req.params.courseId;
    const bodyCourseId = req.body.courseId;
    if (pathCourseId && bodyCourseId && Number(pathCourseId) !== Number(bodyCourseId)) {
        throw new AppError('courseId del path y del body no coinciden', 400);
    }
    const courseId = pathCourseId || bodyCourseId;
    const {title, body, order} = req.body;
    if (!title || !body || !courseId) throw new AppError('title, body y courseId son obligatorios', 400);
    const course = await Course.findByPk(courseId);
    if (!course) throw new AppError('Curso no encontrado', 404);
    const lesson = await Lesson.create({title, body, order, courseId});
    res.status(201).json(lesson);
}

async function listLessons(req, res){
    const {page, pageSize, offset, limit} = buildPagination(req.query);
    const where = {};
    if (req.params.courseId) where.courseId = req.params.courseId;
    const {rows, count} = await Lesson.scope('ordered').findAndCountAll({where, limit, offset});
    res.json({total: count, page, pageSize, data: rows});
}

async function updateLesson(req, res){
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) throw new AppError('Leccion no encontrada', 404);
    const {title, body, order} = req.body;
    await lesson.update({title, body, order});
    res.json(lesson);
}

async function deleteLesson(req, res){
    const deleted = await Lesson.destroy({where: {id: req.params.id}});
    if (!deleted) throw new AppError('Leccion no encontrada', 404);
    res.json({message: 'Leccion eliminada (soft delete)'});
}

async function restoreLesson(req, res){
    const lesson = await Lesson.findByPk(req.params.id, {paranoid: false});
    if (!lesson) throw new AppError('Leccion no encontrada', 404);
    await Lesson.restore({where: {id: req.params.id}});
    res.json({message: 'Leccion restaurada'});
}

module.exports = {createLesson, listLessons, updateLesson, deleteLesson, restoreLesson};
