const router = require("express").Router();
const CategoryModel = require("./../models/category_model");

//fetch all categories
router.get("/", async function(req, res){
    await CategoryModel.find().exec(function(err, categories){
        if(err){
            res.json({success: false, error: err});
            return;
        }

        res.json({success: true, data: categories});
    });
});


//===> Get category by id,  
router.get("/:categoryid", async function(req, res){
    const categoryid =  req.params.categoryid;
    const foundCategories = await CategoryModel.findOne({categoryid: categoryid});
    if(!foundCategories){
        res.json({success : false, error: "category-not-found"});
        return;
    }

    res.json({success:true, data: foundCategories});
});

//create category
router.post("/", async function(req, res){
    const categoryData = req.body;
    const newCategory = new CategoryModel(categoryData);
    await newCategory.save(function(err){
        if(err){
            res.json({success : false, error: err});
            return;
        }
        res.json({success: true, data: newCategory});
    });

});

//delete category
router.delete("/", async function(req, res){
    const categoryid = req.body.categoryid;
    const result =  await CategoryModel.findOneAndDelete({categoryid:categoryid});
    
    if(!result){
        res.json({success:false, error: "category-not-found"});
    }
    res.json({success:true, data:result});
});

//edit category with id
router.put("/", async function(req, res){
    const categorydata = req.body;
    const categoryid = categorydata.categoryid;

    const result = await CategoryModel.findOneAndUpdate({categoryid: categoryid},
        
        categorydata);

        if(!result){
            res.json({success: false, error:"category-not-found"});
            return;

        }

        res.json({success:true, data: categorydata});
})

module.exports = router;