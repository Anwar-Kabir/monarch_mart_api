const {Schema, model} = require("mongoose");

const productStyleSchema = new Schema ({
    styleid: {type: String, required: true,   }, 
    title:{type: String, required: true},
    price:{type: String, required: true},
    images:{type: Array, required: true, default:[]}
});

const productStyleModel = model("ProductStyle", productStyleSchema);

module.exports = productStyleModel; 