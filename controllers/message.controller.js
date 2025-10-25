import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import cloudinary from "../cloudinary/cloudinary.js"
import { getReciverSocketId } from "../server.js"
import { io } from "../server.js"
import fs from "fs"
import path from "path"

export const getUsers = async (req, res) => {

    try {
        const id = req.userId
        const allUsers = await User.find({ _id: { $ne: id } }).select("-password")
        res.status(200).json(allUsers)
    } catch (error) {
        console.log("error in getUsers controller", error)
        res.status(500).json({ success: false, message: "internal server error" })

    }

}

export const getMessages = async (req, res) => {

    try {
        const { id: userToChatId } = req.params
        const myId = req.userId
        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: userToChatId },
                { senderId: userToChatId, reciverId: myId }
            ]
        })
        res.status(200).json({ success: true, messages })


    } catch (error) {
        console.log("error in getMessage controller \n", error)
        res.status(500).json({ success: false, message: "internal server error" })

    }
}
export const sendMessage = async (req, res) => {

    try {
        const senderId = req.userId
        const { id: reciverId } = req.params
        const { text, tempId } = req.body
        const image = req.file
        let imageUrl
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image.path)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            text,
            image: imageUrl
        })
        await newMessage.save()


        //implement socket.io here
        const reciverSocketId = getReciverSocketId(reciverId)
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", newMessage)//if there is no to() this message would go to everybody
        }

        res.status(200).json({ success: true, newMessage, tempId })
        if (imageUrl) {
            const __dirname = path.resolve()
            const filePath = path.join(__dirname, "uploads", req.file.filename);
            console.log(filePath)
            fs.unlinkSync(filePath)
            imageUrl=undefined
        }
  

    } catch (error) {
        console.log("error in sendMessage controller", error)
        res.status(500).json({ success: false, message: "internal server error" })

    }
}