if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const middelware = require("./middleware");

const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/smart-village')
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const sessionOptions = {
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.session.userId; // true if logged in
  res.locals.userRole = req.session.role || null;
  res.locals.session = req.session;
  next();
});


// Routes
app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/admin",adminRoutes);


const port = 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`)); 
