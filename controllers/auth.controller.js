import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { generateJWTAndSetCookie } from "../utils/generateJWTAndSetCookie.js"
import cloudinary from "../cloudinary/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) return res.status(400).json({ success: true, message: "All fields are required" })
        const userExist = await User.findOne({ email })
        if (userExist) return res.status(400).json({ success: false, message: "user alreday exists" })

        //hash password
        const hashedPassword = await bcrypt.hash(password, 8)

        const user = new User({
            fullName,
            email,
            password: hashedPassword
        })
        if (user) {
            await generateJWTAndSetCookie(res, user._id)
            await user.save()
            res.status(201).json({ success: true, user: { ...user._doc, password: null } })



        } else {
            res.status(400).json({ success: false, message: "Invalid user data" })
        }

        //generate jwt token and set cookie





    } catch (error) {
        console.log("error in signup controller \n", error)
        res.status(500).json({ success: false, message: "internal server error" })

    }

}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) return res.status(400).json({ success: false, message: "All fields are required" })
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ success: false, message: "Invalid Credentials" })
        const isMatch = await bcrypt.compare(password, user.password)

        //check if password is correct
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid Credentials" })

        //generate jwt token and set cookie
        generateJWTAndSetCookie(res, user._id)

        res.status(200).json({ success: true, user: { ...user._doc, password: null } })




    } catch (error) {
        console.log("error in login controller \n", error)
        res.status(500).json({ success: false, message: "internal server error" })

    }

}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt")
        res.status(200).json({ success: true, message: "Logged out successfully" })

    } catch (error) {
        console.log("error in logout controller\n", error)
        res.status(500).json({ success: false, message: "internal server error" })

    }


}

export const updateProfile = async (req, res) => {
    const id = req.userId
    const {profilePic}=req.body


    try {
        if(!profilePic) return res.status(400).json({success:false,message:"Profile Pic is required"})

        const user = await User.findById(id)
        if (!user) return res.status(400).json({ success: false, message: "access denied" })

        const result = await cloudinary.uploader.upload(profilePic)

        const updatedUser=await User.findByIdAndUpdate(id,{profilePic:result.secure_url},{new:true}).select("-password")//new:true it returns latest updated user

        res.status(200).json({success:true,user:updatedUser})


        

    } catch (error) {
        console.log("error in updateProfile controller\n", error)
        res.status(500).json({ success: false, message: "internal server error" })

    }





}

export const checkAuth = async (req, res) => {
    const id = req.userId
    try {
        const user = await User.findById(id).select("-password")
        if (!user) return res.status(400).json({ success: false, message: "user not found" })
        res.status(200).json({ success: true, user })


    } catch (error) {
        console.log("error in checkAuth controller", error)
        res.status(500).json({ success: false, message: "internal server error" })
    }

}