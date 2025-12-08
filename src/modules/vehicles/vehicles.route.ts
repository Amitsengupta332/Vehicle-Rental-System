 
import auth from "../../middleware/auth";
import { vehiclesController } from "./vehicles.controller";
import { UserRole } from "../../types/roles";
import { Router } from "express";

const router = Router();

router.post("/", auth(UserRole.Admin), vehiclesController.createVehicles);

export const vehiclesRoute = router;