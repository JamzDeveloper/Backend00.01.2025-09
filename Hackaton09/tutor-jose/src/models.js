const { DataTypes, Op } = require("sequelize");
const sequelize = require("./db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre no puede estar vacion",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El apellido no puede estar vacio",
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "El correo electrónico no es valido",
        },
      },
    },
    passwordHash: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("student", "instructor", "admin"),
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

//===== modelo curso

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El titulo no puede estar vacio",
        },
        len: {
          args: [5, 255],
          msg: "El titulo debe tener entre 5 y 255 caracteres",
        },
      },
    },

    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "El slug no puede estar vacio",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    scopes: {
      published: {
        where: { published: true },
      },
    },
  }
);

// Hook en Course
Course.beforeValidate((course) => {
  if (!course.slug && course.title) {
    course.slug = course.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  if (course.title) {
    course.title = course.title.trim();
  }
});

// Relaciones
User.hasMany(Course, {
  foreignKey: "ownerId",
  as: "courses",
});

Course.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

module.exports = {
  User,
  Course,
  Op,
};
