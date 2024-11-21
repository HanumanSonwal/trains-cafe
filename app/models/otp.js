import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 360 },
    email: { type: String, required: true}
});

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);


