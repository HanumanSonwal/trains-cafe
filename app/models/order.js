// import mongoose from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

// const OrderSchema = new mongoose.Schema({
//     vendor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "vendors" },
//     station: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "stations" },
//     train: {
//         train_number: { type: String, required: false },
//         train_pnr : { type: String, required: false },        
//     },
//     total: {
//         type: Number,
//         required: false,
//         min: 0
//     },
//     subTotal: {
//         type: Number,
//         required: false,
//         min: 0
//     },
//     couponAmount: {
//         type: Number,
//         required: false,
//         min: 0
//     },
//     user_details: {},
//     rpOrderId: {
//         type: String,
//         required: false
//     },
//     payment: {
//         rp_payement_id: {
//             type: String,
//             required: false
//         },
//         payment_method: {
//             type: String,
//             enum: ["COD", "UPI", "Card", "Netbanking"],
//             required: false
//         },
//         payment_status: {
//             type: String,
//             enum: ["pending", "completed", "cancelled"],
//             required: false
//         },
//         amount: {
//             type: Number,
//             required: false,
//             min: 0
//         },
//         tax: {
//             type: Number,
//             required: false,
//             min: 0
//         },
//         vpa: {
//             type: String,
//             required: false
//         },
//     },
//     status: {
//         type: String, required: false,
//         enum: ["pending","processing", "completed", "cancelled"],
//         default: "pending"
//      },
//       timestamps: true ,
// })

// OrderSchema.plugin(mongoosePaginate)

// export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const OrderSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "vendors" },
    station: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "stations" },

    train: {
      train_number: { type: String, required: false },
      train_pnr: { type: String, required: false },
    },

    total: {
      type: Number,
      required: false,
      min: 0
    },
    subTotal: {
      type: Number,
      required: false,
      min: 0
    },
    couponAmount: {
      type: Number,
      required: false,
      min: 0
    },
    user_details: {}, // You might want to define this better
    rpOrderId: {
      type: String,
      required: false
    },
    payment: {
      rp_payement_id: {
        type: String,
        required: false
      },
      payment_method: {
        type: String,
        enum: ["COD", "UPI", "Card", "Netbanking"],
        required: false
      },
      payment_status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        required: false
      },
      amount: {
        type: Number,
        required: false,
        min: 0
      },
      tax: {
        type: Number,
        required: false,
        min: 0
      },
      vpa: {
        type: String,
        required: false
      },
    },

    status: {
      type: String,
      required: false,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending"
    },
  },
  {
    timestamps: true, // ✅ This is the correct place for it
  }
);

OrderSchema.plugin(mongoosePaginate);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
