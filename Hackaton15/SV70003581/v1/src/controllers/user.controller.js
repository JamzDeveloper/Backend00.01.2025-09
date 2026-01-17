/*
    Recibir peticiones HTTP
    Validar superficialmente datos de entrada (existencia, tipo y formato)
    Retornar respuestas HTTP
*/

import { userService } from "../services/user.service.js";

export async function showOnlyUsers(req, res) {
  try {    
    const onlyUsers = await userService.getOnlyUsers();
    return res.status(200).json({ data: onlyUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Didn't show users" });
  }
}

export async function showOnlyAdmins(req, res) {
  try {    
    const onlyAdmins = await userService.getOnlyAdmins();
    return res.status(200).json({ data: onlyAdmins });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Didn't show admins" });
  }
}
