import mongoose from "mongoose";

const couponUsageSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            default: "",
        },
        phone: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// "has this mobile already used this coupon?"
couponUsageSchema.index({ code: 1, phone: 1 }, { unique: true });

export default mongoose.models.CouponUsage ||
    mongoose.model("CouponUsage", couponUsageSchema);