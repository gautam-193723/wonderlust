if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const express=require('express');
const App=express();
const mongoose=require('mongoose');
const  path=require('path');
const methodOverride=require('method-override');
const ejsmate=require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User = require('./model/user.js');
const cors=require("cors")

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");



const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log('Connected to the Db')
}).catch(err=>{
    console.log(err)
})
async function main(){
   await mongoose.connect(dbUrl);
}

App.set('view engine','ejs')
App.set('views',path.join(__dirname,'views'))
App.use(express.urlencoded({extended:true}))
App.use(methodOverride("_method"))
App.engine('ejs',ejsmate);
App.use(express.static(path.join(__dirname,"/public")))


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGOOSE SESSION STORE", err)
})

const sessionoptions={
    store,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly:true,
    }
}

App.use(session(sessionoptions));
App.use(flash());

App.use(passport.initialize());
App.use(passport.session());
//use static authenticate method of model is LocalStrategy
//Generates the fuctions that use in passport's LocalStrtegy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());// Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser());//Generates a function that is used by Passport to deserialize users into the session


App.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.curruser=req.User;
    next();
})
// App.get("/",(req,res)=>{
//     res.send("Hi, Am root")
// })


App.use("/listings",listingRouter);
App.use("/listings/:id/review",reviewRouter);
App.use("/",userRouter);


App.all("*", (req,res,next)=>{
    next(new ExpressError(404,"page not found"))
} )

App.use((err,req,res,next)=>{ 
    let {status=500,message='something went to wrong'}=err;
    // res.status(status).send(message)
    res.status(status).render("error.ejs",{err})
})

App.listen(8080, ()=>{
    console.log('Server listeing at port 8080')
});
