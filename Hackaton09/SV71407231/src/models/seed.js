require("dotenv").config();

const { sequelize } = require("../config/db");
const { User, Course } = require("../models");

async function sendUser() {
  try {
    console.log("Iniciando seed de usuarios");

    await sequelize.sync({ force: true });

    const users = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        passwordHash: "password123",
        role: "student",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        passwordHash: "password456",
        role: "instructor",
      },
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        passwordHash: "adminpassword",
        role: "admin",
      },
      {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice.johnson@gmail.com",
        passwordHash: "alicepassword",
        role: "student",
      },
    ];

    const usersBulk = await User.bulkCreate(users);
    console.log(`${usersBulk.length} usuarios creados`);
  } catch (err) {
    console.error(" Error al ejecutar el seed de usuarios", err);
    process.exit(1);
  }
}

async function seed() {
  await sendUser();
  process.exit(0);
}

seed();