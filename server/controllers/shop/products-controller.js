import ProductModel from "../../models/Product.js";

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-low-high" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-low-high":
        sort.price = 1;

        break;

      case "price-high-low":
        sort.price = -1;

        break;

      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await ProductModel.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get filtered products error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message || error,
    });
  }
};

const getProductsDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product)
      return res.status(400).json({
        message: "Product not found!",
        success: false,
      });

    res.status(200).json({
      data: product,
      success: true,
    });
  } catch (error) {
    console.error("Get filtered products error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message || error,
    });
  }
};

export { getFilteredProducts, getProductsDetails };
