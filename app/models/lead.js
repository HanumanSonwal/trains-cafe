import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    mobile: { type: String, default: "" },
    email: { type: String, default: "" },
    station: { type: String, default: "" },
    train_number: { type: String, default: "" },
    pnr: { type: String, default: "" },
    cartItems: { type: Array, default: [] },
    source: { type: String, default: "checkout" }, 
    status: { type: String, default: "new" }, 
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
