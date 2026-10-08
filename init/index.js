const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
main()
.then(()=>{
    console.log("connection succesful");
})
.catch((err)=>{
    console.log(err);
})
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initDb = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj, //Take all the existing properties of obj and copy them here.
        owner:'6ab3505e5d0cda8935851483'
    }));
    await Listing.insertMany(initData.data);
    console.log("data was saved");
}
initDb();
