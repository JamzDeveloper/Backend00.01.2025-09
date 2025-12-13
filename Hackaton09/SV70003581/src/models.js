const { DataTypes, Op } = require("sequelize");
const sequelize = require("./db");

/* ===============================
   MODELO USER
================================ */
const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: { msg: "El nombre no puede estar vacío" } },
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: { msg: "El apellido no puede estar vacío" } },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: "El correo electrónico no es válido" } },
    },
    passwordHash: { type: DataTypes.STRING(300), allowNull: false },
    role: { type: DataTypes.ENUM("student", "instructor", "admin") },
  },
  { tableName: "users", timestamps: true }
);

/* ===============================
   MODELO COURSE
================================ */
const Course = sequelize.define(
  "Course",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El título no puede estar vacío" },
        len: { args: [5, 255], msg: "Debe tener entre 5 y 255 caracteres" },
      },
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: "El slug no puede estar vacío" } },
    },
    description: { type: DataTypes.TEXT },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    studentsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "courses",
    paranoid: true,
    scopes: {
      published: { where: { published: true } },
    },
  }
);

/* ===============================
   MODELO LESSON
================================ */
const Lesson = sequelize.define(
  "Lesson",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El título no puede estar vacío" },
        len: { args: [3, 255], msg: "Debe tener entre 3 y 255 caracteres" },
      },
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: "El slug no puede estar vacío" } },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: { args: [20], msg: "Mínimo 20 caracteres" } },
    },
    order: { type: DataTypes.INTEGER, allowNull: false },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "courses", key: "id" },
    },
  },
  { tableName: "lessons", paranoid: true }
);

/* ===============================
   MODELO ENROLLMENT (Tabla pivot)
================================ */
const Enrollment = sequelize.define(
  "Enrollment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: {
      type: DataTypes.ENUM("active", "pending"),
      allowNull: false,
      defaultValue: "pending",
    },
    score: { type: DataTypes.DECIMAL(5, 2) },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "courses", key: "id" },
    },
  },
  { tableName: "enrollments", timestamps: true }
);

/* ===============================
   MODELO COMMENT
================================ */
const Comment = sequelize.define(
  "Comment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: { args: [3], msg: "Mínimo 3 caracteres" } },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "lessons", key: "id" },
    },
  },
  { tableName: "comments" }
);

/* ===============================
   HOOKS
================================ */
Course.beforeValidate((course) => {
  if (!course.slug && course.title) {
    course.slug = course.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  if (course.title) course.title = course.title.trim();
});

Lesson.beforeValidate((lesson) => {
  if (!lesson.slug && lesson.title) {
    lesson.slug = lesson.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  if (lesson.title) lesson.title = lesson.title.trim();
});

Comment.beforeValidate((comment) => {
  if (comment.body) comment.body = comment.body.trim();
  if (!comment.body || comment.body.length < 3) {
    throw new Error("El comentario no puede quedar vacío tras limpiar espacios");
  }
});

/* ===============================
   RELACIONES
================================ */

// User → Course
User.hasMany(Course, { foreignKey: "ownerId", as: "courses" });
Course.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// Course → Lesson
Course.hasMany(Lesson, { foreignKey: "courseId", as: "lessons" });
Lesson.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// User → Comment
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "author" });

// Lesson → Comment
Lesson.hasMany(Comment, { foreignKey: "lessonId", as: "comments" });
Comment.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

// N:M User ↔ Course (Enrollment)
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: "userId",
  as: "enrolledCourses",
});

Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: "courseId",
  as: "students",
});

// Relaciones directas con Enrollment
Enrollment.belongsTo(User, { foreignKey: "userId" });
Enrollment.belongsTo(Course, { foreignKey: "courseId" });
User.hasMany(Enrollment, { foreignKey: "userId" });
Course.hasMany(Enrollment, { foreignKey: "courseId" });

/* ===============================
   EXPORTS FINALES
================================ */
module.exports = {
  User,
  Course,
  Lesson,
  Comment,
  Enrollment,
  Op,
};
