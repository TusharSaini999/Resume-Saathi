import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
    if (connectionInstance) {
      console.log('MongoDB connected successfully');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB with SVR');
    try {
      const fallbackConnection = await mongoose.connect(`${process.env.MONGODB_URI_FALLBACK}`);
      if (fallbackConnection) {
        console.log('MongoDB connected successfully using fallback URL');
      }
    } catch (fallbackError) {
      console.error('Error connecting to fallback MongoDB:', fallbackError);
      throw fallbackError;
    }
  }
};

export default connectDB;
