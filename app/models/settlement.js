import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
      required: true,
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    onlineAmount: Number,
    codAmount: Number,

    vendorShare: Number,
    cafeShare: Number,
    tax: Number,
    cafeNet: Number,

    settlementStatus: String,
    settlementAmount: Number,

    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    invoiceUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Settlement ||
  mongoose.model("Settlement", settlementSchema);
