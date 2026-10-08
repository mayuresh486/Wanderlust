const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    if (!listing.reviews) {
        listing.reviews = [];
    }
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    req.flash("success","Review added!");
    res.redirect(`/listing/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review deleted!");
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
};