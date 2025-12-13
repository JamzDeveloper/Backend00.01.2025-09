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
  const result = await ItemModel.find();

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

const itemsCompleted = async (req = request, res = response) => {
  const result = await ItemModel.find({ completed: true });

  res.json({
    success: true,
    message: "Listado de items completados",
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

  // toggle completed state
  item.completed = !item.completed;
  await item.save();
  console.log(`[changeStatusItem] id=${id} completed=${item.completed}`);

  res.json({
    success: true,
    message: "Item actualizado correctamente",
    data: {
      ...item.toJSON(),
    },
  });
};

const updateItem = async (req = request, res = response) => {
  const { id } = req.params;
  const { name, description, date, completed } = req.body;

  const item = await ItemModel.findById(id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item no encontrado",
      data: {},
    });
  }

  if (name !== undefined) item.name = name;
  if (description !== undefined) item.description = description;
  if (date !== undefined) item.date = date;
  if (completed !== undefined) item.completed = completed;

  await item.save();

  res.json({
    success: true,
    message: "Item actualizado correctamente",
    data: { ...item.toJSON() },
  });
};

const deleteItem = async (req = request, res = response) => {
  const { id } = req.params;
  const item = await ItemModel.findByIdAndDelete(id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item no encontrado",
      data: {},
    });
  }

  res.json({
    success: true,
    message: "Item eliminado correctamente",
    data: { ...item.toJSON() },
  });
};

const getItem = async (req = request, res = response) => {
  const { id } = req.params;
  const item = await ItemModel.findById(id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item no encontrado",
      data: {},
    });
  }

  res.json({
    success: true,
    message: "Item encontrado",
    data: { ...item.toJSON() },
  });
};

export { createItem, listItems, itemsPending, changeStatusItem, updateItem, deleteItem, getItem, itemsCompleted };

