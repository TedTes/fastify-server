
const os = require("os");
const cluster = require("cluster");
const redis=require('redis');
const fastifyStatic=require('fastify-static');
const path=require('path');

const {connectTodb}=require('./db.js')

const fastify = require('fastify')({
    logger: false,
    disableRequestLogging: true
});

require('./redis.js');

(function(){
    connectTodb();
})();

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public'
  })
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    try {
      var json = JSON.parse(body)
      done(null, json)
    } catch (err) {
      err.statusCode = 400
      done(err, undefined)
    }
  })
const clusterWorkerSize = os.cpus().length;

fastify.listen(3000,()=>{
    console.log("server started listening on port 3000")
});

const start = async () => {
    try {
        await fastify.listen(3000);
        console.log("sever running");
        // console.log(`server listening on ${fastify.server.address().port} and worker ${process.pid}`);
        // return fastify;
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

// Declare a route
fastify.get('/', async (req, reply) => {
    const sess = req.session;
    if (sess!==undefined && sess.username && sess.password) {
            if (sess.username) {
                reply.write(`<h1>Welcome ${sess.username} </h1><br>`)
                reply.write(
                    `<h3>This is the Home page</h3>`
                );
                reply.end('<a href=' + '/logout' + '>Click here to log out</a >')
            }
        } else {
            reply.sendFile("/login.html")
        }

})
fastify.post("/login", (req, reply) => {
  
    const sess = req.session;
    const { username, password } = req.body;
    req.session.username=username;
    req.session.password=password;
});
fastify.get("/logout", (req, reply) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        reply.redirect("/")
    });
});

if (clusterWorkerSize > 1) {
    if (cluster.isMaster) {
        for (let i=0; i < clusterWorkerSize; i++) {
            cluster.fork();
        }

        cluster.on("exit", function(worker) {
            console.log("Worker", worker.id, " has exited.")
        })
    } else {
        start();
    }
} else {
    start();
}

// if (cluster.isWorker) {
//     setTimeout(() => {
//         process.exit(1) 
//     }, Math.random() * 100000);
// }

cluster.on("exit", function(worker, code, signal) {
    console.log("Worker", worker.id, "has exited with signal", signal);
    if (code !== 0 && !worker.exitedAfterDisconnect) {
        cluster.fork();
    }
});
require('./routes.js')(fastify);
require('./Session.js')(fastify);