import {Router} from "express"
import { login, logout, signup,checkAuth,updateProfile } from "../controllers/auth.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"


const route=Router()

route.post("/login",login)

route.post("/signup",signup)

route.get("/logout",logout)

route.get("/check-auth",verifyToken,checkAuth)

route.put("/update-profile",verifyToken,updateProfile)
export default route