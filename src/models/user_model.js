
const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    userid: {type: String, unique: true},
    fullname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone:{type: String,  unique: true},
    gender:{type:String, default:""},
    address: {type: String, default:""},
    country:{type: String, default:""},
    city:{type: String, default:""},
    pincode: {type: String, default:"" },
    token: { type: String, default: "" },
    addedon: {type: Date, default: Date.now},

});

const userModel = model("User", userSchema);
module.exports = userModel;