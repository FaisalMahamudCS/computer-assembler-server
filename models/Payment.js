const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    transactionId: {
        type: String,
    },
    order: {
        type: String,
    },
 
  
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
