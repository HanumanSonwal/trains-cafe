import mongoose from 'mongoose';

const VendorRegistrationSchema = new mongoose.Schema({
    Vendor_Name: { type: String, required: true },
    Restaurant_Name: { type: String, required: true },
    Contact_No: { type: String, required: true },
    Station: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Station' // Enforce specific food types
    },
    Email: {
        type: String,
        required: true,
      },
    Distance: { type: Number, required: true },
    GST_Number: { type: Number },
    FSSAI_License: { type: Number},
    Message: { type: String},
   
 
});

export default mongoose.models.vendorregistration || mongoose.model('vendorregistration', VendorRegistrationSchema);


