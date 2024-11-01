const User=require("../model/user.js")

module.exports.rendersignupform=(req,res)=>{
    res.render("./users/signup.ejs")
}

module.exports.signup= async (req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        let newuser=new User({
            email,
            username,
        })
        const registeruser=await User.register(newuser,password);
        console.log(registeruser);
        req.login(registeruser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to InnVantage");
            res.redirect("/listings")
        })
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }

}

module.exports.renderloginform=(req,res)=>{
    res.render("./users/login.ejs")

}

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome back to InnVantage")
    const redirectUrl= res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout=(req,res,next)=>{
    //logout is callback function to take argument to what od next
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
}