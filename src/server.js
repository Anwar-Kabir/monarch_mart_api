const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('uploads'));

//git check by anwar kabir 
// this is victory day git 

const mongodbPath = "mongodb+srv://flutterbackend:flutter11@cluster0.nno2rot.mongodb.net/flutterbackapi?retryWrites=true&w=majority"; 
mongoose.connect(mongodbPath).then(function(){

    app.get("/", function(req, res){
        res.send("Flutter ecommerce backend APIs");
        
    });

    const userRoutes =require('./routes/user_routes');
    app.use("/api/user", userRoutes);

    const categoryRoutes = require('./routes/category_routes');
    app.use("/api/category", categoryRoutes);

    const productRoutes =require('./routes/product_routes');
    app.use("/api/product", productRoutes);

    const fileRoutes =require('./routes/file_routes');
    app.use("/api/file", fileRoutes);

    const orderRoutes = require('./routes/order_routes');
    app.use("/api/order", orderRoutes);

    app.use((req,res,next)=>{
        res.status(404).json({message:"No route Found"})
    })
    
    //server error handle
    app.use((erro,req,res,next)=>{
        res.status(500).json({message:"500 Internal Server Error"})
    })

});


const PORT = process.env.PORT || 5000;;
app.listen(PORT, function(){
    console.log("Server start at port:" + PORT);
});