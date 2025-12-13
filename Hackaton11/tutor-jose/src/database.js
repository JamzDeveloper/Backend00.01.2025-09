import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
mongoose
  .connect(`${process.env.MONGO_URL}/fjmonteneg2510`)
  .then(() => console.log("Connected!"))
  .catch((err) => {
    console.log("error connected with db", err);
  });
