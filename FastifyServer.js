
const os = require("os");
const cluster = require("cluster");
const redis=require('redis');
const {connectTodb}=require('./db.js')


require('./redis.js');
require('./routes.js');

const fastify = require('fastify')({
    logger: false,
    disableRequestLogging: true
});
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    try {
      var json = JSON.parse(body)
      console.log(json);
      done(null, json)
    } catch (err) {
      err.statusCode = 400
      done(err, undefined)
    }
  })
const clusterWorkerSize = os.cpus().length;
(function(){
    connectTodb();
})();
// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000);
        console.log(`server listening on ${fastify.server.address().port} and worker ${process.pid}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

  require('./routes.js')(fastify);
// Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'well come to fastify server' };
})


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

// Simulate crash
if (cluster.isWorker) {
    // setTimeout(() => {
    //     process.exit(1) // death by random timeout
    // }, Math.random() * 100000);
}


// Add this to the callback
cluster.on("exit", function(worker, code, signal) {
    console.log("Worker", worker.id, "has exited with signal", signal);
    if (code !== 0 && !worker.exitedAfterDisconnect) {
        cluster.fork();
    }
});


