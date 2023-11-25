const AdminCLTN = require("../models/adminSchema");
const ManagerCLTN = require('../models/managerSchema');
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken")
const ProductCLTN = require("../models/productSchema")

const maxAge = 3*24*60*60;
const generateToken = (id,isAdmin)=>{
    return jwt.sign({id,isAdmin}, process.env.JWT_SECRET,{expiresIn:maxAge})
};

//login verification =======

exports.LoginVerification = async(req,res,next)=>{
    try{
        //collecting email password from frontend
    const {email,password} = req.body;

    const adminCheck = await AdminCLTN.findOne({email:email})
    const manegrCheck = await ManagerCLTN.findOne({email:email});
    
    if(adminCheck || manegrCheck){
        if(adminCheck){
            const checkPassword = await AdminCLTN.findOne({email:email})

         if (checkPassword){
            const token = await generateToken(adminCheck._id,adminCheck.isAdmin);

            // converting mongoose objects into plain js
            const admin = adminCheck.toObject();
            admin.token = token;

            //if user is a authorized user set the cookie and send token in json response (cookies not working so trying state approach )
            res.cookie("token",token,{
                path:"/",
                httpOnly : true,
                expire: new Date() + maxAge *1000,
                sameSite:"none",//cross site requests enabling
            }).status(200)
            .json({status:"OK",loginDetails:admin});
         }else{
            res.json("incorrectPassword");
         }
            
        }else{
            const checkPassword = await bcrypt.compare(
                password,
                manegrCheck.password
            );
            if (checkPassword){
                const token = await generateToken(manegrCheck._id, manegrCheck.isAdmin);
                const manager = manegrCheck.toObject();
                manager.token = token;

        //if user is a authorized user set the cookie and send token in json response (cookies not working)
        res
        .cookie("token", token, {
          path: "/",
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 86400), // 1 day in milliseconds
          sameSite: "none", // cross site requests enabling
          secure: false, // sent only through https
        })
        .status(200)
        .json({ status: "OK", loginDetails: manager });
    } else {
      res.json("incorrectPassword");
    }
}

}else {
    res.status(400).json("invalidCredentials");
  }
    
}
    
catch (error) {
    console.log("Error in Login" + error);
    res.json("error");
  }
};

 // registration verfication===================================

exports.SignUpVerification = async(req,res,next)=>{
console.log(req.body);
const {name,email,password} = req.body;
const hashedPassword = await bcrypt.hash(password,10);
const data = {
    name:name,
    email:email,
    password:hashedPassword,
};
try{
    const check = await ManagerCLTN.findOne({email:email});
    if(check){
        res.json("exist");
       
    }else{
         //saving data in collection
         await ManagerCLTN.insertMany([data]);
        res.json("not exists")
    }
}
catch(err){
    console.log("register errr" +err);
    
};

};

// ================get homepage=================================
exports.getHomeData = async (req,res)=>{
    try{
        const productCount = await ProductCLTN.countDocuments({});

        const managerCount = await ManagerCLTN.countDocuments({});
    
        const count = {
          managerCount,
          productCount,
        };
    
        res.send({ success: true, count: count });

    } catch (error) {
    console.log("Error in Get Home Data :" + error);
    res.send({ success: false, message: "Get Home data failed" });
  }
}