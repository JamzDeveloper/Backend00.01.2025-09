import mongoose from "mongoose";

const connectDB = async (uri: string): Promise<void> => {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log("MongoDB conectado");
};

export default connectDB;
