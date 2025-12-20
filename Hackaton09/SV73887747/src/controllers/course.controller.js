const { Course, User, Lesson, Enrollment,sequelize } = require('../models');
const { Op } = require('sequelize');

const slugify = str => str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

exports.getCourses = async (req, res) => {
  const { q, published, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (q) where.title = { [Op.iLike]: `%${q}%` };
  if (published !== undefined) where.published = published === 'true';

  const { count, rows } = await Course.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
      { model: Enrollment, attributes: [] }
    ],
    attributes: {
      include: [[sequelize.fn('COUNT', sequelize.col('enrollments.id')), 'studentsCount']]
    },
    group: ['Course.id', 'owner.id']
  });

  res.json({
    total: count.length,
    page: Number(page),
    pages: Math.ceil(count.length / limit),
    data: rows
  });
};

exports.getCourseBySlug = async (req, res) => {
  const course = await Course.findOne({
    where: { slug: req.params.slug },
    include: [
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
      { model: Lesson, as: 'lessons', order: [['order', 'ASC']] },
      { model: User, as: 'students', attributes: ['id', 'firstName', 'lastName'], through: { attributes: ['status', 'score'] } }
    ]
  });

  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json(course);
};

exports.createCourse = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const course = await Course.create({
      ...req.body,
      slug: slugify(req.body.title),
      ownerId: req.params.instructorId
    }, { transaction: t });
    await t.commit();
    res.status(201).json(course);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  if (req.body.title) req.body.slug = slugify(req.body.title);
  await course.update(req.body);
  res.json(course);
};

exports.deleteCourse = async (req, res) => {
  const deleted = await Course.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json({ message: 'Curso eliminado (soft delete)' });
};