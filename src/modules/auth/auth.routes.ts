import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()
router.post("/signup", authController.signupUsers);
router.post("/signin", authController.signinUsers);


export const authRoutes = router