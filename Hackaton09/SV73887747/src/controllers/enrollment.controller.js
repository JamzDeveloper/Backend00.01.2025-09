const { Enrollment, Course, User, sequelize } = require('../models');

exports.enrollUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.body;
    const courseId = req.params.courseId;

    const already = await Enrollment.findOne({
      where: { 
        userId: userId,
        courseId: courseId
      },
      transaction: t
    });

    if (already) {
      await t.rollback();
      return res.status(400).json({ error: 'Ya estás inscrito en este curso' });
    }

    const enrollment = await Enrollment.create({
      userId: userId,
      courseId: courseId,
      status: 'active'
    }, { transaction: t });

    await t.commit();
    res.status(201).json(enrollment);

  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};