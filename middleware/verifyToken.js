import jwt from "jsonwebtoken"

export const verifyToken=(req,res,next)=>{
    const token=req.cookies?.jwt
    try {
        if(!token) return res.status(400).json({success:false,message:"Unauthorized"})
        const decoded=jwt.verify(token,process.env.SECRET)
        if(!decoded) return res.status(400).json({success:false,message:"Unauthorized"})
        req.userId=decoded.id
        next()
    
        
    } catch (error) {
        console.log("error in verifyToken middleware\n",error)
        res.status(500).json({success:false,message:"invalid token"})
        
    }
    

}