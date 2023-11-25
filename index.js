const dotenv = require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const nocache = require('nocache');
//used to parse req.body
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

//cross origin resorce sharing :- enables forntend backend communication
const cors = require('cors')

const morgen = require('morgan')

const app = express();

//===== for handaling data coming through url===
app.use(bodyParser.json()); // support json encoded bodies
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.json());
app.use(nocache());
app.use(morgen("tiny"));


app.use(cors({
  origin:[ "http://localhost:5173"],
  methods:["GET","POST","PUT",, "DELETE"],
  credentials : true,
}));

//=============Routes===========


const adminRoutes = require('./routes/adminRoutes');
app.use("/",adminRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/products",productRoutes);
//connect to database and start

const PORT =  5000;
mongoose
      .connect(process.env.MONGO_URI)
      .then(()=>{
        app.listen(PORT,()=>{
            console.log(`server running on port${PORT}`);
        });
      })
      .catch((error)=>console.log('err'+error));