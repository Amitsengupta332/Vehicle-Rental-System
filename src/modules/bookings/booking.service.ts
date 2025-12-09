import { pool } from "../../config/db";
import { UserRole } from "../../types/roles";

const createBooking = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date, user } = payload;

 
  const customer = await pool.query(`SELECT * FROM users WHERE id=$1`, [customer_id]);
  if (!customer.rows[0]) {
    return { success: false, message: "Customer does not exist" };
  }

 
  if (user.role !== UserRole.Admin && user.id !== customer_id) {
    return { success: false, message: "You are not authorized to perform this action" };
  }

 
  const vehicle = await pool.query(
    `SELECT * FROM vehicles WHERE id=$1 AND availability_status='available'`,
    [vehicle_id]
  );
  if (!vehicle.rows[0]) {
    return { success: false, message: "Vehicle is not available" };
  }

 
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (endDate <= startDate) {
    return { success: false, message: "End date must be after start date" };
  }

 
  const dailyPrice = Number(vehicle.rows[0].daily_rent_price);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const total_price = dailyPrice * days;

 
  const result = await pool.query(
    `
     INSERT INTO bookings 
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1, $2, $3, $4, $5, 'active')
     RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  const booking = result.rows[0];

  // 7️⃣ Update vehicle status
  const updatedVehicle = await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1 RETURNING vehicle_name, daily_rent_price`,
    [vehicle_id]
  );

  booking.vehicle = updatedVehicle.rows[0];

  return { success: true, data: booking };
};

const getAllBookings = async (user: any) => {
  if (user.role === UserRole.Admin) {
    const result = await pool.query(`
      SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date,
             b.rent_end_date, b.total_price, b.status,
             v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id
    `);

    return result.rows;
  }

  // Customer → only own bookings
  const result = await pool.query(
    `
      SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date,
             b.rent_end_date, b.total_price, b.status,
             v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id
    `,
    [user.id]
  );

  return result.rows;
};

const updateBooking = async (bookingId: number, user: any) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);

  if (result.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = result.rows[0];
  const today = new Date();

  // Customer cancel
  if (user.role === UserRole.Customer) {
    if (booking.customer_id !== user.id) {
      throw new Error("Unauthorized to cancel this booking");
    }

    const startDate = new Date(booking.rent_start_date);
    if (today >= startDate) {
      throw new Error("Cannot cancel booking after start date");
    }

    const cancelled = await pool.query(
      `UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );

    return cancelled.rows[0];
  }

  // Admin → Mark as returned
  const returned = await pool.query(
    `UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`,
    [bookingId]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
    [booking.vehicle_id]
  );

  return returned.rows[0];
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBooking,
};
