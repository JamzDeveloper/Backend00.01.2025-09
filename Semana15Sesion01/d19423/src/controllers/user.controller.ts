import { Request, Response } from "express";
import db from "../models";

const { user: User } = db;

export const allAccess = (_req: Request, res: Response) => {
  res.status(200).send("Contenido Public");
};

export const onlyUser = async (_req: Request, res: Response) => {
    const user = await User.findById(_req.userId).exec();
    if (!user) {
    return res.status(404).send({ message: "Usuario no encontrado" });
  }
  res.status(200).send(`Contenido del Usuario ${user.username}`);
};

export const onlyModerator = (_req: Request, res: Response) => {
  res.status(200).send("Contenido del Moderator");
};

export const onlyAdmin = (_req: Request, res: Response) => {
  res.status(200).send("Contenido del Admin");
};