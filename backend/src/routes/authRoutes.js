import express from "express"
import { register, login } from "../controllers/authController.js"


const router = express.Router()

console.log('From authRoutes:', process.env.MONGO_URI)

router.post("/register", register)
router.post("/login",login)

export default router