export const verifyPassword = (password, passwordHash) => {
  //logica de validacion con crypto
  return password === passwordHash;
};
