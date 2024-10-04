import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    Category_Id: { type: String, required: true, unique: true }, 
    title: { type: String, required: true },
    image: { type: String, required: true },
});

// This prevents model overwriting in development
export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
