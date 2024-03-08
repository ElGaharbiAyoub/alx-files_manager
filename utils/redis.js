/* eslint-disable no-new */
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.error('Redis Error:', error);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async set(key, value, duration) {
    new Promise((resolve, reject) => {
      this.client.set(key, value, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
      this.client.expire(key, duration);
    });
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }

  async del(key) {
    new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }
}

const redisClient = new RedisClient();
export default redisClient;
