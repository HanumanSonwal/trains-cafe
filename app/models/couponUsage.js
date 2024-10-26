import mongoose from "mongoose";

const couponUsageSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
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

export default mongoose.models.CouponUsage ||
    mongoose.model("CouponUsage", couponUsageSchema);