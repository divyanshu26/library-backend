const {booksDataAccess} = require('../dao/booksDAO');


class BooksController{ 


static getAllBooks = async function(req,res){
    //let books = new booksDAO();
    let data = await booksDataAccess.getAllBooks();
    res.status(200).send(data);
}

// static getOneBook = async function(req,res){

// }



}
module.exports = BooksController;