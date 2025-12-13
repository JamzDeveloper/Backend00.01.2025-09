const {DataTypes, Op} = require('sequelize');
const sequelize = require('../db');
const {slugify} = require('../utils/slugify');

const JsonType = sequelize.getDialect() === 'postgres' ? DataTypes.JSONB : DataTypes.JSON;

const User = sequelize.define('User',{
    firstName: {type: DataTypes.STRING, allowNull: false, validate: {len: [1, 100]}},
    lastName: {type: DataTypes.STRING, allowNull: false, validate: {len: [1, 100]}},
    email: {type: DataTypes.STRING, allowNull: false, unique: true, validate: {isEmail: true}},
    passwordHash: {type: DataTypes.STRING, allowNull: false},
    role: {
        type: DataTypes.ENUM('admin', 'instructor', 'student'),
        defaultValue: 'student',
        allowNull: false,
    },
},
{
    tableName: 'users',
    defaultScope: {attributes: {exclude: ['passwordHash']}},
    scopes: {
        withPassword: {attributes: {include: ['passwordHash']}},
        instructors: {where: {role: 'instructor'}},
    },
}
);

const Course = sequelize.define('Course',{
    title: {type: DataTypes.STRING, allowNull: false, unique: true, validate: {len: [5, 100]}}, //Tittle course min 5 chars
    slug: {type: DataTypes.STRING, allowNull: false, unique: true},
    description: {type: DataTypes.TEXT, allowNull: false, validate: {len: [1, 8000]}},
    published: {type: DataTypes.BOOLEAN, defaultValue: false},
    studentsCount: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    metadata: {type: JsonType, allowNull: false, defaultValue: {}},
    ownerId: {type: DataTypes.INTEGER, allowNull: false},
},
{
    tableName: 'courses',
    paranoid: true,
    indexes: [
        {unique: true, fields: ['slug']},
        {fields: ['published']},
    ],
    scopes: {
        published: {where: {published: true}},
    },
}
);

const Lesson = sequelize.define('Lesson',{
    title: {type: DataTypes.STRING, allowNull: false, validate: {len: [1, 100]}},
    slug: {type: DataTypes.STRING, allowNull: false},
    body: {type: DataTypes.TEXT, allowNull: false, validate: {len: [20, 8000]}}, //Body lessson min 20 chars
    order: {type: DataTypes.INTEGER, allowNull: false, validate: {min: 1}},
    courseId: {type: DataTypes.INTEGER, allowNull: false},
  },
  {
    tableName: 'lessons',
    paranoid: true,
    indexes: [
        {unique: true, fields: ['slug', 'courseId']},
        {fields: ['courseId']},
    ],
    scopes: {
        ordered: {order: [['order', 'ASC']]},
    },
  }
);

const Enrollment = sequelize.define('Enrollment',{
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    status: {type: DataTypes.ENUM('pending', 'active'), allowNull: false, defaultValue: 'pending'},
    score: {type: DataTypes.DECIMAL(3, 1), allowNull: true, validate: {min: 0, max: 20}},
    courseId: {type: DataTypes.INTEGER, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: false,
    },
},
{
    tableName: 'enrollments',
    indexes: [{unique: true, fields: ['courseId', 'userId']}],
    scopes: {
      active: {where: {status: 'active'}},
    },
}
);

const Comment = sequelize.define('Comment',{
    body: {type: DataTypes.TEXT, allowNull: false},
    lessonId: {type: DataTypes.INTEGER, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: false},
},
{tableName: 'comments'}
);


// Relaciones
User.hasMany(Course, {as: 'courses', foreignKey: 'ownerId'});
Course.belongsTo(User, {as: 'owner', foreignKey: 'ownerId'});

Course.hasMany(Lesson, {as: 'lessons', foreignKey: 'courseId'});
Lesson.belongsTo(Course, {as: 'course', foreignKey: 'courseId'});

User.belongsToMany(Course, {
    through: Enrollment,
    as: 'enrolledCourses',
    foreignKey: 'userId',
    otherKey: 'courseId',
});

Course.belongsToMany(User, {
    through: Enrollment,
    as: 'students',
    foreignKey: 'courseId',
    otherKey: 'userId',
});

Course.hasMany(Enrollment, {as: 'enrollments', foreignKey: 'courseId'});
Enrollment.belongsTo(Course, {as: 'course', foreignKey: 'courseId'});
User.hasMany(Enrollment, {as: 'enrollments', foreignKey: 'userId'});
Enrollment.belongsTo(User, {as: 'student', foreignKey: 'userId'});

Lesson.hasMany(Comment, {as: 'comments', foreignKey: 'lessonId'});
Comment.belongsTo(Lesson, {as: 'lesson', foreignKey: 'lessonId'});
User.hasMany(Comment, {as: 'comments', foreignKey: 'userId'});
Comment.belongsTo(User, {as: 'author', foreignKey: 'userId'});


// Hooks y normalizaciones
// Uso 'beforeValidate' para cubrir antes de crear y antes de actualzaciones. 
User.addHook('beforeValidate', (user) => {
    if (user.firstName) user.firstName = user.firstName.trim();
    if (user.lastName) user.lastName = user.lastName.trim();
    if (user.email) user.email = user.email.trim().toLowerCase();
});

Course.addHook('beforeValidate', (course) => {
    if (course.title) course.title = course.title.trim();
    if (course.description) course.description = course.description.trim();
    if (course.title && (!course.slug || course.changed('title'))){
        course.slug = slugify(course.title);
    }
});

Lesson.addHook('beforeValidate', async (lesson) => {
    if (lesson.title) lesson.title = lesson.title.trim();
    if (lesson.body) lesson.body = lesson.body.trim();
    if (lesson.title && (!lesson.slug || lesson.changed('title'))){
        lesson.slug = slugify(lesson.title);
    }
    if (!lesson.courseId) throw new Error('courseId es obligatorio para crear una leccion');
    if (!lesson.order){
        const count = await Lesson.count({where: { courseId: lesson.courseId}});
        lesson.order = count + 1;
    }
});

Comment.addHook('beforeValidate', (comment) => {
    if (comment.body) comment.body = comment.body.trim();
    if (!comment.body || comment.body.length < 5){
        throw new Error('El comentario debe tener al menos 5 caracteres');
    }
});

module.exports = {sequelize, User, Course, Lesson, Enrollment, Comment, Op};
