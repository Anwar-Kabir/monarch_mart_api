const router = require("express").Router();
const UserModel = require("./../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require('./../middlewares/jwt');
const jsonwebtoken = require("jsonwebtoken");
const CartModel= require("./../models/cart_model");
const CartItemModel = require("./../models/cart_item_model");

//===> Create new user
router.post("/createaccount", async function(req, res){
    const userData = req.body;

    //encrypt (hash) the password
    const password = userData.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    userData.password = hashedPassword;

    // Create the JWT Token
     const token = await jsonwebtoken.sign({ userid: userData.userid }, "thisismysecretkey");
     userData.token = token;

    const newUser = new UserModel(userData);

    await newUser.save(function(err){
        if(err){
            res.json({success: false, error: err});
            return;
        }
        res.json({success: true, data: newUser });
    });
});

//===> Get user by id, with jwt, in harder auth-token & userid  
router.get("/:userid", jwt, async function(req, res){
    const userid =  req.params.userid;
    const foundUser = await UserModel.findOne({userid: userid});
    if(!foundUser){
        res.json({success : false, error: "user-not-found"});
        return;
    }

    res.json({success:true, data: foundUser});
});

//===> User login with email, password
router.post("/login", async function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const foundUser = await UserModel.findOne({email: email});
    if(!foundUser){
        res.json({success: false, error: "user-not-found"});
        return;
    }

   const correctPassword = await bcrypt.compare(password, foundUser.password);
   
   if(!correctPassword){
    res.json({success: false, error: "incorrect-password"});
        return;
   }

   res.json({success : true, data: foundUser});

});

//===> User info update by id
router.put("/", async function(req, res){
    const userdata = req.body;
    const userid = userdata.userid;

    const result = await UserModel.findOneAndUpdate({userid: userid},
        
        userdata);

        if(!result){
            res.json({success: false, error:"user-not-found"});
            return;

        }

        res.json({success:true, data: userdata});
});

//user delete by id
router.delete("/", async function(req, res){
    const userid = req.body.userid;
    const result  = await UserModel.findOneAndDelete({userid:userid});
    if(!result){
        res.json({success:false, error: "userid-not-found"});
        return;
    }

    res.json({success:true, data: result});

});

//user list all
router.get("/", async function(req, res){
    await UserModel.find().exec(function(err, userlist){
        if(err){
            res.json({success: false, error: err});
            return;
        }

        res.json({success: true, data: userlist});
    });
});


//===> add to card router
//create cart product, add to cart product under user id
router.post("/:userid/addtocart", async function(req, res){
    const userid = req.params.userid;
    const cartItemDetails =req.body;
    const userCart = await CartModel.findOne({userid: userid});
   
    if(!userCart){
        const newCartModel = new CartModel ({userid: userid, items: []});
        await newCartModel.save(function(err){
            if(err){
                res.json({success: false, error: err});
                return;
            }
        });
        cartItemDetails.cartid= newCartModel.cartid;
    }
    else {
        cartItemDetails.cartid = userCart.cartid;
    }

    const newCartItem = new CartItemModel(cartItemDetails);
    await newCartItem.save(async function(err){
        if(err){
            res.json({success: false, error: err});
            return;
        }
        await CartModel.findOneAndUpdate({cartid: newCartItem.cartid}, {$push: {items: newCartItem._id}});
        res.json({success:true, data: newCartItem});
    });    
});

//fetch add to cart product under user
router.get("/:userid/viewcart", async function(req, res) {
    const userid = req.params.userid;
    const foundCart = await CartModel.findOne({ userid: userid }).populate({
        path: "items",
        populate: {
            path: "product style"
        }
    });
    if(!foundCart) {
        res.json({ success: false, error: "cart-not-found" });
        return;
    }

    res.json({ success: true, data: foundCart });
});

//==>remove product from cart ==>
router.delete("/:userid/removefromcart", async function(req, res) {
    const userid = req.params.userid;
    const cartItemDetails = req.body;

    const updatedCart = await CartModel.findOneAndUpdate({ userid: userid }, { $pull: { items: cartItemDetails.itemid } });
    if(!updatedCart) {
        res.json({ success: false, error: 'cart-not-exists' });
        return;
    }

    res.json({ success: true, data: cartItemDetails });
});

//==>update product from cart ==> NOT DONE 
router.put("/:userid/updatefromcart", async function(req, res) {
    const userid = req.params.userid;
    const cartItemDetails = req.body;

    const updatedCart = await CartModel.findOneAndUpdate({ userid: userid }, { $pull: { items: cartItemDetails.itemid } });
    if(!updatedCart) {
        res.json({ success: false, error: 'cart-not-exists' });
        return;
    }

    res.json({ success: true, data: cartItemDetails });
});


module.exports = router;
