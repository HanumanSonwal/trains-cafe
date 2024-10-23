import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const couponSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },
        code: {
            type: String,
            unique: true,
            required: true,
            maxlength: 5,
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
        },
        discount: {
            type: {
                type: String,
                enum: ["fix", "percentage"],
                required: true,
            },
            value: {
                type: Number,
                required: true,
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