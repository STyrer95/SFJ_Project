// Requirements
const { MongoClient } = require("mongodb");

// DB URI from config.env
const Db = process.env.DB_URI

// Setup mongo client pre-connection
const client = new MongoClient(Db, 
{
    serverSelectionTimeoutMS: process.env.CONNECTION_TIMEOUT,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// DB object can be called across app
var _db; 

// Public functions for database connection
module.exports = 
{
    // Function to connect to server
    connectToServer: function(callback){
        client.connect().then(
          
          connection => {
            _db = connection.db("sfj-db");
            console.log("Successfully connected to MongoDB.")
          },
          err => {
            return callback(err);
          }
        )
    },

    // Function getting currently connected db information
    getDb: function()
    {
        return _db;
    }
}