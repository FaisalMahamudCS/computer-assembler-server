const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    purchaseId: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
    },
    price: {
        type: Number,
    },
    productName: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    OrderName: {
        type: String,
    },
    phone: {
        type: String,
    },
    status: {
        type: String,
    },
 
  
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
