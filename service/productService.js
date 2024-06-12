const { ObjectId } = require('mongodb');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

const purchase = async (productData) => {
  const product = new Order(productData);
  return await product.save();
};
const addReview = async (productData) => {
  const product = new Review(productData);
  return await product.save();
};

const getProducts = async () => {
  return await Product.find();
};
const getServices = async () => {
  return await Service.find();
};
const getReviews = async () => {
  return await Review.find();
};
const getItemsByEmail = async (email) => {
  const query={email:email};
    const cursor=Product.find(query);
  return cursor
  };
const createPaymentIntent = async (service,price,amount) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount : amount,
    currency: 'usd',
    payment_method_types:['card']
  });
  return paymentIntent
  };
const getOrders = async (email) => {
  const query={email:email};
    const cursor=Order.find(query);
  return cursor
  };

const getProductById = async (id) => {
  return await Product.findById(id);
};
const getOrderById = async (id) => {
  return await Order.findById(id);
};

const updateProduct = async (id, updateData) => {
  

  // const updateDoc={
  //    $set:{
  //         quantity:updateData.restock
  //    },
     
  // };
  const resultQuantity=await Product.findByIdAndUpdate(id,updateData,{ new: true });
  return resultQuantity
};

const updateOrder = async (id, updateData) => {
  const payment = updateData;
  const updatedDoc = {
    $set: {
      paid: true,
      transactionId: payment.transactionId
    }
  }


  // const updateDoc={
  //    $set:{
  //         quantity:updateData.restock
  //    },
     
  // };
  const product = new Payment(payment);
  const result =  await product.save();
  // const result = await Payment.insertOne(payment);
  const resultQuantity=await Order.findByIdAndUpdate(id,updatedDoc,{ new: true });

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
  getReviews,
  addReview,
  getServices,
  purchase,
  getOrders,
  createPaymentIntent,
  updateOrder,
  getOrderById
};
