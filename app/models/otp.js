import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 360 }
});

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);


