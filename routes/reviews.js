const express = require("express");
const router = express.Router({mergeParams : true});
const Wrap = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isReviewOwner} = require("../middleware.js");
const reviewController = require("../controller/review.js");
const validateReview = (req,res,next)=>{
    console.log("REVIEW BODY:", req.body);
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error.message);
    }else{
        next();
    }
};

//Review 
router.post("/",validateReview,isLoggedin,Wrap(reviewController.createReview));

//Review-Delete
router.delete("/:reviewId",isLoggedin,isReviewOwner,Wrap(reviewController.destroyReview));

module.exports = router;