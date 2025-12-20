// Because the DB Name is here!

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
mongoose
  .connect(`${process.env.MONGO_URI}/SV70003581`)
  .then(() => console.log("Connected!"))
  .catch((err) => {
    console.log("error connected with db", err);
  });