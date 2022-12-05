const db = require('./index');
const bcrypt = require('bcrypt');

db.query(`INSERT INTO public.users(
	id, name, last_name, personal_address, email, office, password, role)
	VALUES (DEFAULT, $1, $2, $3, $4, $5:raw, $6, $7);` ,
    ["admin","admin","admin","admin@admin.all", 1,bcrypt.hashSync("adminallviews", 10),"*"])
.then(response =>{
    print("Successful query");
})
.catch(error =>{
    print("Error occured: " + error);
});