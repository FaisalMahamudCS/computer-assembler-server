const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    education: {
        type: String,
    },
    location: {
        type: String,
    },
    phone: {
        type: String,
    },
 
  
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
