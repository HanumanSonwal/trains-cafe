import mongoose from "mongoose";
import CounterModel from "./counter";

const VendorSchema = new mongoose.Schema({
  vendorId: { type: Number, unique: true },
  Vendor_Name: { type: String, required: true },
  Contact_No: { type: String, required: true },
  image: { type: String, required: true },
  Alternate_Contact_No: { type: String},
  Station: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Station", // Enforce specific food types
  },
  Delivery_Charges: { type: Number, required: true },
  Min_Order_Value: { type: Number, required: true },
  Min_Order_Time: { type: Number, required: true },
  Working_Time: { type: String, required: true },
  Weekly_Off: { type: String, required: true },
  Food_Type: { type: String, required: true },
  Description: { type: String, required: true },
  Address: { type: String, required: true },
  Status: { type: String, default: "Active" },
 
},
{
  timestamps: true // ✅ CORRECT placement for timestamps
});
VendorSchema.pre("save", async function (next) {
  if (this.isNew && !this.vendorId) {
    try {
      const counter = await CounterModel.findOneAndUpdate(
        { id: "vendorId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // <-- upsert creates it if it doesn't exist
      );
      this.vendorId = counter.seq;
    } catch (err) {
      return next(err);
    }
  }
  next();
});


export default mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
