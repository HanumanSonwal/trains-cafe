// models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryid :{
        type: String,
        unique: true,    // Ensure categoryid is unique
        required: true   // Optional: Ensure categoryid is provided
    },
    categoryTitle: String,
    categoryImageUrl: String
});

module.exports = mongoose.model('Category', categorySchema); // Correct export
