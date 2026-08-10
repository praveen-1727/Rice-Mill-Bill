import mongoose from 'mongoose';

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI || mongoURI.includes('username:password')) {
    console.log(`[MongoDB Atlas] Notice: Please set your actual MongoDB Atlas connection string in server/.env`);
    console.log(`[MongoDB Atlas] Express API server running in standby mode.`);
    return false;
  }
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB Atlas] Successfully connected to Cloud Database: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Atlas Warning] Could not connect to MongoDB Atlas Cloud: ${error.message}`);
    console.warn(`[MongoDB Atlas Warning] Please check your database user credentials and IP access settings in MongoDB Atlas.`);
    return false;
  }
}
