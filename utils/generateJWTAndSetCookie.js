import jwt from "jsonwebtoken"

export const generateJWTAndSetCookie=(res,id)=>{
    try {
        const payload={id}
        const secret=process.env.SECRET
        const options={expiresIn:"7d"}

        //generating jwt
        const token=jwt.sign(payload,secret,options)

        //set cookie
        res.cookie("jwt",token,{
            httpOnly:true,//  prevents xss attack
            secure:process.env.ENV=="production", // only sent over HTTPS (set false for localhost)
            sameSite:process.env.ENV=="production"?"none":"lax",
            maxAge:7*24*60*60*1000 //7days in miliseconds
        })
        
    } catch (error) {
        console.log("error while generating jwt and setting cookie\n",error)
        
    }

}