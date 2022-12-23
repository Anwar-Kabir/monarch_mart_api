const router = require("express").Router();
const ProductModel = require("./../models/product_model");
const productStyleModel = require("./../models/product_style_model")

//fetch all product 
router.get("/", async function(req, res){
    await ProductModel.find().populate('category styles').exec(function(err, product){
        if(err){
            res.json({sucess: false, error: err});
            return;
        }

        res.json({success: true, data: product});
    });
});


//===> fetch product by id //jwt commit out
router.get("/:productid", async function(req, res){
    const productid =  req.params.productid;
    const foundProduct = await ProductModel.findOne({productid: productid});
    if(!foundProduct){
        res.json({success : false, error: "product-not-found"});
        return;
    }

    res.json({success:true, data: foundProduct});
});

/* //create product ===> without ref_id (product_style_model)
router.post("/", async function(req, res){
    const productData = req.body;
    const newProduct = new ProductModel(productData);
    await newProduct.save(function(err){
        if(err){
            res.json({success: false, error: err});
            return;
        }
        res.json({success:true, data:newProduct});
    });
}); */ 



router.post("/", async function(req, res) {
    const productData = req.body;

    const styleids = [];
    productData.styles.forEach(async function(style) {
        const newStyle = new productStyleModel(style);
        styleids.push(newStyle._id);
        await newStyle.save(function(err) {
            if(err) {
                res.json({ success: false, error: err });
                return;
            }
        });
    });

    productData.styles = styleids;  

    const newProduct = new ProductModel(productData);
    await newProduct.save(function(err) {
        if(err) {
            res.json({ success: false, error: err });
            return;
        }

        res.json({ success: true, data: newProduct });
    });
});


//delete product
router.delete("/", async function(req, res){
    const productid = req.body.productid;
    const result  = await ProductModel.findOneAndDelete({productid:productid});
    if(!result){
        res.json({success:false, error: "product-not-found"});
        return;
    }

    res.json({success:true, data: result});

});

//updated product
router.put("/", async function(req, res){
    const productdata = req.body;
    const productid = productdata.productid;

    const result = await ProductModel.findOneAndUpdate({poductid: productid},
        
        productdata);

        if(!result){
            res.json({success: false, error:"product-not-found"});
            return;

        }

        res.json({success:true, data: productdata});
});

module.exports = router;