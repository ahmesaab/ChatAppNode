/**
 * Created by Ahmed on 3/4/2016.
 */
var Person = require('../models/person.js');
var DB = require('../data/database.js');

// constructor
function Service() {
    // always initialize all instance properties
    this.db = new DB();
    this.connection = this.db.getConnection();

    this.getPerson = function(id,callback){
        this.connection.query('SELECT id as id,firstName as fn, lastName as ln, color as c, shape as s FROM users WHERE id='+id,
            function(err, rows, fields) {
                if(err)
                    console.log(err);
                var person = new Person()
                if(rows.length>0)
                {
                    person = new Person(
                        parseInt(rows[0].id),
                        String(rows[0].fn),
                        String(rows[0].ln),
                        parseInt(rows[0].s),
                        parseInt(rows[0].c));
                }
                callback(person);
            }
        );
    };

    this.getUsers = function(callback){
        this.connection.query('SELECT id as id,firstName as fname, lastName as lname FROM users',
            function(err, rows, fields) {
                if(err)
                    console.log(err);
                var users = [];
                for (var i = 0; i < rows.length; i++) {
                    users.push(new Person(parseInt(rows[i].id),String(rows[i].fname),String(rows[i].lname)));
                }
                callback(users);
            }
        );
    };

    this.changeAttribute = function(attribute,value,id,callback){
        this.connection.query('UPDATE users SET '+attribute+'='+value+' WHERE id='+id,
            function(err, rows, fields) {
                if(err)
                {
                    console.log(err);
                    callback(false);
                }
                else
                    callback(true);
            }
        );
    };

    this.close = function()
    {
        this.db.closeConnection();
    }
}
// export the class
module.exports = Service;