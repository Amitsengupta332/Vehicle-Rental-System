import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../types/roles";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.Admin, UserRole.Customer),
  bookingController.createBooking
);

export const bookingRoutes = router;
