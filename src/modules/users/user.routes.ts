import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../types/roles";
 

const router = Router();

router.get("/", auth(UserRole.Admin),  userController.getAllUsers);

export const userRoutes = router;
