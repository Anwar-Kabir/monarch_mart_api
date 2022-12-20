const {Schema, model} = require("mongoose");

const productStyleSchema = new Schema ({
    styleid: {type: String, required: true, unique: true},
    title:{type: String, required: true},
    price:{type: String, required: true},
    images:{type: String, required: true}
});

const productStyleModel = model("productStyle", productStyleSchema)

module.exports = productStyleModel;