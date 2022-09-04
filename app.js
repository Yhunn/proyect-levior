const express = require('express');
const port = 3000;
const app = express();
const db = require('./db');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");

app.get('/', (req,res) => {
    res.render("index.ejs");
});

const usersRoute = require("./routes/users_route");
app.use("/users", usersRoute);

const poGenRoute = require("./routes/po_gen_route");
app.use("/PO_Generator", poGenRoute);

app.listen(port, ()=> 
    console.log(`Server running at http://localhost:${port}`)
);