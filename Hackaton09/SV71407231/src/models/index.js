const User = require("./User");
const Course = require("./Course");
const Lesson = require("./Lesson");
const Enrollment = require("./Enrollment");
const Comment = require("./Comment");

User.hasMany(Course, { as: "courses", foreignKey: "ownerId" });
Course.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

Course.hasMany(Lesson, { as: "lessons", foreignKey: "courseId" });
Lesson.belongsTo(Course, { as: "course", foreignKey: "courseId" });

User.belongsToMany(Course, {
  through: Enrollment,
  as: "enrolledCourses",
  foreignKey: "userId",
});
Course.belongsToMany(User, {
  through: Enrollment,
  as: "students",
  foreignKey: "courseId",
});

Enrollment.belongsTo(User, { foreignKey: "userId" });
Enrollment.belongsTo(Course, { foreignKey: "courseId" });


Lesson.hasMany(Comment, { as: "comments", foreignKey: "lessonId" });
Comment.belongsTo(Lesson, { as: "lesson", foreignKey: "lessonId" });


User.hasMany(Comment, { as: "comments", foreignKey: "userId" });
Comment.belongsTo(User, { as: "author", foreignKey: "userId" });

module.exports = { User, Course, Lesson, Enrollment, Comment };