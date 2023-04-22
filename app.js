//jshint esversion:6

const express = require('express');
const bp = require('body-parser');
const dat = require(__dirname + "/date.js");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false)
const _ = require('lodash');
const { request } = require('express');

console.log(dat.fullday());

const app = express();
app.use(bp.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"))

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itmschema = {
    name: String
};

const item = mongoose.model("item",itmschema);

const itm1 = new item({
    name: "welcome to todo list"
})
const itm2 = new item({
    name: "hit this + too add a new iteam"
})

const itm3 = new item({
    name: "<-- hit this to remove a iteam"
})

const defaulitms = [itm1,itm2,itm3];

const listschema = {
    name:String,
    items: [itmschema]
}

const List = mongoose.model("list",listschema);





app.get("/" , function(req,res){


    
  
    item.find({}).then((founditms)=>{
        if(founditms.length === 0){
            item.insertMany(defaulitms).then((err)=>{
                console.log("defaults added");
            })
            res.redirect("/");
        }
        else
        res.render("list",{kindofday: "today", itms : founditms})
    })

    // res.render("list.ejs",{kindofday:d, itms: newiteams});
    // // console.log(newiteams);
})


app.get("/:para" , function(req,res){
    let request =  _.lowerCase(req.params.para);

    List.findOne({name : request}).then((foundlists)=>{
        if(!foundlists){
            const list = new List({
                name : request,
                items : defaulitms
            });
            list.save();
            res.redirect("/" + request)
        }
        else{
            let d =dat.fullday();
            res.render("list" , {kindofday : foundlists.name, itms : foundlists.items})
        }
    })
});

app.get("/about",function(req,res){
    res.render("about")
})

app.post("/",function(req,res){
    const itmname = req.body.addnew;

    var newitm = item({
        name : itmname
    })

    newitm.save();
    res.redirect("/");
});


app.post("/delete",function(req,res){
    const checked = req.body.chbx;
    const lname = req.body.listname;
    console.log(lname);
    if(lname === "today"){
        item.findByIdAndRemove(checked).then((err)=>{
            console.log("removed checked items");
        })
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name : lname} , {$pull : {items:{_id:checked}}}).then((foundlist)=>{
            res.redirect("/" + lname);
        })
    }
    
})








app.listen(3000 , function(){
    console.log("saerver is running on prot 3000");
})