const {DataTypes} = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User',{
    firstName: {type: DataTypes.STRING, allowNull:false},
    lastName: {type: DataTypes.STRING, allowNull:false},
    email: {type:DataTypes.STRING, allowNull:false, unique:true},
    birthdate: {type: DataTypes.DATEONLY, allowNull:false, defaultValue:DataTypes.NOW},
    passwordHash: {type:DataTypes.STRING, allowNull:false},
    role: {type:DataTypes.ENUM('admin','author','reader'), defaultValue:'reader'}
}, {tableName: 'users'});

const Post = sequelize.define('Post',{
    title:{type:DataTypes.STRING, allowNull:false},
    slug:{type:DataTypes.STRING, allowNull:false, unique:true},
    body: {type:DataTypes.TEXT, allowNull:false},
    published:{type:DataTypes.BOOLEAN, defaultValue: false}
}, {tableName: 'posts', paranoid:true})

const Comment = sequelize.define('Comment',{
    body: {type:DataTypes.TEXT, allowNull:false}
},{tableName:'comments'})

User.hasMany(Post);
Post.belongsTo(User);

Post.hasMany(Comment);
Comment.belongsTo(Post);

User.hasMany(Comment);
Comment.belongsTo(User)

module.exports = {sequelize, User, Post, Comment}