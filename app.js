const express = require('express');
const mongoose = require('mongoose');
const authRouter= require("./routes/authRoutes");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const {requireAuth, checkUser} = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(cookieparser());



// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://ashishphog:iGdfGxRn0oGCpHpn@mydb.rfdvkmb.mongodb.net/';
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    console.log("databse connected successfully!!!!");
    app.listen(3000)})
  .catch((err) => console.log(err));

// routes
app.get('*',checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRouter);


