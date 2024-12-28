import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const WebTrainSchema = new mongoose.Schema({
    name: {

        type: String,
        required: true,
    },
    title: {
        type: String,
        unique: true,
        required: true
    }   ,
    trainname: {
        type: String,
        required: true,
    },
    trainnumber: {
        type: String,
        required: true,
    },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    keywords: { type: [], required: true },
    pageData: { type: String, required: true },

  
    status: { type: String, default: "draft", enum: ["draft", "published"] },
}, {
    timestamps: true,
});

WebTrainSchema.plugin(mongoosePaginate);

    
const WebTrain = mongoose.models.WebTrain || mongoose.model('WebTrain', WebTrainSchema);

export default WebTrain;