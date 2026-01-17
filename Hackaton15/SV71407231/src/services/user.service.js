import bcrypt from "bcrypt";

const users = [
  {
    id: "1",
    email: "admin@test.com",
    passwordHash: await bcrypt.hash("123456", 10),
    role: "admin"
  },
  {
    id: "2",
    email: "user@test.com",
    passwordHash: await bcrypt.hash("123456", 10),
    role: "user"
  }
];

export async function findUserByEmail(email) {
  return users.find(u => u.email === email);
}   