import {Router} from "express"
import { getUsers,getMessages,sendMessage } from "../controllers/message.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { upload } from "../middleware/multer.js"
const route=Router()

route.get("/users",verifyToken,getUsers)
route.get("/:id",verifyToken,getMessages)
route.post("/send/:id",verifyToken,upload.single("image"),sendMessage)

export default route

