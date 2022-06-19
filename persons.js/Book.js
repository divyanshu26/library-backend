class BookReservation{
    constructor(creationDate,status,bookItemBarcode, memberId){
        this._creationDate = creationDate;
        this._status = status;
        this._bookItemBarcode = bookItemBarcode;
        this_memberId = memberId;
    }

    fetchReservationDetails(barcode){

    }

}

class BookLending{

}

class Fine{}

class Rack{
    constructor(){
        this.rack = '1A7' 
    }
}


class Book{
    constructor(ISBN, title, subject, publisher, language, numberofPages,authors){
        this._ISBN = ISBN;
        this._title = title;
       // this._subject = subject;
       // this._publisher = publisher;
       // this._language = language;
       // this._numberofPages = numberofPages;
        this._authors = authors;
    }
}

class bookItem extends Book{
    constructor(ISBN, title, subject, publisher, language, numberofPages,authors,barcode, isReferenceOnly, borrowed, dueDate, price, format, status, dateOfPurchase, publicationDate){
        super(ISBN, title, subject, publisher, language, numberofPages,authors);
        //this._barcode = barcode;
        this._isReferenceOnly = isReferenceOnly;
       // this._borrowed = borrowed;
        this._dueDate = dueDate;
       // this._price = price;
       // this._format = format;
        this._status = status;
       // this._dateOfPurchase = dateOfPurchase;
        this._publicationDate = publicationDate;
        this.placedAt = new Rack();
    }

}

module.exports = bookItem;
