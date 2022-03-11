const env = require("./dotenv");
const redis = require("ioredis");
const retryStrategy = require("node-redis-retry-strategy");

const redisConfig = {
  host: env.redis.host,
  port: env.redis.port,
  db: env.redis.db,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,    //null will wait forever
  autoResubscribe: true,
  retryStrategy: retryStrategy({
    delay_of_retry_attempts: 60000,
    number_of_retry_attempts: Number.MAX_SAFE_INTEGER,
    wait_time: 100000
  })
}

const redisClient = new redis(redisConfig);

redisClient.on('connect', () => {
  console.log('🚀 Redis connection');
});

redisClient.on('ready', () => {
  console.log('   |_ ready ✔️');
});

redisClient.on('reconnecting', () => {
  console.log('Redis\n|_ reconnecting 🔁');
});

redisClient.on('error', (err) => {
  console.log('   |_ error ❌\n', err);
});

redisClient.on('end', () => {
  console.log('Redis\n|_ end connection 🏁');
});

module.exports = { redisConfig, redisClient };

