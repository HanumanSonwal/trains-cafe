import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const WebStationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        unique: true,
        required: true
    }   ,
    Station: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Station' // Enforce specific food types
        },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    keywords: { type: [], required: true },
    pageData: { type: String, required: true },
    status: { type: String, default: "draft", enum: ["draft", "published"] },
}, {
    timestamps: true,
});

WebStationSchema.plugin(mongoosePaginate);

    
const WebStation = mongoose.models.WebStation || mongoose.model('WebStation', WebStationSchema);

export default WebStation;