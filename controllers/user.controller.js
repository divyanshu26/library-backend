//let userModel = require('../dao/usersDAO');
let {booksDataAccess,bookStatus} = require('../dao/booksDAO');
let {userDataAccess} = require('../dao/usersDAO');

class Constants{
    static MAX_BOOKS_ALLOWED = 3;
    static MAX_LENDING_DAYS = 10;
    static MAX_RESERVE_BOOKS = 2;
    static MAX_RESERVE_ONE_BOOK = 2;
}


class userController{

static getUser = async (req,res)=>{
    res.status(200).send(req.user);
}

static issueBook = async function(req,res){
    console.log('issue book');
    try{
        let user = req.user;
        if(user.totalBooksIssued >= Constants.MAX_BOOKS_ALLOWED)throw new Error('Max Issue Limit Reached');

        let oneBook = (await booksDataAccess.getOneBook({...req.body}));
        oneBook = oneBook.shift(); 
        if(oneBook.status === bookStatus.Available){
            await userDataAccess.issueBook(user,oneBook);
            await booksDataAccess.issueBook(user, oneBook);
            res.status(200).send({'status':'success'})
        }else{
            res.status(200).send({'status':'book is already issued .'})
        };
    }catch(err){
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',err);
        res.status(200).send({'status':err.message});
    }
   // console.log(booksModel.findo)
}

static returnBook = async function(req,res){
    //checkfor FIne here
    console.log('return book');
    let user = req.user;
    let oneBook = (await booksDataAccess.getOneBook({...req.body}));
    oneBook = oneBook.shift(); 
    //console.log(user);
    try{
        if(oneBook.status === bookStatus.Issued){
            await userDataAccess.returnBook(user,oneBook);
            await booksDataAccess.returnBook(user, oneBook);
            let issuedBooks = user.issuedBooks.map(item=>item);
            res.status(200).send({'status':'success'});
        }else{
            res.status(200).send({'status':'book is not issued,cant be returned .'})
        };
    }catch(err){
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',err);
        res.status(200).send({'status':err.message});
    }
   // console.log(booksModel.findo)
}


static reserveBook = async (req,res)=>{
    console.log('reserve')
    try{
        let user = req.user;
        if(user.totalBooksReserved >= Constants.MAX_RESERVED_BOOKS)throw new Error('Max Reserve Limit Reached');
        let oneBook = (await booksDataAccess.getOneBook({...req.body}));
        oneBook = oneBook.shift(); 
        if(oneBook.reservedBy.length >= Constants.MAX_RESERVE_ONE_BOOK) throw new Error('Book Reserve Queue Full .Please Try Later');
        console.log('reserveBook',oneBook);
        if(user.issuedBooks.length){
            user.issuedBooks.forEach(element => {
                if(element.ISBN === oneBook.ISBN)throw new Error('Book issued by same user')
            });
        }
        if(user.reservedBooks.length){
            user.reservedBooks.forEach(element => {
                if(element.ISBN === oneBook.ISBN)throw new Error('Book reserveed by same user')
            });
        }
        if(oneBook.status === bookStatus.Issued){
            await userDataAccess.reserveBook(user,oneBook);
            await booksDataAccess.reserveBook(user, oneBook);
            res.status(200).send({'status':'success'})
        }else{
            res.status(200).send({'status':'book is not issued .'})
        };
    }catch(err){
        console.log('user-ctrl:85',err)
        res.status(500).send({'status':'internal server error'})
    }
}

static removeBookReservation = async (req,res)=>{
    try{
        let user = req.user;
        let oneBook = (await booksDataAccess.getOneBook({...req.body}));
        oneBook = oneBook.shift(); 
        //console.log(oneBook,user);
        //throw 'err';
        
        if(oneBook.reservedBy.length > 0){
            //await userDataAccess.removeReservation(user,oneBook);
            await booksDataAccess.removeReservation(user, oneBook);
            console.log(oneBook,user);
            res.status(200).send({'status':'success'})
        }else{
            res.status(200).send({'status':'book is not reserved by anyone .'})
        };
    }catch(err){
        console.log('user-ctrl:85',err)
        res.status(500).send({'status':'internal server error'})
    }
}
}

module.exports = userController;