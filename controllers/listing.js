const Listing=require("../model/listing.js");
const review = require("../model/review.js");
const opencage = require('opencage-api-client');



module.exports.index=(async (req, res) => {
    const allListing = await Listing.find({})
    res.render('./listings/index.ejs', { allListing });
})


module.exports.newlisting=async (req, res) => {
    res.render('./listings/new.ejs')
}

module.exports.showlisting=async (req, res) => {
        let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:'reviews',
        populate:{
            path:"author",
        }
    })
    .populate("owner");
    if(!listing){
    req.flash("error"," Listing are yoy requested is does not exit !")
    res.redirect("/listings")
    }
    console.log(listing);
    res.render('./listings/show.ejs', { listing })
}

module.exports.updatelisting=async(req,res)=>{
    let {id}=req.params;
    let newlisting= await Listing.findByIdAndUpdate(id, {...req.body.Listing});
    if(typeof req.file !="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    newlisting.image={url,filename}
    await newlisting.save();    
    }
    req.flash("success"," Listing Updated !")
    res.redirect(`/listings/${id}`)
}

module.exports.editlisting= async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing){
        req.flash("error"," Listing are yoy requested is does not exit !")
        res.redirect("/listings")
        }
    let originalurl=listing.image.url;
    originalurl = originalurl.replace("/upload","/upload/h_300,w_250") 
    res.render('./listings/Edit.ejs',{listing,originalurl})
    }

module.exports.createlisting=async (req, res, next) => {
    let respone=await opencage
    .geocode({ q: req.body.Listing.location, key:process.env.API_KEY });
    console.log(respone.results[0].geometry);
    let url=req.file.path;
    let filename=req.file.filename;
    
    const newlisting = new Listing(req.body.Listing)
    
    newlisting.image={url,filename};
    newlisting.owner=req.user._id;
    newlisting.geometry=respone.results[0].geometry;
    let savL=await newlisting.save();
    console.log(savL);
    req.flash("success","New Listing Created !")
    res.redirect('listings')
}

module.exports.deletelisting=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted !")
    res.redirect('/listings')
}

module.exports.filters=async(req,res)=>{
    // console.dir(req.params)
    let filter=req.params;
    // console.log(filter.filters)
    let nfilter=filter.filters;
    let allListing= await Listing.find({category:nfilter})
    if(nfilter === "Trending"){
        return res.redirect("/listings")
    }
    else if(allListing.length <= 0){
        req.flash("error","This filter you will apply that type listing are not avelable");
        return res.redirect("/listings")
    }
    res.render('./listings/index.ejs', { allListing });
}

module.exports.serch=async(req,res)=>{
 let country=req.query.country;
 if(!country){
    return res.redirect("/listings")
 }
 let allListing= await Listing.find({country:country});
 if(allListing.length <= 0){
    req.flash("error","This Country you will be search is not available of Country name is not valided");
    return res.redirect("/listings")
 }
 res.render('./listings/index.ejs', { allListing });
}