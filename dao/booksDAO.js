const mongoose = require('mongoose');

const bookStatus = {
    Available: "available",
    Issued: "issued"
}

const bookSchema = new mongoose.Schema({
    ISBN :{
        type: String,
        required: true,
        unique: true,
    },
    title:{
        type: String,
        required: true
    },

    authors: [String],
    publicationDate:{
        type:Date,
        default: ()=>Date.now(),
        immutable : true,
    },
    status:{
        type:String,
        default: 'available'
    },
    issuedBy:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'users',
        default:null
    },
    reservedBy:{
        type:Array,
        default:[]
    },
    isReferenceOnly:{
        type:Boolean,
        default:false,
        
    },
    issueDate:{
        type:Date,
        default:null
    },
    dueDate:{
        type:Date,
        default:null
    },
    placedAt:{
        type:String,
        default: '1A7'
    }

});



let booksModel = mongoose.model('Books', bookSchema);


class booksData{;

static getAllBooks = async function(){
    let books = await booksModel.find();
    //console.log(books[0]);
    let booksArray = books.map((item,index)=>{
        let obj = {};
        obj.authors = item.authors;
        obj.status = item.status;
        obj.isReferenceOnly = item.isReferenceOnly;
        obj.ISBN = item.ISBN;
        obj.placedAt = item.placedAt;
        obj.publicationDate = item.publicationDate;
        obj.title = item.title;
        return obj
    });
    //console.log(books[0]);
    return booksArray;
}

static getOneBook = async function(isbnObj){
    let books = await booksModel.find(isbnObj);
    
    return books;
}

static issueBook = async function(user,book){
   // console.log(book,user);
    if(book.status === bookStatus.Available){
      book.issuedBy = user._id;
      book.issueDate = new Date();
      book.dueDate = new Date();
      book.dueDate.setDate(book.dueDate.getDate() + 10);
      book.status = bookStatus.Issued;
      await book.save();
    }else{
        throw new error('Book is already issued');
    }
}

static returnBook = async (user,book)=>{
    if(book.status === bookStatus.Issued){
        book.status = bookStatus.Available;
        book.issuedBy = null;
        book.issueDate = null;
        book.dueDate = null;
        await book.save();
    }else{
        throw new Error('Book is not issued');
    }
}

static reserveBook = async function(user,book){
    //this method will be for admin to get details about a particular book
    if(book.status === bookStatus.Issued){
        let member = {};
        member.userId = user._id;
        member.reservedOnDate = new Date();
        book.reservedBy.push(member);
        await book.save();
    }else{
        throw new Error('Book is not issued');
    }
}

static removeReservation = async (user,book)=>{
    if(book.reservedBy.length > 0){
        let bookArray = book.reservedBy.filter(item=>{
            console.log(item.userId.toString(),user._id.toString(),item.userId.toString() !== user._id.toString());
            return item.userId.toString() !== user._id.toString();
        });
        book.reservedBy = bookArray;
        await book.save();
    }else{
        throw new Error('Book is not reserved');
    }
}

static fetchIssueDetails = ()=>{}

}





exports.booksDataAccess = booksData;
exports.bookStatus = bookStatus;