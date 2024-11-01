const Listing=require("./model/listing.js");
const Review=require("./model/review.js")
const ExpressError = require("./utils/ExpressError.js")
const { Listingschema,ReviewScheam} = require("./schema.js")
const { model } = require("mongoose");

module.exports.isloggendIn = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged to create listing");
        res.redirect("/login")
    }else{
        next();
    }
    
}

module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isowner= async (req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","you are not owner of this listing");
       return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validatelisting=(req,res,next)=>{
    let {error}= Listingschema.validate(req.body)
    if(error){
        let errmsg=error.details.map((el)=> el.message).join(',')
     throw new ExpressError(400,errmsg)
    } else{
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = ReviewScheam.validate(req.body)
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(',')
        throw new ExpressError(400, errmsg)
    } else {
        next()
    }
}

module.exports.isreviewathor= async (req,res,next)=>{
    let {id,reviewId}=req.params;
    console.log(reviewId);
    let review= await Review.findById(reviewId);

    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","you are not athor of this Review");
       return res.redirect(`/listings/${id}`)
    }
    next();
}