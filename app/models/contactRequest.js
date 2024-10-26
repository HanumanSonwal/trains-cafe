import mongoose from 'mongoose';

const ContactRequestSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    enum: ['Hotel', 'Coolie', 'BulkOrder','ContactUs'], // Only allow these slugs
  },
  Name: {
    type: String,
    required: true,
  },
  ContactNumber: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ContactRequestModel = mongoose.models.ContactRequest || mongoose.model('ContactRequest', ContactRequestSchema);

export default ContactRequestModel;
