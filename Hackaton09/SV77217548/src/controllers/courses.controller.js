const {Course, Lesson, User, Op, Enrollment, sequelize} = require('../models');
const {AppError} = require('../utils/app-error');
const {buildPagination} = require('../utils/pagination');
const {invalidateCoursesCache} = require('../middlewares/cache');

function parseOrder(orderParam){
    if (!orderParam) return [['createdAt', 'DESC']];
    const [field, direction] = orderParam.split(':');
    const dir = direction && direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    return [[field || 'createdAt', dir]];
}

// Ahora requiere ser admin o instructor para crear un curso.
async function createCourse(req, res){
    const {title, description, ownerId, published, metadata} = req.body;
    if (!title || !description || !ownerId) throw new AppError('title, description y ownerId son obligatorios', 400);
    if (req.user && !['admin', 'instructor'].includes(req.user.role)) throw new AppError('Solo admin o instructor pueden crear cursos', 403);
    const owner = await User.findByPk(ownerId);
    if (!owner) throw new AppError('Owner no encontrado', 404);
    if (!['admin', 'instructor'].includes(owner.role)) throw new AppError('Owner debe ser admin o instructor', 400);
    if (metadata !== undefined && (typeof metadata !== 'object' || metadata === null)) throw new AppError('metadata debe ser un objeto JSON', 400);
    try {
        const course = await Course.create({title, description, ownerId, published: published ?? false, metadata: metadata ?? {}});
        invalidateCoursesCache();
        res.status(201).json(course);
    } catch (err){
        if (err.name === 'SequelizeUniqueConstraintError') throw new AppError('El titulo o slug ya existe', 409);
        throw err;
    }
}

async function listCourses(req, res){
    const {page, pageSize, offset, limit} = buildPagination(req.query);
    const where = {};
    if (typeof req.query.published !== 'undefined') where.published = req.query.published === 'true';
    if (req.query.q){
        const q = `%${req.query.q.trim().toLowerCase()}%`;
        where[Op.or] = [{title: {[Op.iLike]: q}}, {description: {[Op.iLike]: q}}];
    }
    if (req.query.createdAt_gte || req.query.createdAt_lte) {
        where.createdAt = {};
        if (req.query.createdAt_gte) where.createdAt[Op.gte] = new Date(req.query.createdAt_gte);
        if (req.query.createdAt_lte) where.createdAt[Op.lte] = new Date(req.query.createdAt_lte);
    }
    const order = parseOrder(req.query.order);
    const {rows, count} = await Course.findAndCountAll({
        where,
        limit,
        offset,
        order,
        include: [{model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email']}],
        distinct: true,
    });
    res.json({total: count, page, pageSize, data: rows});
}

/* Actualización de la función para sacar detalles por slug.
async function getCourse(req, res){
    const course = await Course.findByPk(req.params.id, {
        include: [{model: Lesson, as: 'lessons', attributes: ['id', 'title', 'slug', 'order'], separate: true, order: [['order', 'ASC']]}],
    });
    if (!course) throw new AppError('Curso no encontrado', 404);
    res.json(course);
}
*/

async function getCourseBySlug(req, res) {
    const course = await Course.findOne({
        where: {slug: req.params.slug},
        include: [
            {model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email']},
            {model: Lesson, as: 'lessons', attributes: ['id', 'title', 'slug', 'order'], separate: true, order: [['order', 'ASC']]},
        ],
    });
    if (!course) throw new AppError('Curso no encontrado', 404);
    const studentsCount = await course.countStudents({through: {where: {status: 'active'}}});
    res.json({...course.toJSON(), stats: {lessonsCount: course.lessons.length, studentsCount}});
}

// Ahora requiere ser admin o instructor para actualizar un curso.
async function updateCourse(req, res){
    const course = await Course.findByPk(req.params.id);
    if (!course) throw new AppError('Curso no encontrado', 404);
    if (req.user && !['admin', 'instructor'].includes(req.user.role) && req.user.id !== course.ownerId)
        throw new AppError('No autorizado para actualizar este curso', 403);
    const {title, description, published, ownerId, metadata} = req.body;
    if (metadata !== undefined && (typeof metadata !== 'object' || metadata === null)){
        throw new AppError('metadata debe ser un objeto JSON', 400);
    }
    if (ownerId !== undefined){
        const owner = await User.findByPk(ownerId);
        if (!owner) throw new AppError('Nuevo owner no encontrado', 404);
        if (!['admin', 'instructor'].includes(owner.role)) throw new AppError('El owner debe ser admin o instructor', 400);
    }
    try{
        await course.update({title, description, published, ownerId, metadata});
        invalidateCoursesCache();
        res.json(course);
    } catch (err){
        if (err.name === 'SequelizeUniqueConstraintError') throw new AppError('El titulo o slug ya existe', 409);
        throw err;
    }
}

/* Ahora requiere que sea admin o instructor para poder eliminar.
async function deleteCourse(req, res){
    const deleted = await Course.destroy({where: {id: req.params.id}});
    if (!deleted) throw new AppError('Curso no encontrado', 404);
    res.json({message: 'Curso eliminado (soft delete)'});
}
*/

async function deleteCourse(req, res) {
    const course = await Course.findByPk(req.params.id);
    if (!course) throw new AppError('Curso no encontrado', 404);
    if (req.user && !['admin', 'instructor'].includes(req.user.role) && req.user.id !== course.ownerId)
        throw new AppError('No autorizado para eliminar este curso', 403);
    await Course.destroy({where: {id: req.params.id}});
    invalidateCoursesCache();
    res.json({message: 'Curso eliminado (soft delete)'});
}

async function restoreCourse(req, res){
    const course = await Course.findByPk(req.params.id, {paranoid: false});
    if (!course) throw new AppError('Curso no encontrado', 404);
    if (req.user && !['admin', 'instructor'].includes(req.user.role) && req.user.id !== course.ownerId)
        throw new AppError('No autorizado para restaurar este curso', 403);
    await Course.restore({where: {id: req.params.id}});
    invalidateCoursesCache();
    res.json({message: 'Curso restaurado'});
}

module.exports = {createCourse, listCourses, getCourseBySlug, updateCourse, deleteCourse, restoreCourse};
