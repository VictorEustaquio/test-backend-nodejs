const dotenv = require('dotenv');
const path = require('path');
process.env.NODE_PATH = path.resolve(__dirname, '..', '..'); //Set on process.env.NODE_PATH the root project folder


dotenv.config({
  path: path.resolve(process.env.NODE_PATH, process.env.NODE_ENV + '.env'),
});

const sessionExpireIn = 60 * 60 * 1; /* 1 hora */

module.exports = {
  "node_env": process.env.NODE_ENV,
  "server_host": process.env.SERVER_HOST,
  "server_port": process.env.SERVER_PORT,
  "secret": process.env.SECRET,
  "expiresIn": `${sessionExpireIn}s`,
  "redis": {
    "host": process.env.REDIS_HOST,
    "port": process.env.REDIS_PORT,
    "db": process.env.REDIS_DB,
  },
  "mongodb": {
    "uri": process.env.MONGO_URI,
    "db_name": process.env.MONGO_DATABASE
  },
  "debug": {
    "mongoose": (process.env.MONGOOSE_DEBUG === "true" ? true : false),
    "log": (process.env.LOG === "true" ? true : false),
    "request_log": (process.env.REQUEST_LOG === "true" ? true : false)
  }
}