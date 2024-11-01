const express = require('express')
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js")
const {isloggendIn, isowner,validatelisting}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const Listing = require('../model/listing.js');
const upload = multer({ storage })

//index route //create route
router
.route("/")
.get( wrapasync(listingController.index))
.post(
    isloggendIn,
    upload.single('Listing[image]'),
    validatelisting,
    wrapasync(listingController.createlisting)
);   

//new route
router.get('/new', isloggendIn, wrapasync(listingController.newlisting))

router.get("/search/",listingController.serch)


//show route //update route //delete route
router
.route("/:id")
.get( wrapasync(listingController.showlisting))
.put( isloggendIn, isowner,upload.single('Listing[image]'),validatelisting,
    wrapasync ( listingController.updatelisting))
.delete( isloggendIn,isowner,
    wrapasync(listingController.deletelisting)) 


router.get("/filter/:filters",listingController.filters)

//edit route
router.get('/:id/edit',isloggendIn,isowner,
      wrapasync (listingController.editlisting))




module.exports=router;