const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Lesson = sequelize.define(
  "Lesson",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
    },
  },
  {
    tableName: "lessons",
    timestamps: true,
    paranoid: true,
    indexes: [
      { unique: true, fields: ["slug", "courseId"] }, 
    ],
     hooks: {
      beforeValidate(lesson) {
        if (lesson.title) {
          lesson.slug = lesson.title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");
        }
      },
    },
  }
);

module.exports = Lesson;