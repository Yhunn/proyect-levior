const express = require('express');
const port = 3000;

const app = express();

const db = require('./db');

app.use(express.json());

const usersRoute = require("./routes/users_route");
app.use("/users", usersRoute);

app.listen(port, ()=> 
    console.log(`Server running at http://localhost:${port}`)
);