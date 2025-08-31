import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firebaseUid: text("firebase_uid").unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  phoneNumber: text("phone_number"),
  points: integer("points").default(0),
  level: integer("level").default(1),
  totalBookings: integer("total_bookings").default(0),
  achievements: json("achievements").$type<string[]>().default([]),
  walletBalance: integer("wallet_balance").default(0),
  tier: text("tier").default("bronze"), // bronze, silver, gold, platinum
  language: text("language").default("en"), // en, hi, ta, te, bn
  profileImage: text("profile_image"),
  isEmailVerified: boolean("is_email_verified").default(false),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Wallet transactions table
export const walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // credit, debit, bonus, refund
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  bookingId: varchar("booking_id").references(() => bookings.id),
  balanceBefore: integer("balance_before").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  pointsRequired: integer("points_required").default(0),
  bookingsRequired: integer("bookings_required").default(0),
  type: text("type").notNull(), // points, bookings, special
  reward: integer("reward").default(0), // wallet reward
  isActive: boolean("is_active").default(true),
});

// User achievements junction table
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  achievementId: varchar("achievement_id").references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
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
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
