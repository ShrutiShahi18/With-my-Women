import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "✅ MongoDB connected successfully" +
      ` at ${new Date().toLocaleString()}` +
      ` on host: ${mongoose.connection.host}` +
      ` with database: ${mongoose.connection.name}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
