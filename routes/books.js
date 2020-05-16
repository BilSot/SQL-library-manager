var express = require('express');
var router = express.Router();
const Book = require("../models/index").Book;

function asyncHandler(cb){
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch(error){
            res.status(500).send(error);
        }
    }
}

router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("books/index", { books, title: "Books" });
}));

router.get('/new', asyncHandler(async (req, res) => {
    res.render("books/create-new", { book: {}, title: "New Book" });
}));

router.get('/:id', asyncHandler(async (req, res) => {
    res.render("books/update-book", { book: {}, title: "New Book" });
}));

router.post('/:id', asyncHandler(async (req, res) => {
    //res.render("books/update-book", { book: {}, title: "New Book" });
}));

module.exports = router;
