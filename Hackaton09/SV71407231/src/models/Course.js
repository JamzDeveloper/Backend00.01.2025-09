const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    studentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "courses",
    timestamps: true,
    paranoid: true, 

    hooks: {
      beforeValidate(course) {
        if (course.title) {
          course.slug = course.title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");
        }
      },
    },
  }
);

module.exports = Course;