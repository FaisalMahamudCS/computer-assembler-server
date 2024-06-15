
const jwt=require('jsonwebtoken');

const JWTVarification = (req, res, next) => {
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message:'unauthorized access'});
    }
    const token=authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            return res.status(403).send({message:'Forbidden access'})
        }
        console.log(decoded)
        req.decoded=decoded;
          next();
    })

  };
  
  module.exports = JWTVarification;
  
