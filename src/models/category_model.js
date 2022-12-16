const {Schema, model} = require("mongoose");

const categoryScheme = new Schema ({
categoryid : {type: String, required:true, unique: true},
title: {type: String, required: true},
 
addedon:{type: Date, default: Date.now}
});

const categoryModel = model("Category", categoryScheme);

module.exports = categoryModel;