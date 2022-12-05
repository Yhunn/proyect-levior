const initOptions = {
    //INITIALIZATION OF PG-PROMISE
};

const pgp = require('pg-promise')(initOptions);
const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString);

module.exports = db;