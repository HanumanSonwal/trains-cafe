import mongoose from 'mongoose';
import { boolean } from 'zod';

const MenuSchema = new mongoose.Schema({
    Item_Name: String,
    image: String,
    Category:String,
    Vendor: String,
    Price: String,
    Discount:String,
    Status:String,
    Action:Boolean
});

// This prevents model overwriting in development
export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
