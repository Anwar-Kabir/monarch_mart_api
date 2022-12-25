const {Schema, model} = require("mongoose");

const productSchema = new Schema({
    productid: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    category: {type: Schema.Types.ObjectId, ref: "Category"},
    description: {type:String, default: "" },
    price: {type:String, require: true},
    thumimage: {type:String, require: true},
    rating: {type:String, require: true},
    stock: {type:String, require: true},
    discount: {type:String, require: true},
    styles: {type: [{type: Schema.Types.ObjectId, ref: "ProductStyle"}], default :[]},
    /* styles: { type: Array, default :[]},
    price: {type:Number, required:true},
    images:{type: Array, default:[]}, */
    addedon: {type: Date, default:Date.now}  

});

const productModel = model("Product", productSchema);

module.exports = productModel;   