if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const port = process.env.PORT || 3030;
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const Wrap = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listing = require("./routes/listing.js");
const review = require("./routes/reviews.js");
const user = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const MongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASTDB_URL;
const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOption = ({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
});
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));



main()
.then(()=>{
    console.log("connection succesful");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dburl);
}
// app.get("/",(req,res)=>{
//     res.send("Root is working");
// })

//flash
app.use(session(sessionOption));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.errors = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//Express Route
app.use("/listing",listing);
app.use("/listing/:id/review",review);
app.use("/",user);

app.get("/listing",(req,res)=>{
    res.redirect("/listing");
})
app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"} = err;
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
})
app.listen(port,()=>{
    console.log(`app is listening to ${port}`);
})