require('dotenv').config();
const express = require('express');
const port = 3000;
const app = express();
const db = require('./db');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const path = require('path');

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
app.use(express.static(path.join(__dirname,"public")));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

//CODE TO LOCALLY SAVE ALL USERS
const initializePassport = require('./passport-config');
initializePassport(passport);

//FEEDING SERVER THE ROUTES TO THE VIEWS
app.get('/', checkAuthenticated, (req,res) => {
    var permissions = String(req.user.role).split(',');
    res.render("index.ejs",{ views: permissions, username: req.user.name, lastname: req.user.lastName });
});

app.delete('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

//APP ROUTES
const loginRoute = require("./routes/login_user_route");
app.use("/login", loginRoute);

const usersRoute = require("./routes/users_route");
app.use("/users", usersRoute);

const poGenRoute = require("./routes/po_gen_route");
app.use("/PO_Generator", poGenRoute);

const poSupplyRoute = require("./routes/po_supply_route");
app.use("/PO_Supply", poSupplyRoute);

const productsRoute = require("./routes/products_route");
app.use("/products", productsRoute);

const customersRoute = require("./routes/customers_route");
app.use("/customers", customersRoute);

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