require('dotenv').config();
const express = require('express');
const port = 3000;
const app = express();
const db = require('./db');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

//SERVER SIDE SET UP
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

const initializePassport = require('./passport-config');
initializePassport(passport);

//FEEDING SERVER THE ROUTES TO THE VIEWS
app.get('/', checkAuthenticated, (req,res) => {
    var permissions = String(req.user.role).split(',');
    res.render("index.ejs",{ views: permissions, username: req.user.name });
});

app.delete('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

const loginRoute = require("./routes/login_user_route");
app.use("/login", loginRoute);

const usersRoute = require("./routes/users_route");
app.use("/users", usersRoute);

const poGenRoute = require("./routes/po_gen_route");
app.use("/PO_Generator", poGenRoute);

const poQueryRoute = require("./routes/po_supply_route");
app.use("/PO_Supply", poQueryRoute);

//MIDDLEWARE FUNCTIONS
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('login');
}

app.listen(port, ()=> 
    console.log(`Server running at http://localhost:${port}`)
);