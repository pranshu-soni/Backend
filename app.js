const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const passport = require('passport');

//passport config
require('./config/passport')(passport);


//connect db
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://admin:admin123@cluster0.nii5lem.mongodb.net/my_admin?retryWrites=true&w=majority`, {useNewUrlParser: true})
    .then(console.log('MongoDB connected'))
    .catch(err => console.log(err));


// Use the body-parser middleware
app.use( bodyParser.urlencoded({ extended: false }) )
app.use( bodyParser.json() )

app.use(cookieParser('secret'));

// Sessions
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Flash messages
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;