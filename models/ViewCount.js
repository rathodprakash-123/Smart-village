const mongoose = require("mongoose");

const viewCountSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("ViewCount", viewCountSchema);
