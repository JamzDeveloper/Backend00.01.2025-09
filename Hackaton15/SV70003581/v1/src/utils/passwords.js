import bcryptjs from "bcryptjs";

export const verifyPassword = (password, passwordHash) => {
    return password === passwordHash; //Temporal, validar con crypto
    //return bcryptjs.compareSync(password, passwordHash);
}