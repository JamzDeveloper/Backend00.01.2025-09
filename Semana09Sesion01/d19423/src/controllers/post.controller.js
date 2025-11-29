const db = require('../models');
const { Op } = require('sequelize');
const User = db.User;
const Post = db.Post;

exports.addPost = async (req, res) => {
    let post = req.body;
    post.UserId = req.params.authorId;
    post.slug = convertToSlug(post.title);
    console.log(post);
    Post.create(post).then(data => {
        res.status(201).send(data);
    }).catch(error => {
        res.status(500).send({ message: error })
    })
}

exports.getPosts = async (req, res) => {
    let query = req.query.title
    console.log(query)
    await Post.findAll(
        {
            where: {
                title: {
                    [Op.like]: `%${query}%`
                }
            },
            attributes: ['title', 'body'],
            include: {
                model: User, attributes: ["firstName", "lastName", "email"]
            }
        }).then(data => {
            if(data.length!==0){
                res.status(200).send(data)
            }else{
                res.status(404).send({ message: `No se han encontrado posts` })
            } 
        }).catch(error => {
            res.status(500).send({ message: error })
        })
}

exports.deletePost = async (req, res) => {
    let idPost = req.params.id;
    await Post.destroy({
        where: {
            id: idPost
        }
    }).then(data => {
        if (data) {
            res.status(200).send(data)
        } else {
            res.status(404).send({ message: `El post ${idPost} no se ha encontrado` })
        }
    }).catch(error => {
        res.status(500).send({ message: error })
    })
}

exports.getPostsById = async (req, res) => {
    let idPost = req.params.id;

    await Post.findByPk(idPost, {
        attributes: ['title', 'body'],

        limit: 5,
        offset: 10, // Retrieve records for the 3rd page (assuming 5 records per page)
        order: [['createdAt', 'DESC']] // Optional: Add sorting
    }).then(data => {
        if (data) {
            res.status(200).send(data)
        } else {
            res.status(404).send({ message: `El post ${idPost} no se ha encontrado` })
        }
    }).catch(error => {
        res.status(500).send({ message: error })
    })
}

function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
}