import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    title: String,
    image: String,
});

// This prevents model overwriting in development
export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
