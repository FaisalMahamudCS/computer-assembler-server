
const productService = require('../service/productService');

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addReview = async (req, res) => {
  try {
    const product = await productService.addReview(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const purchase = async (req, res) => {
  try {
    const product = await productService.purchase(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getReviews = async (req, res) => {
  try {
    const products = await productService.getReviews();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getServices = async (req, res) => {
  try {
    const products = await productService.getServices();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const decodedEmail=req?.decoded?.email ;
    console.log("Decoded",decodedEmail)
    const email=req.query.email;
    if (email === decodedEmail) {
      const items = await productService.getItemsByEmail(email);
      console.log("item",items)
      res.status(200).json(items);
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getOrders = async (req, res) => {
  try {
    const decodedEmail=req?.decoded?.email ;
    console.log("Decoded",decodedEmail)
    const email=req.query.email;
    if (email === decodedEmail) {
      const items = await productService.getOrders(email);
      console.log("item",items)
      res.status(200).json(items);
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getReviews,
  addReview,
  getServices,
  purchase,
  getOrders
};
