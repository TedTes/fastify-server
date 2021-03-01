require('dotenv').config();
const mongoose  = require("mongoose");
const { Schema,model,connect } = mongoose;



const articleSchema = new Schema({
  title: String,
  author: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

model('Article', articleSchema);

function connectTodb(){
    connect(process.env.MONGO_URL,{useUnifiedTopology:true,useNewUrlParser:true})
    .then(()=>console.log("database connected"));
}


module.exports={connectTodb}

