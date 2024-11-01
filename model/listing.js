const mongoose = require('mongoose');
const Review = require('./review.js');
const User=require("./user.js");
const { number } = require('joi');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url:String,
        filename:String,
    },
    price:{
        type:Number,
        required:true
    } ,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:["Mountains","Farms","Arctic","Swimming Pool","Rooms","Iconic City","Trending","Camping","Boat","Castles"],
    },
    geometry:{
        type:{
            lat:Number,
            lng:Number
        },
        require:true,
    }

})

listingSchema.post('findOneAndDelete', async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})   
    }
})
const Listing = mongoose.model('Listing', listingSchema)
module.exports = Listing;