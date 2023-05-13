const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');



const schDetail=[{id:1,name:"Mr. Manohar Sai Burra",yeari:"2022",yearf:"present"},{id:2,name:"Mr. Junaid Alam",yeari:"2022",yearf:"present"},{id:3,name:"Ms. Abha Upadhayay",yeari:"2022",yearf:"present"}];

const mtechDetail=[{id:1,name:"Mr. Binay Kumar Gupta",yeari:"2022",yearf:"ongoing",researchArea:"cyrptography"},{id:2,name:"Mr. Shiv Shankar",yeari:"2022",yearf:"ongoing",researchArea:"Network Security"},
{id:3,name:"Mr. Arghya Maji",yeari:"2022",yearf:"ongoing",researchArea:"Cryptography"},{id:4,name:"Mr. Arnab Majumder",yeari:"2022",yearf:"ongoing",researchArea:"Blockchain Technology"}];

const btechDetail=[{id:1,name:"RAUNAK SINGH RATHORE",yeari:"2019",yearf:"23",projectTitle:"Networking"},
{id:2,name:"MRITYUNJAY TIWARI",yeari:"2019",yearf:"23",projectTitle:"Networking"},
{id:3,name:"KODI PRAVALLIKA",yeari:"2019",yearf:"23",projectTitle:"Networking"},
{id:4,name:"KRISHNA KOUNDINYA KAIPA",yeari:"2019",yearf:"23",projectTitle:"License conflicts in Secure Software Ecosystems"},
{id:5,name:"MAITRY JADIYA",yeari:"2019",yearf:"23",projectTitle:"License conflicts in Secure Software Ecosystems"},
{id:6,name:"PRITIK SHRIVASTAVA",yeari:"2019",yearf:"23",projectTitle:"License conflicts in Secure Software Ecosystems"},
{id:7,name:"AKSHAY ANSHUL",yeari:"2019",yearf:"23",projectTitle:"License conflicts in Secure Software Ecosystems"}];

