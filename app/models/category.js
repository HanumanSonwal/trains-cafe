// import mongoose from 'mongoose';
// import CounterModel from './counter';

// const CategorySchema = new mongoose.Schema({
//   categoryid: { type: String, unique: true },
//   title: { type: String, required: true },
//   image: { type: String, required: true },
// });

// CategorySchema.pre('save', async function (next) {
//   if (this.isNew) {
//     try {
//       const counter = await CounterModel.findOneAndUpdate(
//         { id: 'categoryid' },
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true }
//       );
//       this.categoryid = `c${counter.seq}`;
//     } catch (err) {
//       return next(err);
//     }
//   }
//   next();
// });

// export default mongoose.models.Category || mongoose.model('Category', CategorySchema);

import mongoose from "mongoose";
import CounterModel from "./counter";

const CategorySchema = new mongoose.Schema({
  categoryid: { type: Number, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
});

CategorySchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await CounterModel.findOneAndUpdate(
        { id: "categoryid" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.categoryid = counter.seq; // fixed!
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
