const express = require('express');
const router = express.Router();
const Category = require('../models/category'); // Import Category model
const mongoose = require('mongoose');

// Route to get all categories
router.get('/', (req, res, next) => {
    Category.find()
        .then(result => {
            res.status(200).json({
                categorydata: result // Corrected the json method call
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Route to create a new category
router.post('/', (req, res, next) => {
    const newCategory = new Category({ // Renamed the variable to avoid conflict
        _id: new mongoose.Types.ObjectId(),
        categoryid: req.body.categoryid,
        categoryTitle: req.body.categoryTitle,
        categoryImageUrl: req.body.categoryImageUrl
    });

    newCategory.save()
        .then(result => {
            console.log(result);
            res.status(201).json({ // Changed status code to 201 for creation
                newCategory: result
            });
        })
        .catch(err => {
            console.log(err);
            if (err.code === 11000) { // Handle duplicate key errors
                res.status(409).json({
                    message: 'Category ID must be unique.',
                    error: err
                });
            } else {
                res.status(500).json({
                    error: err
                });
            }
        });
});
// Route to delete a category by categoryid
router.delete('/:categoryid', (req, res, next) => {
    const categoryid = req.params.categoryid;

    Category.deleteOne({ categoryid: categoryid })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({
                    message: 'Category successfully deleted.'
                });
            } else {
                res.status(404).json({
                    message: 'Category not found.'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
// Route to update a category by categoryid
// Route to update a category by categoryid
router.put('/:categoryid', (req, res, next) => {
    const categoryid = req.params.categoryid;
    const updatedData = {
        categoryTitle: req.body.categoryTitle,
        categoryImageUrl: req.body.categoryImageUrl
    };

    Category.updateOne({ categoryid: categoryid }, { $set: updatedData })
        .then(result => {
            if (result.matchedCount > 0) {
                // If a document was found and attempted to be updated, return success
                res.status(200).json({
                    message: 'Category successfully updated.'
                });
            } else {
                // If no document was found, return an error
                res.status(404).json({
                    message: 'Category not found.'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
