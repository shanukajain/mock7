var jwt = require('jsonwebtoken');

const Authorization=(req,res,next)=>{
let token=req.headers.authorization;
if(token){
    jwt.verify(token, 'masai', function(err, decoded) {
    if(decoded){
        console.log(decoded) 
        req.body.userid=decoded.userid;
        next();
    }else {
        res.send({"msg":"login first"})
    }
      });
}else {
    res.send({"msg":"login first"})
}
}


module.exports={Authorization}