import mongoose from "mongoose";

const connectDb = async () => {
  try {
    console.log("Connecting MongoDB...");

    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("MongoDB connected:", connectionInstance.connection.host);
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR", error);
    process.exit(1);
  }
};

export default connectDb;