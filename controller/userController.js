
const userService = require('../service/userService');
const jwt = require('jsonwebtoken');


const updateUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = req.body;
    const updatedProduct = await userService.updateUser(email, user);
    const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

    // if (!updatedProduct) {
    //   return res.status(404).json({ message: 'Product not found' });
    // }
    res.status(200).json({updatedProduct,token});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const products = await userService.getUsers();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAdmin = async (req, res) => {
  try {
    const email = req.params.email;

    const products = await userService.getAdmin(email);
    res.send({ admin: products })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
 updateUser,
 getUsers,
 getAdmin
  
};
