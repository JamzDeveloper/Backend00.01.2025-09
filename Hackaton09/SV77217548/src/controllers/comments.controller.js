const {Comment, Lesson, User} = require('../models');
const {AppError} = require('../utils/app-error');
const {buildPagination} = require('../utils/pagination');

async function createComment(req, res){
    const {lessonId} = req.params;
    const {body} = req.body;
    if (!body) throw new AppError('body es obligatorio', 400);
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) throw new AppError('Leccion no encontrada', 404);
    if (!req.user) throw new AppError('No autenticado', 401);
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('Usuario no encontrado', 404);
    const comment = await Comment.create({body, lessonId, userId});
    res.status(201).json(comment);
}

async function listComments(req, res){
    const {lessonId} = req.params;
    const {page, pageSize, offset, limit} = buildPagination(req.query);
    const {rows, count} = await Comment.findAndCountAll({
        where: {lessonId},
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [{model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'email']}],
    });
    res.json({total: count, page, pageSize, data: rows});
}

module.exports = {createComment, listComments};
