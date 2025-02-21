import ProductModel from "../../models/Product.js";

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({ message: "Invalid Input", success: false });
    }

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { name: { $regex: regEx } },
        { description: { $regex: regEx } },
        { category: { $regex: regEx } },
        { brand: { $regex: regEx } },
      ],
    };

    const searchResult = await ProductModel.find(createSearchQuery);

    res.status(200).json({ data: searchResult, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

export { searchProducts };
