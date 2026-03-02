import express from "express"
import { register, login } from "../controllers/authController.js"
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginSchema, registerSchema } from "../validators/authValidators.js";


const router = express.Router()

// Frontend can be bypassed.
// Anyone can call your API directly with Postman/curl/script and skip your UI entirely.
router.post("/register", validateRequest(registerSchema), register)
router.post("/login", validateRequest(loginSchema), login)

export default router
