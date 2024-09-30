import mongoose from 'mongoose';
import { boolean } from 'zod';

const MenuSchema = new mongoose.Schema({
    Item_Name: { type: String, required: true },
    image: { type: String, required: true },
    Category:{ type: String, required: true },
    Vendor: { type: String, required: true },
    Price: { type: String, required: true },
    Discount:{ type: String, required: true },
    Food_Type:{ type: String, required: true },
    Description:{ type: String, required: true },
});

// This prevents model overwriting in development
export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
