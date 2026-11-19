import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const couponSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },
        // short line shown on the offer card, e.g. "Perfect for group & family travel"
        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: 120,
        },
        code: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            uppercase: true,
            maxlength: 12,
        },
       startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        minimumAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        discount: {
            // "fix" and "flat" both mean a fixed rupee amount
            type: {
                type: String,
                enum: ["fix", "flat", "percentage"],
                required: true,
            },
            value: {
                type: Number,
                required: true,
                min: 0,
            },
        },
        status: {
            type: String,
            enum: ["published", "draft"],
            default: "draft",
        }
    },
);

couponSchema.plugin(mongoosePaginate);


export default mongoose.models.Coupon ||
    mongoose.model("Coupon", couponSchema);
