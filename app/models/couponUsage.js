import mongoose from "mongoose";

const couponUsageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.CouponUsage ||
    mongoose.model("CouponUsage", couponUsageSchema);