import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
  await mongoose.connect(config.MONGO_URI);
}

export default connectDB;
