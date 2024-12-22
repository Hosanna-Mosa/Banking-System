const { log } = require("console");
const express = require("express");
const app = express();
const path = require("path");
const {v4: uuidv4} = require("uuid");
const mongoose = require("mongoose");
const methodOverride = require("method-override");


let port = 8080;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));

num = 18;

let balanceCheck = false;

main()
.then( () =>{
    console.log("Connection Success Guru...");
    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/BankSystem');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const bankSchema = new mongoose.Schema({
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
      type : String
    },
    Balance : {
      type : Number,
      default : 0
    }
  });

  //------------- MODEL------------------
const bankModel = mongoose.model("BankModel",bankSchema);



//----------------------------------- This API for Home Page ------------------------------------

app.get("/bank" , (req,res) =>{
    let {checkph,checkPass} = req.query;
    res.render("index",{
        checkph: checkph === "true",
        checkPass:checkPass === "true"
    });
});


app.post("/bank/info" ,async (req,res)=>{
    let ph = req.body.number;
    let newPh = Number(ph);
    let details = await bankModel.findOne({PhoneNumber : newPh});
    // let details = data.find(oldData => oldData.PhoneNumber === ph);
    if(details){
          if(details.Password === req.body.Password){
          res.render("info" , {
            details
          });
        }else{
            res.redirect(`/bank?checkph=${false}&checkPass=${true}`);
        }
    }else{
        res.redirect(`/bank?checkph=${true}&checkPass=${false}`);
    }
    
    
});


//----------------------------------- New Route ------------------------------------

app.get("/bank/createAccount" , (req,res) =>{
    console.log("Camed here !!!");
    
    res.render("createAcc");
});

app.post("/bank/newData" , (req,res) =>{
    
    let Name = req.body.Name;
    let Email = req.body.Email;
    let newPh = req.body.PhoneNumber;
    let Password = req.body.Password;
    let balance = 0;
    let AccNum = uuidv4();
    let img = req.body.img;
    let PhoneNumber = Number(newPh);

    let data1 = new bankModel({
        Name : Name,
        Email : Email,
        PhoneNumber : PhoneNumber,
        Password : Password,
        Acc : AccNum,
        Img : img,
    });
    
    data1.save();
    // data.push({Name,Email,PhoneNumber,Password,AccNum,balance,img});
    // console.log(data);
    

    // TO New Info Route
    res.redirect(`/bank/${PhoneNumber}`);
    

});

//----------------------------------- New Info Route ------------------------------------

app.get("/bank/:ph" ,async  (req,res)=>{
    let newPh = req.params.ph;
    
    let newphN = Number(newPh);
    
    let details = await bankModel.findOne({PhoneNumber : newphN});

    
    // let details = data.find((oldData) => {
    //     return oldData.PhoneNumber === newphN;
    // });
    res.render("info" , {
        details
    });
    
});

// ----------------------------- Credit Route -----------------------------------------------

app.get("/bank/:ph/credit" , async (req,res) =>{
  let ph = req.params.ph;
  
  let details = await bankModel.findOne({PhoneNumber : ph});
  
    res.render("detailForm.ejs" ,  {
        details
    });
});

app.put("/bank/:ph/credited" , async (req,res) =>{
  let ph = req.params.ph;
  let newAmount = req.body.Amount;
  let oldAmount;
  await bankModel.findOne({PhoneNumber : ph})
  .then(res =>{
    oldAmount = res.Balance;
  })
  .catch(err => {
    console.log(err);
  });
  let finalAm = oldAmount + Number(newAmount);
  await bankModel.findOneAndUpdate({PhoneNumber : ph}, {
    Balance : finalAm
  },{new:true});
    res.redirect(`/bank/${ph}`);
});


// ----------------------------- Debit Route -------------------------------------------------

app.get("/bank/:ph/debit" , async (req,res) =>{
  let ph = req.params.ph;
  
  let details = await bankModel.findOne({PhoneNumber : ph});
  
    res.render("debitForm.ejs" ,  {
        details
    });

});

app.put("/bank/:ph/debited" , async (req,res) =>{
  let ph = req.params.ph;
  let oldAmount;
  let newAmount = req.body.Amount;
  await bankModel.findOne({PhoneNumber : ph})
  .then(res =>{
    oldAmount = res.Balance;
  })
  .catch(err => {
    console.log(err);
  });
  let finalAm = oldAmount - newAmount;
  if (finalAm < 0) finalAm = 0 ;
  await bankModel.findOneAndUpdate({PhoneNumber : ph}, {
    Balance : finalAm
  },{new:true});
    
  res.redirect(`/bank/${ph}`);
});




// ----------------------------- Delete Route -------------------------------------------------

app.delete("/bank/:ph/delete" , async (req,res) =>{

  let ph = req.params.ph;

  let data = await bankModel.findOneAndDelete({PhoneNumber : ph});

  console.log(data);
  
  res.redirect("/bank");

});



app.listen(port,()=>{
    console.log(`The Sever ${port} Port is Working.....`);
});