const initOptions = {
    //INITIALIZATION OF PG-PROMISE
};

const pgp = require('pg-promise')(initOptions);
const connectionString = "postgresql://postgres:basededatos123@localhost:5432/leviordb"

const db = pgp(connectionString);

module.exports = db;