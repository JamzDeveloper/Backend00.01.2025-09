import { request, response } from "express";
import { ItemModel } from "../models/item.model.js";

const createItem = async (req = request, res = response) => {
  const { name, description, date, completed } = req.body;
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "El nombre es obligatorio",
      data: {},
    });
  }

  const item = await ItemModel.create({
    name,
    description,
    date,
    completed,
  });
  //   item.save();

  res.json({
    success: true,
    message: "Item creado correctamente",
    data: {
      ...item.toJSON(),
    },
  });
};

const listItems = async (req = request, res = response) => {
  const result = await ItemModel.find()

  res.json({
    success: true,
    message: "Listado de items",
    data: result,
  });
};

const itemsPending = async (req = request, res = response) => {
  const result = await ItemModel.find({ completed: false });

  res.json({
    success: true,
    message: "Listado de items",
    data: result,
  });
};

const changeStatusItem = async (req = request, res = response) => {

  const { id } = req.params;
  const item = await ItemModel.findById(id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item no encontrado",
      data: {},
    });
  }

  item.completed = true;
  await item.save();

  res.json({
    success: true,
    message: "Item actualizado correctamente",
    data: {
      ...item.toJSON(),
    },
  });
};

export { createItem, listItems, itemsPending, changeStatusItem };