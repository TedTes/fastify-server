const express=require('express');
const http=require('http');
const app=express();
const path=require('path');
const {connectTodb}=require('./db.js')


app.use(express.json());
app.use(express.static("public"));
require('./Session.js')(app); 
require('./redis.js');

(function(){
    connectTodb();
})();

app.get('/', async (req, res) => {
    const sess = req.session;

    console.log(sess.username);
    console.log(sess.password);
    
    if (sess.username && sess.password) {
           
                res.write(`<h1>Welcome ${sess.username} </h1><br>`)
                res.write(
                    `<h3>This is the Home page</h3>`
                );
                res.end('<a href=' + '/logout' + '>Click here to log out</a >')
       
        } else {
            res.sendFile(path.join(__dirname,"./public","/login.html"));
        }

});
app.post("/login", (req, res) => {
const { username, password } = req.body;
req.session.username=username;
req.session.password=password;
    // add username and password validation logic here if you want.If user is authenticated send the response as success
res.redirect("/");
});
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect("/")
    });
});
const port=8000;
app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})

require('./routes.js')(app);

// http.createServer(async(req,res)=>{
//     const output=await getResponse();
//     sleep(1000);
//     res.writeHead(200,{ 'Content-Type': 'application/json' });
//     res.write(JSON.stringify(output));
//     res.end(output);
// }).listen((5000),()=>console.log(`server started running on port 5000`));

// const sleep=(sleepTime)=>{
//     const date=Date.now();
// while(true){
//     if(Date.now()-date > sleepTime) break;
// }
// }

// const getResponse=async ()=>{
//   return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             return resolve('response from server')
//         },10)
//     })
// }