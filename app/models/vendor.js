import mongoose from 'mongoose';
import { boolean } from 'zod';

const VendorSchema = new mongoose.Schema({
    Vendor_Name: String,
    Vendor_Id: String,
    Contact_No:String,
    Stations: String,
    Food_Type: String,
    Status:String,
    Action:Boolean
});

// This prevents model overwriting in development
export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
