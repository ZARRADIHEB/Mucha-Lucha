import mongoose from "mongoose";

const AddressSchema = mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    zipcode: Number,
    phone: Number,
    notes: String,
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("Address", AddressSchema);

export default AddressModel;
