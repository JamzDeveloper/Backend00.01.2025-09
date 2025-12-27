import { request, response } from "express";
import { UserModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";

const getUsers = async (req = request, res = response) => {
  const result = await UserModel.find();

  console.log(result);
  res.json({
    success: true,
    data: result,
  });
};

const createUser = async (req = request, res = response) => {
  try {
    const { name, email, password } = req.body;
   
    //TODO: buscar si existe un usuario con el correo enviado

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      passwordHash: passwordHash,
    });

    const userToJson = user.toJSON();
    delete userToJson.passwordHash;
    res.json({
      success: true,
      message: "User created successfully",
      data: userToJson,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al crear el usuario",
      error: err.message,
    });
  }
};
export { getUsers, createUser };
