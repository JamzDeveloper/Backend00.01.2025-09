const {DataTypes} = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User',{
    firstName: {type: DataTypes.STRING, allowNull:false},
    lastName: {type: DataTypes.STRING, allowNull:false},
    email: {type: DataTypes.STRING, allow:false, unique:true},
    passwordHash: {type:DataTypes.STRING, allowNull:false},
    role: {type:DataTypes.ENUM('admin', 'instructor', 'student'), defaultValue:'student', allowNull:false}
}, {tableName:'users'});

const Course = sequelize.define('Course', {
    title: {type:DataTypes.STRING, unique:true, allowNull:false},
    slug: {type:DataTypes.STRING, unique:true},
    description: {type:DataTypes.TEXT, allowNull:false},
    published: {type:DataTypes.BOOLEAN, defaultValue:false}
}, {tableName:'courses', paranoid:true})

const Lesson = sequelize.define('Lesson', {
    title: {type:DataTypes.STRING, allowNull:false},
    slug: {type:DataTypes.STRING, unique:true, allowNull:false},
    body: {type:DataTypes.TEXT, allowNull:false},
    order: {type:DataTypes.INTEGER, allowNull:false}
}, {tableName:'lessons', paranoid:true})

const Enrollment = sequelize.define('Enrollment', {
    status: {type:DataTypes.ENUM('active', 'pending'), defaultValue: 'pending', allowNull:false},
    score: {type:DataTypes.FLOAT, allowNull:true, defaultValue:null}
}, {tableName:'enrollments', paranoid:true})

const Comment = sequelize.define('Comment', {
    body:{type:DataTypes.TEXT, allowNull:false}
}, {tableName:'comments', paranoid:true})

// ==================== RELACIONES ====================

User.hasMany(Course, { foreignKey: 'ownerId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId', otherKey: 'courseId', as: 'enrolledCourses' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId', otherKey: 'userId', as: 'students' });

User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments' });
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'student' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Lesson.hasMany(Comment, { foreignKey: 'lessonId', as: 'comments' });
Comment.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });



module.exports = {sequelize, User, Course, Lesson, Enrollment, Comment};