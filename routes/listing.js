const express = require("express");
const router = express.Router();
const Wrap = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isOwner} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// Joi
const validateListing = (req, res, next) => {
    console.log("REQ.BODY =", req.body);
    let { error } = listingSchema.validate(req.body);
    console.log("JOI ERROR =", error);
    if (error) {
        throw new ExpressError(400, error.message);
    }
    next();
};

router.route("/")
.get(Wrap(listingController.index))
.post(isLoggedin, upload.single("listing[image]"),validateListing,Wrap(listingController.createListing));

// New route
router.get("/new", isLoggedin, listingController.renderNewForm);

router.route("/:id")
.get(Wrap(listingController.showListing))
.put(isLoggedin,isOwner,upload.single("listing[image]"),validateListing,Wrap(listingController.updateListing))
.delete(isLoggedin, isOwner,Wrap(listingController.destroy));

// Edit route
router.get("/:id/edit", isLoggedin, isOwner,Wrap(listingController.editListing));

module.exports = router;