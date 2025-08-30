import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull().unique(),
  name: text("name"),
  email: text("email"),
  points: integer("points").default(0),
  level: integer("level").default(1),
  totalBookings: integer("total_bookings").default(0),
  achievements: json("achievements").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  vehicleNumber: text("vehicle_number").notNull(),
  location: text("location").notNull(),
  slotNumber: text("slot_number"),
  bookingTime: timestamp("booking_time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  status: text("status").notNull().default("active"), // active, completed, cancelled
  isPreBooked: boolean("is_pre_booked").default(false),
  pointsEarned: integer("points_earned").default(50),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // license, rc, puc
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  expiryDate: timestamp("expiry_date"),
  isValid: boolean("is_valid").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parkingSpots = pgTable("parking_spots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  totalSlots: integer("total_slots").notNull(),
  availableSlots: integer("available_slots").notNull(),
  pricePerHour: integer("price_per_hour").notNull(),
  coordinates: json("coordinates").$type<{lat: number, lng: number}>(),
  amenities: json("amenities").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
});

export const businessInquiries = pgTable("business_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lookingFor: text("looking_for").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  city: text("city").notNull(),
  message: text("message"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const evStations = pgTable("ev_stations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  coordinates: json("coordinates").$type<{lat: number, lng: number}>(),
  availablePorts: integer("available_ports").default(0),
  totalPorts: integer("total_ports").notNull(),
  pricePerKwh: integer("price_per_kwh").notNull(),
  distance: text("distance"),
  isActive: boolean("is_active").default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessInquirySchema = createInsertSchema(businessInquiries).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type ParkingSpot = typeof parkingSpots.$inferSelect;
export type BusinessInquiry = typeof businessInquiries.$inferSelect;
export type InsertBusinessInquiry = z.infer<typeof insertBusinessInquirySchema>;
export type EVStation = typeof evStations.$inferSelect;
