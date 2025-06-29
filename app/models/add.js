import mongoose from 'mongoose';

const AdvertisementsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String},
  slug: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date},
  endDate: { type: Date  },
 
});

export default mongoose.models.Advertisements || mongoose.model('Advertisements', AdvertisementsSchema);
