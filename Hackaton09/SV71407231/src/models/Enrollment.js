const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Enrollment = sequelize.define(
  "Enrollment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    status: {
      type: DataTypes.ENUM("active", "pending"),
      defaultValue: "pending",
    },

    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
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
    tableName: "enrollments",
    timestamps: true,
  }
);

module.exports = Enrollment;