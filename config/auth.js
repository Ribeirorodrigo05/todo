const key = require('./keys');
const jwt = require('jsonwebtoken');
module.exports = login = (req, res, next)=>{
    let id={};
        jwt.verify(req.cookies.cookieToken, key.secretOrkey, (err, decoded)=>{
            if(err){
                res.redirect('/')
            }else{
                req.cookies.cookieToken = decoded.id;
                id.userID = decoded.id
                
            }
        })
        req.userID = id.userID;
        next();
}