import { imageUploadUtil } from "../../helpers/cloudinary.js";
import ProductModel from "../../models/product.js";

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    return res.status(200).json({
      message: "Image uploaded successfully",
      result,
      success: true,
    });
  } catch (error) {
    console.error("Image upload error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Add New Product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const newProduct = new ProductModel({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully!",
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error("Add product error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message || error,
    });
  }
};

// Fetch All Products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await ProductModel.find({});

    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (error) {
    console.error("Fetch products error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message || error,
    });
  }
};

// Edit Product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const updateProduct = await ProductModel.findById(id);

    if (!updateProduct)
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });

    updateProduct.image = image || updateProduct.image;
    updateProduct.title = title || updateProduct.title;
    updateProduct.description = description || updateProduct.description;
    updateProduct.category = category || updateProduct.category;
    updateProduct.brand = brand || updateProduct.brand;
    updateProduct.price = price || updateProduct.price;
    updateProduct.salePrice = salePrice || updateProduct.salePrice;
    updateProduct.totalStock = totalStock || updateProduct.totalStock;

    await updateProduct.save();

    res.status(200).json({
      message: "Product updated successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Edit product error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product)
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });

    res.status(200).json({
      message: "Product deleted successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Delete product error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
