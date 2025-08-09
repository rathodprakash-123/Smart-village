const express = require("express");
const router = express.Router();
const Announcement = require("../models/announcement");
const Complaint = require("../models/complaint");
const Vlog = require("../models/vlog");
const {isLoggedIn} =require("../middleware")
const ViewCount = require("../models/ViewCount");
const methodOverride = require("method-override");
const multer = require("multer");
const path = require("path");
const {storage} = require("../cloudConfig.js");


const upload = multer({ storage });


router.get("/", async (req, res) => {
  let counter = await ViewCount.findOne();

  if (!counter) {
    counter = new ViewCount({ count: 1 });
  } else {
    counter.count += 1;
  }

  await counter.save();
  const announcements = await Announcement.find().sort({ date: -1 });

  res.render("index",{announcements,views: counter.count});
});

router.get("/scheme",(req,res)=>{
  res.render("Scheme");
});

//complaints

router.post("/complaint",async (req, res) => {
  const { name,address,description } = req.body;
  await Complaint.create({ name, address,description });
  res.redirect("/complaint");
});
router.get("/complaint",isLoggedIn,async(req,res)=>{
  const complaints = await Complaint.find().sort({ date: -1 });
  res.render("complaint",{complaints})
});

router.delete("/complaint/:id",async(req,res)=>{
  let {id} = req.params;
  await Complaint.findByIdAndDelete(id);
  res.redirect("/complaint")
});

//annocemnets

router.post("/announcement",async(req,res)=>{
  const{title,content} =req.body;
  await Announcement.create({title,content});
  
  res.redirect("/admin");
});

router.get("/announcement",async(req,res)=>{
    const announcements = await Announcement.find().sort({ date: -1 });
    res.redirect("/admin");
});

router.delete("/announcement/:id",async(req,res)=>{
  let {id} = req.params;
  await Announcement.findByIdAndDelete(id);
  res.redirect("/admin")
});

router.get("/vlog",async(req,res)=>{
  const vlogs = await Vlog.find().sort({ date: -1 });
  res.render("vlog",{vlogs});
});

router.post("/vlog",upload.single("image"),async (req, res) => {
  console.log(req.body);
  const {head,context } = req.body;
  const imagePath = req.file.path;
  await Vlog.create({ head, image: imagePath, context });
  res.redirect("/vlog");
});

router.delete("/vlog/:id",async(req,res)=>{
  let {id} = req.params;
  await Vlog.findByIdAndDelete(id);
  res.redirect("/admin")
});
module.exports = router;
