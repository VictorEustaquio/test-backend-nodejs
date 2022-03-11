
const { mongodb, debug} = require("./dotenv");
const mongoose = require('mongoose');

const useMongoDb = () => {
    mongoose.set('debug', debug.mongoose)
    mongoose.Promise = global.Promise
    mongoose.connect(mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.connection.on('connected', () =>  console.log(`|🚀 Mongoose\n|   |_connected`))
    mongoose.connection.on('disconnected', () =>  console.log(`|🚀 Mongoose\n|   disconnected`))
    mongoose.connection.on('error', e => console.log(`|🚀 Mongoose\n   connection error: ${e}`))
    process.on('SIGINT', () => mongoose.connection.close(() => process.exit(0) ))
    return mongoose
}

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
    Mongodb: mongodb ? useMongoDb() : null,
    User: mongodb ? require('../app/models/mongoose/User'): null,
    Token: mongodb ? require('../app/models/mongoose/Token'): null,
    Product: mongodb ? require('../app/models/mongoose/Product'): null,
    Category: mongodb ? require('../app/models/mongoose/Category'): null,
    isValidId
}