require('dotenv').config();
const redis=require('redis');
// const fastifySession=require('fastify-session');
const expressSession=require('express-session');
const RedisStore=require('connect-redis')(expressSession);
const redisClient = redis.createClient();
// const fastifyCookie=require('fastify-cookie');
// const {RedisStore} = require('fastify-redis-session');
// const Redis=require('ioredis');
// const {client}=require('./redis.js');

module.exports=async (app)=>{
    

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});
const sessionOptions = {
    secret: 'thisissecret',
    store: new RedisStore({host: 'localhost',port: 6379,client: redisClient, ttl: 600 }),
    resave:false,
    saveUninitialized: true,
    }
   
// Configure session middleware
app.use(expressSession(sessionOptions));
// fastify.register(fastifyCookie);

// fastify.register(fastifySession,sessionOptions)

}



// resave: false,
// saveUninitialized: false,
// cookie: {
//     secure: false, // if true only transmit cookie over https
//     httpOnly: false, // if true prevent client side JS from reading the cookie 
//     maxAge: 1000 * 60 * 10 // session max age in miliseconds
// }