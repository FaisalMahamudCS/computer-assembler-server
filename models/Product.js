const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    minimumQuantity: {
        type: Number,
        required: true
    },
    availableQuantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
