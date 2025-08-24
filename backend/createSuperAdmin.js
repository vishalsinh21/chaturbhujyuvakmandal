import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; 

dotenv.config(); 

const createSuperAdmin = async () => {
  try {
    const connectionString = `${process.env.MONGO_URI}/${process.env.DB_NAME}`;
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const newUser = new User({
      username: 'cbym',
      email: ' chaturbhujyuvakmandal@gmail.com',
      password: 'Cbym$Kasor', // Raw password — gets hashed via pre-save hook
      role: 'Super Admin',
    });

    await newUser.save();
    console.log('✅ Super Admin created:', newUser);
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error creating super admin:', err.message);
    mongoose.disconnect();
  }
};

createSuperAdmin();