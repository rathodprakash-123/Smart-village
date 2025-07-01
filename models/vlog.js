const mongoose = require("mongoose");

const vlogSchema = new mongoose.Schema({
    head:String,
    image: String,
    context:String,
});

module.exports = mongoose.model("Vlog",vlogSchema);