/**
 * Created by Ahmed on 3/4/2016.
 */
var mysql = require('mysql');
//some comment
var DB = function()
{
    this.connection;
    this.getConnection =  function()
    {
        if (this.connection !== undefined) {
            return this.connection;
        }
        var connection = mysql.createConnection({
            host     : process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
            user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
            password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'roxas',
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
