// models/counter.js



// models/counter.js
import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // E.g., "vendorId"
  seq: { type: Number, default: 0 },
});

export default mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

