const router = require("express").Router();
const UserModel = require("./../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require('./../middlewares/jwt');
const jsonwebtoken = require("jsonwebtoken");

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

//===> Get user by id
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


module.exports = router;
