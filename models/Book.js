'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {
    }

    Book.init({
        title: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Please provide the title of the book'
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Please provide the name of the author'
                }
            }
        },
        genre: Sequelize.STRING,
        year: Sequelize.INTEGER

        },
        {
            sequelize
        }
    )
    ;

    return Book;
}
