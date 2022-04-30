const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;  
const dbUrl = `mongodb+srv://admin:admin@pranit7.yhko9.mongodb.net/test`;
module.exports = { dbUrl, mongodb, MongoClient };
