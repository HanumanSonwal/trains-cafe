import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const OrderSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "vendor",
    },

    station: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Station",
    },

    train: {
      train_number: { type: String, required: false },
      train_pnr: { type: String, required: false },
    },

    order_id: {
      type: String,
      unique: true,
      required: false,
    },

    total: {
      type: Number,
      required: false,
      min: 0,
    },
    subTotal: {
      type: Number,
      required: false,
      min: 0,
    },
    couponAmount: {
      type: Number,
      default: 0,
    },

    adminDiscountPercent: {
      type: Number,
      default: 0,
    },

    adminDiscountValue: {
      type: Number,
      default: 0,
    },

    totalDiscount: {
      type: Number,
      default: 0,
    },

    user_details: {
      name: { type: String },
      mobile: { type: String },
      alternateMobile: { type: String },
      email: { type: String },
      pnr: { type: String },
      coach: { type: String },
      seatNo: { type: String },
      instructions: { type: String },
    },

    rpOrderId: {
      type: String,
      required: false,
    },

    payment: {
      rp_payement_id: { type: String },
      payment_method: {
        type: String,
        enum: ["COD", "UPI", "Card", "Netbanking", "RAZORPAY"],
        default: "COD",
      },
      payment_status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
        required: false,
      },
      amount: {
        type: Number,
        min: 0,
      },
      advanced: {
        type: Number,
        min: 0,
      },
      tax: {
        type: Number,
        min: 0,
      },
      vpa: { type: String },
    },

    status: {
      type: String,
      enum: ["placed", "confirm", "cancel", "dispatch", "delivered"],
      default: "placed",
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.order_id) {
    const prefix = "TC2025";
    const lastOrder = await mongoose.models.Order.findOne({
      order_id: { $regex: `^${prefix}` },
    })
      .sort({ createdAt: -1 })
      .select("order_id");

    let nextNumber = 1;
    if (lastOrder && lastOrder.order_id) {
      const lastNum = parseInt(lastOrder.order_id.replace(prefix, ""));
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }

    this.order_id = prefix + String(nextNumber).padStart(4, "0");
  }

  next();
});

OrderSchema.index({ order_id: 1 }, { unique: true });

OrderSchema.plugin(mongoosePaginate);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
