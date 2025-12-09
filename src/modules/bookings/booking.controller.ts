import { Request, Response } from "express";

const createBooking = async (req: Request, res: Response) => {};

const getAllBookings = async (req: Request, res: Response) => {};

const updateBooking = async (req: Request, res: Response) => {};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};