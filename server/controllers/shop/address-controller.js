import AddressModel from "../../models/Address.js";

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, zipcode, phone, notes } = req.body;

    const missingFields = [];

    if (!userId) missingFields.push("userId");
    if (!address) missingFields.push("address");
    if (!city) missingFields.push("city");
    if (!zipcode) missingFields.push("zipcode");
    if (!phone) missingFields.push("phone");
    if (!notes) missingFields.push("notes");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing fields: ${missingFields.join(", ")}`,
      });
    }

    const newAddress = new AddressModel({
      userId,
      address,
      city,
      zipcode,
      phone,
      notes,
    });

    const savedAddress = await newAddress.save();

    if (!savedAddress) {
      return res.status(400).json({
        success: false,
        message: "Address not saved",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address saved",
      data: savedAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId",
      });
    }

    const addresses = await AddressModel.find({ userId });

    if (!addresses) {
      return res.status(400).json({
        success: false,
        message: "No address found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Addresses found",
      data: addresses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or addressId",
      });
    }

    const address = await AddressModel.findOneAndUpdate(
      { _id: addressId, userId },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or user does not own this address",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      message: "Error updating address",
      error: error.message || "Unknown error",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or addressId",
      });
    }

    const address = await AddressModel.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted",
      data: address,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export { addAddress, fetchAllAddress, editAddress, deleteAddress };
