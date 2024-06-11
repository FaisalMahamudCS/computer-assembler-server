const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const  JWTVarification  = require('../middleware/JWTVerification');


router.put('/:email', userController.updateUser);

module.exports = router;
