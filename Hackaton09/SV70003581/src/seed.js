require("dotenv").config();

const sequelize = require("./db");
const { User, Course, Lesson, Enrollment, Comment } = require("./models");

async function seedUsers() {
  console.log(" Creando usuarios...");

  const data = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      passwordHash: "123456",
      role: "student",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      passwordHash: "123456",
      role: "instructor",
    },
    {
      firstName: "Alice",
      lastName: "Williams",
      email: "alice@example.com",
      passwordHash: "123456",
      role: "student",
    },
  ];

  const users = await User.bulkCreate(data);
  console.log(` Usuarios creados: ${users.length}`);
  return users;
}

async function seedCourses(users) {
  console.log(" Creando cursos...");

  const data = [
    {
      title: "Introducción a Node.js",
      slug: "introduccion-a-nodejs",
      description: "Curso básico de Node.js",
      published: true,
      ownerId: users[1].id, // instructor
    },
    {
      title: "SQL para Principiantes",
      slug: "sql-para-principiantes",
      description: "Aprende SQL desde cero",
      published: true,
      ownerId: users[1].id, // instructor
    },
  ];

  const courses = await Course.bulkCreate(data);
  console.log(` Cursos creados: ${courses.length}`);
  return courses;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seedLessons(courses) {
  console.log(" Creando lecciones...");

  const data = [
    {
      title: "¿Qué es Node.js?",
      slug: slugify("¿Qué es Node.js?"),
      body: "Node es un entorno de ejecución para JavaScript.",
      order: 1,
      courseId: courses[0].id,
    },
    {
      title: "Módulos en Node.js",
      slug: slugify("Módulos en Node.js"),
      body: "Aprendiendo sobre módulos.",
      order: 2,
      courseId: courses[0].id,
    },
    {
      title: "Introducción a SQL",
      slug: slugify("Introducción a SQL"),
      body: "SQL significa Structured Query Language.",
      order: 1,
      courseId: courses[1].id,
    },
  ];

  const lessons = await Lesson.bulkCreate(data);
  console.log(` Lecciones creadas: ${lessons.length}`);
  return lessons;
}

async function seedEnrollments(users, courses) {
  console.log(" Creando inscripciones (enrollments)...");

  const data = [
    { userId: users[0].id, courseId: courses[0].id },
    { userId: users[2].id, courseId: courses[0].id },
    { userId: users[0].id, courseId: courses[1].id },
  ];

  const enrollments = await Enrollment.bulkCreate(data);
  console.log(` Enrollments creados: ${enrollments.length}`);
  return enrollments;
}

async function seedComments(users, lessons) {
  console.log(" Creando comentarios...");

  const data = [
    {
      body: "Muy buena explicación!",
      userId: users[0].id,
      lessonId: lessons[0].id,
    },
    {
      body: "No entendí la parte del módulo fs.",
      userId: users[2].id,
      lessonId: lessons[1].id,
    },
    {
      body: "Excelente clase.",
      userId: users[0].id,
      lessonId: lessons[2].id,
    },
  ];

  const comments = await Comment.bulkCreate(data);
  console.log(` Comentarios creados: ${comments.length}`);
  return comments;
}

async function seed() {
  try {
    console.log("INICIANDO SEED PARA DB");

    await sequelize.sync({ force: true });
    console.log(" Tablas recreadas");

    const users = await seedUsers();
    const courses = await seedCourses(users);
    const lessons = await seedLessons(courses);
    await seedEnrollments(users, courses);
    await seedComments(users, lessons);

    console.log("\n SEED COMPLETADO EXITOSAMENTE");
    process.exit(0);
  } catch (err) {
    console.error("Error ejecutando seed:", err);
    process.exit(1);
  }
}

seed();
