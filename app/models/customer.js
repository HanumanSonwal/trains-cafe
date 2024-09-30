import mongoose from 'mongoose';
import { boolean } from 'zod';

const CustomerSchema = new mongoose.Schema({
    Customer_Name: { type: String, required: true },
    Mobile_Number: { type: String, required: true },
    Alternative_Mobile_Number: { type: String },
    Email: { type: String, required: true, match: /.+\@.+\..+/ }, 
    PNR: { type: String, required: true },
    Coach: { type: String, required: true },
    Discount:{ type: Number, required: true },
    Seat_No:{ type: String, required: true },
    Optional_Instruction:{ type: String},
});

// This prevents model overwriting in development
export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
