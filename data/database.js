/**
 * Created by Ahmed on 3/4/2016.
 */
var mysql = require('mysql');

var DB = function()
{
    this.connection;
    this.getConnection =  function()
    {
        if (this.connection !== undefined) {
            return this.connection;
        }
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'roxas',
            database: 'chat'
        });
        connection.connect();
        this.connection = connection;
        return this.connection;
    }
    this.closeConnection = function()
    {
        this.connection.end();
    }
}
module.exports = DB;