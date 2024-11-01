const express = require('express')
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync.js")
const {validateReview, isloggendIn, isreviewathor}=require("../middleware.js")
const reviweController=require("../controllers/review.js")

//Add listing Review
//post route
router.post("/",
    isloggendIn,
     validateReview,
      wrapasync(reviweController.createReview))

//delele post route
router.delete("/:reviewId",
    isloggendIn,
    isreviewathor,
     wrapasync(reviweController.deleteReview))

module.exports=router;
