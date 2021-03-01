const express=require('express');
const http=require('http');
const app=express();

// const port=8000;
// app.listen(port,()=>{
//     console.log(`server running on port ${port}`)
// })

http.createServer(async(req,res)=>{
    const output=await getResponse();
    sleep(1000);
    res.writeHead(200,{ 'Content-Type': 'application/json' });
    res.write(JSON.stringify(output));
    res.end(output);
}).listen((5000),()=>console.log(`server started running on port 5000`));

const sleep=(sleepTime)=>{
    const date=Date.now();
while(true){
    if(Date.now()-date > sleepTime) break;
}
}

const getResponse=async ()=>{
  return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            return resolve('response from server')
        },10)
    })
}