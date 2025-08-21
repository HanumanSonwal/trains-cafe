import mongoose from "mongoose";
import Counter from "./counter";

const StationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: Boolean, default: true },
  stationId: { type: Number, unique: true },
});

// StationSchema.pre("save", async function (next) {
//   if (this.isNew) {
//       try {
//       const counter = await Counter.findOneAndUpdate(
//         { id: "stationId" },
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true }
//       );
//       this.stationId = counter.seq;
//     } catch (err) {
//       return next(err);
//     }
//   }
//   next();
// });
StationSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Find & increment counter
      let counter = await Counter.findOneAndUpdate(
        { id: "stationId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // 🔑 Always check against the latest stationId in DB
      const latestStation = await mongoose.model("Station").findOne().sort({ stationId: -1 });

      if (latestStation && counter.seq <= latestStation.stationId) {
        counter.seq = latestStation.stationId + 1;
        await counter.save();
      }

      this.stationId = counter.seq;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.models.Station ||
  mongoose.model("Station", StationSchema);
