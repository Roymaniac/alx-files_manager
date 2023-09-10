import redis from 'redis';
import { promisify } from 'util';

// 
class RedisClient {
    constructor(){
        this.client = redis.createClient();
        this.getAsync = promisify(this.client.get).bind(this.client);

        this.client.on('error', (error) => {
            console.log(`Redis client failed to connect to the server: ${error.message}`);
        })

        this.client.on('connect', () => {
            console.log('Redis client connected');
        });
    }

    isAlive(){
        return this.client.connected;
    }

    async get(key) {
        const value = await this.getAsync(key);
        return value;
    }

    async set(key, value, duration){
        await this.client.setex(key, duration, value);
    }

    async del(key){
        await this.client.del(key);
    }
}

const redisClient = new RedisClient();

export default redisClient;
