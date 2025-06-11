import mongoose from "mongoose";

const StationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: Boolean, default: true },
  stationId: { type: Number, unique: true },
});

StationSchema.pre("save", async function (next) {
  if (this.isNew) {
      try {
      const counter = await CounterModel.findOneAndUpdate(
        { id: "stationId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.stationId = counter.seq;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.models.Station ||
  mongoose.model("Station", StationSchema);
