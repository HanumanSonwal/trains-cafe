import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
    Vendor_Name: { type: String, required: true },
    Contact_No: { type: String, required: true },
    Alternate_Contact_No: { type: String, required: true },
    Station: { type: String, required: true },
    Delivery_Charges: { type: Number, required: true },
    Min_Order_Value: { type: Number, required: true },
    Min_Order_Time: { type: Number, required: true },
    Working_Time: { type: String, required: true },
    Weekly_Off: { type: String, required: true },
    Food_Type: { type: String, required: true },
    Description: { type: String, required: true },
    Address: { type: String, required: true },
    Status: { type: String, default: 'Active' }, 
 
});

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);


