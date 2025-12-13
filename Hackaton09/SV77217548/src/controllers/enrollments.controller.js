const {Enrollment, Course, User} = require('../models');
const {AppError} = require('../utils/app-error');
const {buildPagination} = require('../utils/pagination');

async function enroll(req, res){
    const courseId = req.params.courseId;
    const { userId, status, score } = req.body;
    const statusNormalized = status || 'pending';
    if (!userId) throw new AppError('userId es obligatorio', 400);
    if (!['pending', 'active'].includes(statusNormalized)) throw new AppError('status inválido', 400);
    const course = await Course.findByPk(courseId);
    if (!course) throw new AppError('Curso no encontrado', 404);
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('Usuario no encontrado', 404);
    const existing = await Enrollment.findOne({where: {courseId, userId}});
    if (existing) throw new AppError('El usuario ya está inscrito en este curso', 409);
    const t = await Enrollment.sequelize.transaction();
    try{
        const enrollment = await Enrollment.create(
            {courseId, userId, status: statusNormalized, score},
            {transaction: t}
        );
        // Contamos al alumno desde el alta (pending o active)
        await Course.increment('studentsCount', {by: 1, where: {id: courseId}, transaction: t});
        await t.commit();
        res.status(201).json(enrollment);
    } catch (err){
        await t.rollback();
        if (err.name === 'SequelizeUniqueConstraintError'){
            throw new AppError('El usuario ya está inscrito en este curso', 409);
        }
        throw err;
    }
}

async function updateEnrollmentStatus(req, res){
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) throw new AppError('Inscripción no encontrada', 404);
    const {status, score} = req.body;
    const nextStatus = status || enrollment.status;
    if (nextStatus && !['pending', 'active'].includes(nextStatus)){
        throw new AppError('status inválido', 400);
    }
    const t = await Enrollment.sequelize.transaction();
    try{
        const prevStatus = enrollment.status;
        await enrollment.update({ status: nextStatus, score }, { transaction: t });
        // Ajusta solo si cambia entre active/pending (ya se contó en el alta)
        if (prevStatus !== 'active' && nextStatus === 'active'){
            await Course.increment('studentsCount', {by: 1, where: {id: enrollment.courseId}, transaction: t});
        } else if (prevStatus === 'active' && nextStatus !== 'active'){
            await Course.increment('studentsCount', {by: -1, where: {id: enrollment.courseId}, transaction: t});
        }
        await t.commit();
        res.json(enrollment);
    } catch (err) {
        await t.rollback();
        throw err;
    }
}

async function listEnrollments(req, res){
    const {courseId} = req.params;
    const {page, pageSize, offset, limit} = buildPagination(req.query);
    const where = {courseId};
    if (req.query.status) where.status = req.query.status;
    const {rows, count} = await Enrollment.findAndCountAll({
        attributes: ['id', 'status', 'score', 'courseId', 'userId', 'createdAt', 'updatedAt'],
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'student', attributes: ['id', 'firstName', 'lastName', 'email']}],
    });
    res.json({total: count, page, pageSize, data: rows});
}

module.exports = {enroll, updateEnrollmentStatus, listEnrollments};
