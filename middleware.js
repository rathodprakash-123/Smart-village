module.exports.isLoggedIn =(req, res, next) =>{
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

module.exports.isAdmin = (req,res,next)=>{
  if(req.session.role == "admin"){
    return res.redirect("/admin")
  }
  else{
    return res.redirect("/complaint");
  }
}


