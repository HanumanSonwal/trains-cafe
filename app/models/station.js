import mongoose from 'mongoose';

const StationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: Boolean, default: true }
 
});

export default mongoose.models.Station || mongoose.model('Station', StationSchema);


