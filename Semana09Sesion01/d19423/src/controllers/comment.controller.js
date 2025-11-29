const { combineTableNames } = require('sequelize/lib/utils');
const db = require('../models');
const { Op } = require('sequelize');
const User = db.User;
const Post = db.Post;
const Comment = db.Comment;

exports.createComment = async(req,res)=>{
    let newComment ={
        PostId: req.params.postId,
        UserId: req.params.userId,
        body: req.body.comment
    };
    await Comment.create(newComment).then(data=>{
        res.status(201).send(data)
    }).catch(error=>{
        res.status(500).send({message:error})
    })
}

exports.getComments = async(req,res)=>{
    await Comment.findAll(
        {
            include:[
                {model:Post, attributes: ["title"]},
                {model:User, attributes: ["firstName", "lastName", "email"]}
            ]
          }).then(data => {
            if(data.length!==0){
                res.status(200).send(data)
            }else{
                res.status(404).send({ message: `No se han encontrado comentarios` })
            } 
        }).catch(error => {
            res.status(500).send({ message: error })
        })
}