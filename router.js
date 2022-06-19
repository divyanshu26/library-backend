const express = require('express');

const router = express.Router();

var Auth = require('./controllers/authentication.controller');
const passportService = require('./services/passport');
const passport = require('passport');

const booksCtrl = require('./controllers/books.controller');

const requireAuth = passport.authenticate('jwt',{session:false});
const requireSignIn = passport.authenticate('local',{session:false});

const userCtrl = require('./controllers/user.controller');

router.use((req,res,next)=>{
    console.log('router');
    next();
})

// router.use('/signup',(req,res,next)=>{

//     console.log('router',req.url);
//     res.send({value:'something was called'})
// })

router.get('/api/v1/user',requireAuth,userCtrl.getUser);

router.post('/api/v1/signin',requireSignIn,Auth.signIn);


router.post('/api/v1/signup',Auth.signup);


router.get('/api/v1/getBooks',requireAuth,(booksCtrl.getAllBooks));

router.post('/api/v1/issueBook',requireAuth,(userCtrl.issueBook));

router.post('/api/v1/returnBook',requireAuth,(userCtrl.returnBook));

router.post('/api/v1/reserveBook',requireAuth,(userCtrl.reserveBook));

router.post('/api/v1/removeBookReservation',requireAuth,(userCtrl.removeBookReservation));
module.exports = router;