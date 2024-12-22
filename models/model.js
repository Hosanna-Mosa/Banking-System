const moongoose = require("mongoose");

main()
.then( () =>{
    console.log("Connection Success Guru...");
    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const bankSchema = new moongoose.Schema({
  Name : {
    type : String,
    required : true
  },
  Email : {
    type : String,
    required : true
  },
  PhoneNumber : {
    type : Number,
    required : true
  },
  Password : {
    type : String,
    required : true
  },
  Acc : {
    type : String,
    required : true
  },
  Img : {
    type : String,
    required : true
  },
  Balance : {
    type : Number,
    default : 0
  }
});

const bankModel = moongoose.model("BankMdel",bankSchema);

module.exports = bankModel;