import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  uid: text("uid").unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("viewer"),
  status: text("status").notNull().default("active"),
  mfaEnabled: boolean("mfa_enabled").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin Users table
export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  googleId: text("google_id").unique(),
  role: text("role").notNull().default("admin"),
  status: text("status").notNull().default("active"),
  lastLogin: text("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Programs table
export const programs = pgTable("programs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  specs: jsonb("specs").notNull().default({}),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events table
export const events = pgTable("events", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  venue: text("venue").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gallery table
export const gallery = pgTable("gallery", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  folder: text("folder").notNull().default("General"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog Posts table
export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  readTime: text("read_time").notNull(),
  date: text("date").notNull(),
  image: text("image").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  avatar: text("avatar").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Partners table
export const partners = pgTable("partners", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Donations table
export const donations = pgTable("donations", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  donorName: text("donor_name").notNull(),
  donorEmail: text("donor_email").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site Settings table
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  value: jsonb("value").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generic Key-Value Store for all other collections
export const kvStore = pgTable("kv_store", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull().default({}),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company Information table
export const companyInformation = pgTable("company_information", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  overview: text("overview"),
  history: text("history"),
  whatWeDo: text("what_we_do"),
  logo: text("logo"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Founder table
export const founder = pgTable("founder", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull().default("Founder & CEO"),
  photo: text("photo").notNull(),
  bio: text("bio").notNull(),
  message: text("message").notNull(),
  twitter: text("twitter"),
  linkedin: text("linkedin"),
  email: text("email"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leadership Team table
export const leadershipTeam = pgTable("leadership_team", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  department: text("department"),
  photo: text("photo").notNull(),
  bio: text("bio"),
  orderIdx: integer("order_idx").default(0),
  isPublished: boolean("is_published").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Staff Members table
export const staffMembers = pgTable("staff_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  department: text("department"),
  photo: text("photo").notNull(),
  bio: text("bio"),
  orderIdx: integer("order_idx").default(0),
  isPublished: boolean("is_published").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mission table
export const mission = pgTable("mission", {
  id: text("id").primaryKey(),
  statement: text("statement").notNull(),
  isPublished: boolean("is_published").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vision table
export const vision = pgTable("vision", {
  id: text("id").primaryKey(),
  statement: text("statement").notNull(),
  isPublished: boolean("is_published").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Core Values table
export const coreValuesTable = pgTable("core_values", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  orderIdx: integer("order_idx").default(0),
  isPublished: boolean("is_published").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// About Sections table
export const aboutSections = pgTable("about_sections", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  image: text("image"),
  orderIdx: integer("order_idx").default(0),
  isPublished: boolean("is_published").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});
