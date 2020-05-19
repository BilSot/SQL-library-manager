var express = require('express');
var router = express.Router();
const {Book, Sequelize} = require("../models/index");
const Op = Sequelize.Op;
var search = '';

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

async function queryBooks(search, page) {
    console.log(search, page);
    let booksPerPage = 4;
     let {count, rows} = await Book.findAndCountAll({
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    author: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    genre: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    year: {
                        [Op.like]: `%${search}%`
                    }
                }
            ]
        },
        offset: page * booksPerPage,
        limit: booksPerPage
    });

    let numberOfPages = Math.ceil(count / booksPerPage);
    let queryData = {
        numberOfPages,
        rows: rows
    }
    return queryData;
}

router.get('/', asyncHandler(async (req, res) => {
    let page = req.query.page ? req.query.page - 1 : 0;

    const {rows, numberOfPages} = await queryBooks(search, page);
    if (page < 0 || page > numberOfPages) {
        res.status(404).render("books/page-not-found");
    }
    res.render("books/index", {books: rows, title: "Books", numberOfPages, search});
}));

router.post("/", asyncHandler(async (req, res) => {
    let page = req.query.page ? req.query.page - 1 : 0;
    search = req.body.search ? req.body.search : '';

    const {rows, numberOfPages} = await queryBooks(search, page);
    res.render("books/index", {books: rows, title: "Books", numberOfPages, search});
}));

router.get('/new', (req, res) => {
    res.render("books/create-new", {book: {}, title: "New Book"});
});

router.post('/new', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect("/");
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            res.render("books/create-new", {book, errors: error.errors, title: "New Book"})
        } else {
            throw error;
        }
    }
}));

router.get('/:id', asyncHandler(async (req, res) => {
    let book = await Book.findByPk(req.params.id);
    if (book) {
        res.render("books/update-book", {book, title: "Update Book"});
    } else {
        res.status(404).render("books/page-not-found");
    }
}));

router.post('/:id/update', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect("/");
        } else {
            res.status(500).render("books/server-error");
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render("books/update-book", {book: book, errors: error.errors, title: "Update Book"})
        } else {
            throw error;
        }
    }
}));

router.post("/:id/delete", asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if (book) {
            await book.destroy();
            res.redirect("/");
        } else {
            res.status(500).render("books/server-error");
        }
    } catch (error) {
        throw error;
    }
}));

//all the other non-existing routes
router.get('*', function(req, res){
    res.status(404).render("books/page-not-found");
});

module.exports = router;
