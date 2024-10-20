import mongoose from "mongoose";

const OrderItemsSchema = new mongoose.Schema({
    Order_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'orders' },
    Item_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'menus' },
    Quantity: { type: Number, required: true, min: 1 },
    Price: { type: Number, required: true, min: 0 },
});

export default mongoose.models.OrderItems || mongoose.model('OrderItems', OrderItemsSchema);