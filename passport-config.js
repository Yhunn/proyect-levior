const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

function initialize(passport) {
    const users = [];
        db.any(`SELECT * FROM "users"`)
            .then(rows => {
                rows.forEach(row => {
                    users.push({
                        id: row.id,
                        name: row.name,
                        lastName: row.last_name,
                        role: row.role,
                        office: row.office,
                        email: row.email,
                        password: row.password
                    });
                });
                const authenticateUser = (email, password, done) => {
                    const user = users.find(user => user.email === email);
                    if (user == null) {
                        return done(null, false, { message: 'No user with that email' });
                    }
                    try {
                        if (bcrypt.compareSync(password, user.password)) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password is not correct' });
                        }
                    } catch (e) {
                        return done(e);
                    }
                }
            
                passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
                passport.serializeUser((user, done) => done(null, user.id));
                passport.deserializeUser((id, done) => {
                    return done(null, users.find(user => user.id === id));
                });
            });
}

module.exports = initialize;