mongoose.connect('mongodb+srv://fogcpslab:fogcps123@cluster0.wbrv5as.mongodb.net/schDB');
// mongoose.connect("mongodb://127.0.0.1:27017/schDB");
 

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("./"));
app.use(session({
    secret:"our little secret.",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


const schSchema=new mongoose.Schema({

    id:Number,
    name:String,
    yeari:String,
    yearf:String

})
const mtechSchema=new mongoose.Schema({

    id:Number,
    name:String,
    yeari:String,
    yearf:String,
    researchArea:String

});
const btechSchema=new mongoose.Schema({

    id:Number,
    name:String,
    yeari:String,
    yearf:String,
    projectTitle:String

});

const newSchema= new mongoose.Schema({
    title:String,
    content:String
})

const eventSchema= new mongoose.Schema({
    title:String,
    startDate:String,
    endDate:String,
    content:String
})

// userSchema
const userSchema=new mongoose.Schema({
    email:String,
    Password:String
});

userSchema.plugin(passportLocalMongoose);
const User= mongoose.model("User",userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

User.find().then((user)=>{

    if(user.length===0)
    {
        User.register({username:"fogcpslabserver@gmail.com"},'fogcps123',function(err,user){
            if(err)
            {
                console.log(err);
                // res.redirect("/register");
            }
            else{
                passport.authenticate("local")(function(){
                    // res.redirect("/secrets");
                })
            }
            
        })
    }
})




const Scholar=mongoose.model('Scholar',schSchema);
const Mtech=mongoose.model('Mtech',mtechSchema);
const Btech=mongoose.model('Btech',btechSchema);

// news
const New=mongoose.model('Rnew',newSchema);

// event
const Event=mongoose.model('Event',eventSchema);




app.get("/sidebar",async function(req,res)
{
    let recentnews=await New.find();
    let recentevents=await Event.find();

    res.render("sidebar",{news:recentnews,events:recentevents});
})

app.post("/deleteScholar",function(req,res){

    const rid=req.body.scholarId;
    console.log(rid);
   Scholar.deleteOne({_id:rid}).then(function(){
    console.log("deleted");
   });
    res.redirect('/adminhome');
})
app.post("/deleteMtech",function(req,res){

    const rid=req.body.mtechId;
    console.log(rid);
   Mtech.deleteOne({_id:rid}).then(function(){
    console.log("deleted");
   });
    res.redirect('/adminhome');
})
app.post("/deleteBtech",function(req,res){

    const rid=req.body.btechId;
    console.log(rid);
   Btech.deleteOne({_id:rid}).then(function(){
    console.log("deleted");
   });
    res.redirect('/adminhome');
})

app.post("/deletenews",function(req,res){
    const rid=req.body.newsId;
    console.log(rid);
   New.deleteOne({_id:rid}).then(function(){
    console.log("deleted");
   });
    res.redirect('/adminhome');
})

app.post("/deleteevents",function(req,res){
    const rid=req.body.eventId;
    console.log(rid);
   Event.deleteOne({_id:rid}).then(function(){
    console.log("deleted");
   });
    res.redirect('/adminhome');
})
app.get("/adminlogin",function(req,res){

     res.render("adminlogin");
})
app.post('/adminlogin',function(req,res){

    const username=req.body.username;
    const password=req.body.password;

     const user=new User({
        username:username,
        Password:password
     });

    req.login(user,function(err){
        if(err)
        {
            console.log(err);

        }
        else
        {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/adminhome");
            })
        }
    })
})

app.get("/adminhome",async function(req,res){
    if(req.isAuthenticated())
    {

        let recentnews=await New.find();
        let recentevents=await Event.find();
        // const st=[];
        let sch= await Scholar.find().sort({id:1});
        let mtech=await Mtech.find().sort({id:1});
        let btech=await Btech.find().sort({id:1});
    
        if(sch.length===0)
        {
            

            Scholar.insertMany(schDetail);
            Mtech.insertMany(mtechDetail);
            Btech.insertMany(btechDetail);
             sch= await Scholar.find();
             console.log(sch);
             mtech=await Mtech.find();
             btech=await Btech.find();
        }
     
            res.render("adminstudentdelete",{schdt:sch,mtechdt:mtech,btechdt:btech,news:recentnews,events:recentevents});

        // res.render("adminhome");
    }
    else
    res.redirect("/adminlogin");
    
})


app.get("/adminstudent", function(req,res){
    // let recentnews=await New.find();
    if(req.isAuthenticated())
    {
        res.render("adminstudent");
    }
    else
    res.redirect("/adminlogin");
    
})

app.get("/admin-news-compose", function(req,res){
    // let recentnews=await New.find();
    
    if(req.isAuthenticated())
    {
        res.render("admin-news-compose");
    }
    else
    res.redirect("/adminlogin");
   
})

app.get("/admin-events", function(req,res){
    // let recentnews=await New.find();
    if(req.isAuthenticated())
    {
        res.render("admin-events");
    }
    else
    res.redirect("/adminlogin");
    
    //,{news:recentnews}
})


app.post("/admin-news-compose",async function(req,res){
    if(req.isAuthenticated())
    {
            let recentnews=await New.find();
            const newArticle=new New({
                
                title:req.body.postTitle,
                content:req.body.postBody
            })
            newArticle.save();
            New.find().then(function(x)
            {
                recentnews=x;
            })
            res.redirect("/admin-news-compose");
    }
    else
    res.redirect("/adminlogin");
    
})
app.post("/admin-events",async function(req,res){

    if(req.isAuthenticated())
    {
        let recentevent=await Event.find();
        const newEvent=new Event({
            
            title:req.body.postTitle,
            startDate:req.body.postStart,
            endDate:req.body.postEnd,
            content:req.body.postBody
        })
        newEvent.save();
        // Event.find().then(function(x)
        // {
        //     recentEvent=x;
        // })
        res.redirect("/admin-events");
    }
    else
    res.redirect("/adminlogin");
    
})



app.get("/scholar",async function(req,res){
    let recentnews=await New.find();
    let recentevents=await Event.find();
    res.render("scholars",{news:recentnews,events:recentevents});
    
})

app.get("/oppor_faculty",async function(req,res){
    let recentnews=await New.find();
    let recentevents=await Event.find();
    res.render("oppor_faculty",{news:recentnews,events:recentevents});
    
})
app.get("/faculty",async function(req,res){
    let recentnews=await New.find();
    res.render("faculty");
})

app.get("/research",async function(req,res){
    let recentnews=await New.find();
    let recentevents=await Event.find();
    res.render("research",{news:recentnews,events:recentevents});
    
})

app.get("/equipment",async function(req,res){
    let recentnews=await New.find();
    let recentevents=await Event.find();
    res.render("equipment",{news:recentnews,events:recentevents});
    
})
// const path = require('path');


app.get('/',async function(req,res){
    let recentnews=await New.find();
    let recentevents=await Event.find();
        res.render("index",{news:recentnews,events:recentevents});

})
app.get('/student',async function(req,res){
    let recentnews=await New.find();
    let recentevents=await Event.find();
    // const st=[];
    let sch= await Scholar.find().sort({id:1});
    let mtech=await Mtech.find().sort({id:1});
    let btech=await Btech.find().sort({id:1});

    if(sch.length===0)
    {
        Scholar.insertMany(schDetail);
        Mtech.insertMany(mtechDetail);
        Btech.insertMany(btechDetail);
         sch= await Scholar.find();
         console.log(sch);
         mtech=await Mtech.find();
         btech=await Btech.find();
    }
 
        res.render("student",{schdt:sch,mtechdt:mtech,btechdt:btech,news:recentnews,events:recentevents});
    // res.render("student",{schdt:sch,mtechdt:mtech,btechdt:btech});

    
    

});

app.get("/internship",async function(req,res){
    let recentnews=await New.find();
    let recentevents=await Event.find();
    res.render("internship",{news:recentnews,events:recentevents});
    
})
// adding scholar
app.post('/addsch',function(req,res){
    
    // console.log(req.body.id);
    // console.log(req.body.name);
  const newSch=new Scholar({
   
    id:req.body.id,
    name:req.body.name,
    yeari:req.body.from,
    yearf:req.body.to
  })

  newSch.save();
  res.redirect('/student');
});

// deleting scholar
app.post('/delsch',function(req,res){
    const rid=req.body.id;
   Scholar.deleteMany({id:rid}).then(function(){
    console.log("deleted");
   });
    res.redirect('/student');
});


// adding mtech
app.post('/addmtech',function(req,res){
    
    // console.log(req.body.id);
    // console.log(req.body.name);
  const newmtech=new Mtech({
   
    id:req.body.id,
    name:req.body.name,
    yeari:req.body.from,
    yearf:req.body.to,
    researchArea:req.body.ra

  })

  newmtech.save();
  res.redirect('/student');
});

//deleting mtech

app.post('/delmtech',function(req,res){
    const rid=req.body.id;
   Mtech.deleteMany({id:rid}).then(function(){
    console.log("deleted");
   });
    res.redirect('/student');
});

// adding btech
app.post('/addbtech',function(req,res){
    
    // console.log(req.body.id);
    // console.log(req.body.name);
  const newbtech=new Btech({
   
    id:req.body.id,
    name:req.body.name,
    yeari:req.body.from,
    yearf:req.body.to,
    projectTitle:req.body.pt

  })

  newbtech.save();
  res.redirect('/student');
});


// deleting btech
app.post('/delbtech',function(req,res){
    const rid=req.body.id;
   Btech.deleteMany({id:rid}).then(function(){
    console.log("deleted");
   });
    res.redirect('/student');
});


// news

app.get("/news/:nid",async function(req,res){
    let recentnews=await New.find();
    let recentevents=await Event.find();

    const rid=req.params.nid;
    
    New.findOne({_id:rid}).then((rnew)=>{

        // console.log(rnew);
        res.render('newsarticle',{article:rnew,news:recentnews,events:recentevents});
    })
})
// events
app.get("/events/:nid",async function(req,res){
    let recentnews=await New.find();
    let recentevents=await Event.find();
    const rid=req.params.nid;
    
    Event.findOne({_id:rid}).then((newEvent)=>{

        // console.log(rnew);
        res.render('events',{article:newEvent,news:recentnews,events:recentevents});
    })
})
app.get("/adminlogout",function(req,res){

    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    
});




app.listen(3000,function(req,res){
    console.log("server listening on port 3000");
});
