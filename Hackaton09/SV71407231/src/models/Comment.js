const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Comment = sequelize.define(
  "Comment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "lessons",
        key: "id",
      },
    },
  },
  {
    tableName: "comments",
    timestamps: true,
  }
);

module.exports = Comment;