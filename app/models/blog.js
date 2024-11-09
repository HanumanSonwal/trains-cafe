import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const BlogSchema = new mongoose.Schema({
   
    title: {
        type: String,
        unique: true,
        required: true
    }   ,
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    metakeyword: { type: String, required: true },
    metatitle: { type: String, required: true },
    metadescription: { type: String, required: true },
    status: {
        type: String,
        enum: ['publish', 'draft'], // Allowed values for status
        required: true               // Make status required
    },
}, {
    timestamps: true,
});

BlogSchema.plugin(mongoosePaginate)

    
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export default Blog;
