import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI || "";

let isConnected = false;
const connect = async () => {
  if (isConnected) {
    console.log("already connected to MongoDB");
    return;
  }
  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connection.readyState === 1;
    console.log("MongoDB connect successfuly!!");
  } catch (error) {
    throw new Error("Error in connecting to mongoDB" + error);
  }
};

export default connect;
