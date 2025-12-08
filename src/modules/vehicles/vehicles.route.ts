 
import auth from "../../middleware/auth";
import { vehiclesController } from "./vehicles.controller";
import { UserRole } from "../../types/roles";
import { Router } from "express";

const router = Router();

router.post("/", auth(UserRole.Admin), vehiclesController.createVehicles);
router.get("/", vehiclesController.getVehicles);
router.get("/:vehicleId", vehiclesController.getSingleVehicles);

export const vehiclesRoute = router;