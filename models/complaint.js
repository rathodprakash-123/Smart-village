const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  name: String,
  address:String,
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);
