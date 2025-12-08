import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";
import { pool } from "../../config/db";

const createVehicles = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehiclesServices.createVehicles(req.body);
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// GET ALL VEHICLES
const getVehicles = async (req: Request, res: Response) => {
  const all = await vehiclesServices.getVehicles();
  return res.status(200).json({
    success: true,
    message: "Vehicles retrieved successfully",
    data: all,
  });
};

// GET SINGLE
const getSingleVehicles = async (req: Request, res: Response) => {
  const id = Number(req.params.vehicleId);
  const vehicle = await vehiclesServices.getSingleVehicles(id);

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Vehicle retrieved successfully",
    data: vehicle,
  });
};

// UPDATE
const updateVehicles = async (req: Request, res: Response) => {
  const id = Number(req.params.vehicleId);
  const updated = await vehiclesServices.updateVehicles(id, req.body);

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Vehicle updated successfully",
    data: updated,
  });
};

// DELETE
const deleteVehicles = async (req: Request, res: Response) => {
  const id = Number(req.params.vehicleId);

  const activeBooking = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [id]
  );

  if (activeBooking.rows.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete vehicle with active bookings",
    });
  }

  const deleted = await vehiclesServices.deleteVehicles(id);

  if (deleted === 0) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Vehicle deleted successfully",
  });
};
export const vehiclesController = {
  createVehicles,
  getVehicles,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles,
};
