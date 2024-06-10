const { ObjectId } = require('mongodb');
const Product = require('../models/Product');
const Review = require('../models/Review');

const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

const getProducts = async () => {
  return await Product.find();
};
const getReviews = async () => {
  return await Review.find();
};
const getItemsByEmail = async (email) => {
  const query={email:email};
    const cursor=Product.find(query);
  return cursor
  };

const getProductById = async (id) => {
  return await Product.findById(id);
};

const updateProduct = async (id, updateData) => {
  

  const updateDoc={
     $set:{
          quantity:updateData.restock
     },
     
  };
  const resultQuantity=await Product.findByIdAndUpdate(id,updateDoc,{ new: true });
  return resultQuantity
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getItemsByEmail,
  getReviews
};
