import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const WebPageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [], required: true },
    pageData: { type: String, required: true },
    status: { type: String, default: "draft", enum: ["draft", "published"] },
}, {
    timestamps: true,
});

WebPageSchema.plugin(mongoosePaginate)

    
const WebPage = mongoose.models.WebPage || mongoose.model('WebPage', WebPageSchema);

export default WebPage;