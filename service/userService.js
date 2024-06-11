const { ObjectId } = require('mongodb');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Service = require('../models/Service');
const User = require('../models/User');

const updateUser = async (email, updateData) => {
    const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: updateData,
      };
  
  const resultQuantity=await User.findOneAndUpdate(filter,updateDoc,{ new: true,upsert:true });
  console.log("Result",resultQuantity)
  return resultQuantity
};

module.exports = {
  
  updateUser
};
