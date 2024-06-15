const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const  JWTVarification  = require('../middleware/JWTVerification');


router.put('/:email', userController.updateUser);
router.get('/admin/:email', userController.getAdmin);
router.put('/users', JWTVarification,userController.getUsers);

module.exports = router;
