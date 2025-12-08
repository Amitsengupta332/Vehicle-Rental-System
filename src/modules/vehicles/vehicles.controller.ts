import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

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
const updateVehicles = async (req: Request, res: Response) => {};
const deleteVehicles = async (req: Request, res: Response) => {};
export const vehiclesController = {
  createVehicles,
  getVehicles,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles,
};
