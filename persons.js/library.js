const bookStatus = {
    available : 'Available',
    reserved : 'Reserved',
    lost : 'Lost',
    loadned: 'Loaned',
}

class Address{
    constructor(streets, city, state, zipCode, country){
        this._street = street;
        this._city = city;
        this._state = state;
        this._zipCode = zipCode;
        this._country = country;

    }
}

class Constants{
    static MAX_BOOKS_ALLOWED = 5;
    static MAX_LENDING_DAYS = 10;
}


class Person {
    constructor(name,streetAddress, city, state, zipCode, country,email, phone){
        this._name = name;
        this._address = new Address(streetAddress, city, state, zipCode, country);
        this._email = email;
        this._phone = phone;
    }
}


class Account{
    constructor(password,status,name,streetAddress, city, state, zipCode, country,email, phone){
        this.password = password;
        this.person = new Person(name,streetAddress, city, state, zipCode, country,email, phone);

        //resetPassword();
    }
}

class Librarian extends Account{}


class Member extends Account{
    constructor(dateJoined,password,name,address,email, phone,totalBooksIssued=[],booksIssued=0,booksReserved=0,totalBooksReserved=[]){
        super(password,status,name,streetAddress, city, state, zipCode, country,email, phone);
        this.dateofMembership = dateJoined;
        this._totalBooksIssued = totalBooksIssued;
        this.booksIssued = booksIssued;
        this.booksReserved = booksReserved;
        this._totalBooksReserved = totalBooksReserved;
    }

    get getTotalBooksCheckedOut(){
        return this._totalBooksIssued;
    }

    set setTotalBooksCheckedOut(val){
        this._totalBooksCheckedOut += val;
    }


    checkOutBook(bookItem){
        if(this.getTotalBooksCheckedOut() >= Constants.MAX_BOOKS_ALLOWED){
            //user not allowed to checkOutBook
            return false;
        };

        let bookReservation = BookReservation.fetchReservationDetails(bookItem.getBarCode());

        if(bookReservation != null && bookReservation != this.getId()){
            //user not allowed to checkOUtBook
            return false;
        }else if(bookReservation != null){
            bookReservation.updateStatus('completed');

        }

        if(!bookItem.checkout(this.getId())){
            return false;
        }

        this.setTotalBooksCheckedOut(1);
        bookItem.updateBookItemStatus(bookStatus.loadned)
        return true
    }

    checkForFine(bookItemBarCode){
        return 0;
    }

    returnBookItem(bookItem){
        this.checkForFine();
        let bookReservation = BookReservation.fetchReservationDetails(bookItem.getBarCode());

        if(bookReservation != null){
            bookItem.updateBookItemStatus(bookStatus.reserved);
            //send book available notification
        }

        bookItem.updateBookItemStatus(bookStatus.available);

    }


}

//exports Librarian = Librarian;