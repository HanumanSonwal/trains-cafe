// // import mongoose from "mongoose";
// // import mongoosePaginate from "mongoose-paginate-v2";

// // const OrderSchema = new mongoose.Schema({
// //     vendor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "vendors" },
// //     station: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "stations" },
// //     train: {
// //         train_number: { type: String, required: false },
// //         train_pnr : { type: String, required: false },        
// //     },
// //     total: {
// //         type: Number,
// //         required: false,
// //         min: 0
// //     },
// //     subTotal: {
// //         type: Number,
// //         required: false,
// //         min: 0
// //     },
// //     couponAmount: {
// //         type: Number,
// //         required: false,
// //         min: 0
// //     },
// //     user_details: {},
// //     rpOrderId: {
// //         type: String,
// //         required: false
// //     },
// //     payment: {
// //         rp_payement_id: {
// //             type: String,
// //             required: false
// //         },
// //         payment_method: {
// //             type: String,
// //             enum: ["COD", "UPI", "Card", "Netbanking"],
// //             required: false
// //         },
// //         payment_status: {
// //             type: String,
// //             enum: ["pending", "completed", "cancelled"],
// //             required: false
// //         },
// //         amount: {
// //             type: Number,
// //             required: false,
// //             min: 0
// //         },
// //         tax: {
// //             type: Number,
// //             required: false,
// //             min: 0
// //         },
// //         vpa: {
// //             type: String,
// //             required: false
// //         },
// //     },
// //     status: {
// //         type: String, required: false,
// //         enum: ["pending","processing", "completed", "cancelled"],
// //         default: "pending"
// //      },
// //       timestamps: true ,
// // })

// // OrderSchema.plugin(mongoosePaginate)

// // export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
// import mongoose from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

// const OrderSchema = new mongoose.Schema(
//   {
//    vendor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "vendor" },

//     station: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Station" },

//     train: {
//       train_number: { type: String, required: false },
//       train_pnr: { type: String, required: false },
        
//     },

//     total: {
//       type: Number,
//       required: false,
//       min: 0
//     },
//     subTotal: {
//       type: Number,
//       required: false,
//       min: 0
//     },
//     couponAmount: {
//       type: Number,
//       required: false,
//       min: 0
//     },
//     user_details: {}, // You might want to define this better
//     rpOrderId: {
//       type: String,
//       required: false
//     },
//     payment: {
//       rp_payement_id: {
//         type: String,
//         required: false
//       },
//       payment_method: {
//         type: String,
//         enum: ["COD", "UPI", "Card", "Netbanking"],
//         required: false,
//         default: "placed"
//       },
//       payment_status: {
//         type: String,
//         enum: ["pending", "paid", "failed"],
//         required: false
//       },
//       amount: {
//         type: Number,
//         required: false,
//         min: 0
//       },
//       tax: {
//         type: Number,
//         required: false,
//         min: 0
//       },
//       vpa: {
//         type: String,
//         required: false
//       },
//     },

//     status: {
//       type: String,
//       required: false,
//       enum: ["placed", "confirm", "cancel", "dispatch","delivered"],
//       default: "placed"
//     },
//   }, 
//   {
//     timestamps: true, // ✅ This is the correct place for it
//   }
// );

// OrderSchema.plugin(mongoosePaginate);

// export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const OrderSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "vendor" },

    station: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Station" },
    //category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category" },


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
      required: false,
      min: 0,
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
        enum: ["COD", "UPI", "Card", "Netbanking"],
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

// 🔢 Pre-save hook to generate custom order_id like TC20250001
OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.order_id) {
    const prefix = "TC2025";
    const lastOrder = await mongoose.models.Order
      .findOne({ order_id: { $regex: `^${prefix}` } })
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

// 📌 Add index for uniqueness
OrderSchema.index({ order_id: 1 }, { unique: true });

// 🔁 Enable pagination plugin
OrderSchema.plugin(mongoosePaginate);

// ✅ Export model
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
