// connection.js
const { MongoClient } = require('mongodb');
const { default: mongoose } = require('mongoose');

const uri = process.env.DB_URI;

let db;

const connectDB = async () => {
  if (db) return db;
  try {
    const client =await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    console.log('MongoDB connected successfully');
    return client;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
