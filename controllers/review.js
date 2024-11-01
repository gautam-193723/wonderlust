const Review=require("../model/review.js")
const Listing=require("../model/listing.js")

module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newR = new Review(req.body.review)
    newR.author=req.user._id;
    console.log(newR)
    listing.reviews.push(newR)
    await newR.save();
    await listing.save();
    req.flash("success","Review Created !")
    res.redirect(`/listings/${listing._id}`)

}

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;

    let leRe = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    console.log(leRe)
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted !")
    res.redirect(`/listings/${id}`)
}