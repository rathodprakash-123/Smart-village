const express = require("express");
const router = express.Router();
const Announcement = require("../models/announcement");
const Complaint = require("../models/complaint");
const Vlog = require("../models/vlog");


router.get("/",async (req, res) => {
  const announcements = await Announcement.find().sort({ date: -1 });
  const complaints = await Complaint.find().sort({ date: -1 });
  const vlogs = await Vlog.find().sort({ date: -1 });

  res.render("dashboard", {
    announcements,
    vlogs,complaints,
    role: req.session.role 
  });
});




module.exports = router;