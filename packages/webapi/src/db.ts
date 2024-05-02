import mongoose from 'mongoose';

const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Reddit', {
      useUnifiedTopology: true,
    } as any);
    console.log('Database Online!');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectToMongo;
