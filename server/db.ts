import { db as pgDb } from "../src/db/index.ts";
import * as schema from "../src/db/schema.ts";
import { eq } from "drizzle-orm";

// Define TypeScript interfaces for our database records
export interface DatabaseSchema {
  users: any[];
  roles: any[];
  permissions: any[];
  customers: any[];
  products: any[];
  categories: any[];
  orders: any[];
  payments: any[];
  projects: any[];
  services: any[];
  heroSlides: any[];
  testimonials: any[];
  teamMembers: any[];
  blogPosts: any[];
  resources: any[];
  galleryImages: any[];
  videos: any[];
  solarPackages: any[];
  quotations: any[];
  bookings: any[];
  courses: any[];
  lessons: any[];
  students: any[];
  instructors: any[];
  certificates: any[];
  supportTickets: any[];
  popupMessages: any[];
  settings: any;
  notifications: any[];
  auditLogs: any[];
  coupons: any[];
  leads: any[];
  mediaFiles: any[];
  seoSettings: any[];
}

// Helper to load or initialize the database
export class Database {
  private data: DatabaseSchema;
  private isInitialized = false;

  constructor() {
    this.data = this.getSeeds();
  }

  public async init() {
    if (this.isInitialized) return;
    console.log("Initializing PostgreSQL database connections...");
    try {
      // 1. Load generic tables from kv_store
      const kvRows = await pgDb.select().from(schema.kvStore);
      for (const row of kvRows) {
        if (row.key && Array.isArray(row.value)) {
          this.data[row.key as keyof DatabaseSchema] = row.value as any;
        } else if (row.key && row.value) {
          this.data[row.key as keyof DatabaseSchema] = row.value as any;
        }
      }

      // 2. Load users from users table
      const dbUsers = await pgDb.select().from(schema.users);
      if (dbUsers.length > 0) {
        this.data.users = dbUsers.map(u => ({
          id: u.id,
          uid: u.uid || undefined,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          mfaEnabled: u.mfaEnabled
        }));
      }

      // 3. Load blogPosts from blog_posts table
      const dbBlogs = await pgDb.select().from(schema.blogPosts);
      if (dbBlogs.length > 0) {
        this.data.blogPosts = dbBlogs.map(b => ({
          id: b.id,
          title: b.title,
          excerpt: b.excerpt,
          content: b.content,
          author: b.author,
          category: b.category,
          readTime: b.readTime,
          date: b.date,
          image: b.image,
          slug: b.slug
        }));
      }

      // 4. Load galleryImages from gallery table
      const dbGallery = await pgDb.select().from(schema.gallery);
      if (dbGallery.length > 0) {
        this.data.galleryImages = dbGallery.map(g => ({
          id: g.id,
          name: g.name,
          url: g.url,
          folder: g.folder
        }));
      }

      // 5. Load testimonials from testimonials table
      const dbTestimonials = await pgDb.select().from(schema.testimonials);
      if (dbTestimonials.length > 0) {
        this.data.testimonials = dbTestimonials.map(t => ({
          id: t.id,
          name: t.name,
          role: t.role,
          content: t.content,
          rating: t.rating,
          avatar: t.avatar
        }));
      }

      // 6. Load settings from site_settings table
      const dbSettings = await pgDb.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, "settings"));
      if (dbSettings.length > 0 && dbSettings[0].value) {
        this.data.settings = dbSettings[0].value;
      }

      // If database is completely empty (no users or other main records), perform seeding!
      const allUsersCount = await pgDb.select().from(schema.users);
      if (allUsersCount.length === 0) {
        console.log("Database is empty. Performing initial seed in PostgreSQL...");
        await this.seedPostgres();
      }

      this.isInitialized = true;
      console.log("PostgreSQL database successfully initialized!");
    } catch (err) {
      console.error("Failed to connect to PostgreSQL or initialize schema:", err);
    }
  }

  private async seedPostgres() {
    const seeds = this.getSeeds();
    try {
      // 1. Seed users
      for (const u of seeds.users) {
        await pgDb.insert(schema.users).values({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          mfaEnabled: u.mfaEnabled || false,
        }).onConflictDoNothing();
      }

      // 2. Seed blog posts
      for (const b of seeds.blogPosts) {
        await pgDb.insert(schema.blogPosts).values({
          id: b.id,
          title: b.title,
          excerpt: b.excerpt,
          content: b.content,
          author: b.author,
          category: b.category,
          readTime: b.readTime,
          date: b.date,
          image: b.image,
          slug: b.slug,
        }).onConflictDoNothing();
      }

      // 3. Seed gallery images
      for (const g of seeds.galleryImages) {
        await pgDb.insert(schema.gallery).values({
          id: g.id,
          name: g.name,
          url: g.url,
          folder: g.folder,
        }).onConflictDoNothing();
      }

      // 4. Seed testimonials
      for (const t of seeds.testimonials) {
        await pgDb.insert(schema.testimonials).values({
          id: t.id,
          name: t.name,
          role: t.role,
          content: t.content,
          rating: t.rating || 5,
          avatar: t.avatar,
        }).onConflictDoNothing();
      }

      // 5. Seed site settings
      await pgDb.insert(schema.siteSettings).values({
        id: "settings",
        value: seeds.settings
      }).onConflictDoNothing();

      // 6. Seed kv_store with everything else
      const keysToSeed = Object.keys(seeds) as (keyof DatabaseSchema)[];
      for (const key of keysToSeed) {
        if (["users", "blogPosts", "galleryImages", "testimonials", "settings"].includes(key)) {
          continue;
        }
        await pgDb.insert(schema.kvStore).values({
          key,
          value: seeds[key]
        }).onConflictDoNothing();
      }

      console.log("PostgreSQL seeding complete.");
    } catch (err) {
      console.error("Failed seeding PostgreSQL database:", err);
    }
  }

  private async syncTableToPostgres<T extends keyof DatabaseSchema>(table: T) {
    try {
      const list = this.data[table];
      if (table === "users") {
        for (const u of list as any[]) {
          await pgDb.insert(schema.users).values({
            id: u.id,
            uid: u.uid || null,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            mfaEnabled: u.mfaEnabled || false,
          }).onConflictDoUpdate({
            target: schema.users.id,
            set: {
              uid: u.uid || null,
              name: u.name,
              email: u.email,
              role: u.role,
              status: u.status,
              mfaEnabled: u.mfaEnabled || false,
            }
          });
        }
      } else if (table === "blogPosts") {
        for (const b of list as any[]) {
          await pgDb.insert(schema.blogPosts).values({
            id: b.id,
            title: b.title,
            excerpt: b.excerpt,
            content: b.content,
            author: b.author,
            category: b.category,
            readTime: b.readTime,
            date: b.date,
            image: b.image,
            slug: b.slug,
          }).onConflictDoUpdate({
            target: schema.blogPosts.id,
            set: {
              title: b.title,
              excerpt: b.excerpt,
              content: b.content,
              author: b.author,
              category: b.category,
              readTime: b.readTime,
              date: b.date,
              image: b.image,
              slug: b.slug,
            }
          });
        }
      } else if (table === "galleryImages") {
        for (const g of list as any[]) {
          await pgDb.insert(schema.gallery).values({
            id: g.id,
            name: g.name,
            url: g.url,
            folder: g.folder,
          }).onConflictDoUpdate({
            target: schema.gallery.id,
            set: {
              name: g.name,
              url: g.url,
              folder: g.folder,
            }
          });
        }
      } else if (table === "testimonials") {
        for (const t of list as any[]) {
          await pgDb.insert(schema.testimonials).values({
            id: t.id,
            name: t.name,
            role: t.role,
            content: t.content,
            rating: t.rating || 5,
            avatar: t.avatar,
          }).onConflictDoUpdate({
            target: schema.testimonials.id,
            set: {
              name: t.name,
              role: t.role,
              content: t.content,
              rating: t.rating || 5,
              avatar: t.avatar,
            }
          });
        }
      } else if (table === "settings") {
        await pgDb.insert(schema.siteSettings).values({
          id: "settings",
          value: this.data.settings
        }).onConflictDoUpdate({
          target: schema.siteSettings.id,
          set: {
            value: this.data.settings
          }
        });
      } else {
        await pgDb.insert(schema.kvStore).values({
          key: table,
          value: list
        }).onConflictDoUpdate({
          target: schema.kvStore.key,
          set: {
            value: list,
            updatedAt: new Date()
          }
        });
      }
    } catch (err) {
      console.error(`Failed to sync table ${table} to PostgreSQL:`, err);
    }
  }

  private async deleteFromPostgres<T extends keyof DatabaseSchema>(table: T, id: string | number) {
    try {
      if (table === "users") {
        await pgDb.delete(schema.users).where(eq(schema.users.id, String(id)));
      } else if (table === "blogPosts") {
        await pgDb.delete(schema.blogPosts).where(eq(schema.blogPosts.id, String(id)));
      } else if (table === "galleryImages") {
        await pgDb.delete(schema.gallery).where(eq(schema.gallery.id, String(id)));
      } else if (table === "testimonials") {
        await pgDb.delete(schema.testimonials).where(eq(schema.testimonials.id, String(id)));
      } else {
        await pgDb.insert(schema.kvStore).values({
          key: table,
          value: this.data[table]
        }).onConflictDoUpdate({
          target: schema.kvStore.key,
          set: {
            value: this.data[table],
            updatedAt: new Date()
          }
        });
      }
    } catch (err) {
      console.error(`Failed to delete from PostgreSQL for table ${table}:`, err);
    }
  }

  public save() {
    // Left as compatibility hook, individual writes now update Postgres asynchronously
  }

  public get<T extends keyof DatabaseSchema>(table: T): DatabaseSchema[T] {
    return this.data[table];
  }

  public set<T extends keyof DatabaseSchema>(table: T, value: DatabaseSchema[T]) {
    this.data[table] = value;
    this.syncTableToPostgres(table);
  }

  public insert<T extends keyof DatabaseSchema>(table: T, item: any): any {
    if (!item.id) {
      item.id = `${table.substring(0, 3).toUpperCase()}-${Date.now()}`;
    }
    if (!item.createdAt) {
      item.createdAt = new Date().toISOString();
    }
    this.data[table].push(item);
    this.syncTableToPostgres(table);
    return item;
  }

  public update<T extends keyof DatabaseSchema>(table: T, id: string | number, item: any): boolean {
    const arr = this.data[table] as any[];
    const idx = arr.findIndex((x) => x.id === id || x.email === id);
    if (idx !== -1) {
      arr[idx] = { ...arr[idx], ...item, updatedAt: new Date().toISOString() };
      this.syncTableToPostgres(table);
      return true;
    }
    return false;
  }

  public delete<T extends keyof DatabaseSchema>(table: T, id: string | number): boolean {
    const arr = this.data[table] as any[];
    const lengthBefore = arr.length;
    this.data[table] = arr.filter((x) => x.id !== id && x.email !== id) as any;
    const success = this.data[table].length < lengthBefore;
    if (success) {
      this.deleteFromPostgres(table, id);
    }
    return success;
  }

  // Generate complete seed data from standard lists to pre-populate the business platform
  private getSeeds(): DatabaseSchema {
    return {
      users: [
        { id: "USR-001", name: "Louis Olosunde", email: "olosundelouis@gmail.com", role: "super_admin", status: "active", mfaEnabled: true },
        { id: "USR-002", name: "TAPCO Solar Admin", email: "tapcosolar@gmail.com", role: "super_admin", status: "active", mfaEnabled: true },
        { id: "USR-003", name: "Dr. Amadi Bello", email: "amadi@belloclinic.org", role: "readonly_auditor", status: "active", mfaEnabled: false },
        { id: "USR-004", name: "Operations Lead", email: "operations.lead@tapco.com", role: "operations_manager", status: "active", mfaEnabled: false }
      ],
      roles: [
        { id: "super_admin", name: "Super Admin", desc: "Universal System Controls & Security Audit Access" },
        { id: "ceo", name: "CEO / Executive", desc: "Financial Supervision & Global Corporate Telemetry" },
        { id: "operations_manager", name: "Operations Manager", desc: "Milestone Logistics, Resource Tracking, Field Surveys" },
        { id: "sales_manager", name: "Sales Manager", desc: "Lead Funnel Optimization, Booking Pipelines, CRM" },
        { id: "finance_manager", name: "Finance Manager", desc: "Financial Ledgers, Invoices, Outstandings, Escrow Audits" },
        { id: "engineering_manager", name: "Engineering Manager", desc: "System Design Reviews, Technical Audits, Asset Catalogs" },
        { id: "academy_manager", name: "Academy Manager", desc: "Solar Curriculum Director, Certification Pipelines" },
        { id: "instructor", name: "Academy Instructor", desc: "Lecture Schedulers, Student Evaluations, Class Notes" },
        { id: "customer_support", name: "Customer Support", desc: "Client Ticket Hubs, Live Chat Sinks, Client Logs" },
        { id: "store_manager", name: "Store Manager", desc: "Inventory Stock Limits, Order Fullfillments, Suppliers" },
        { id: "marketing_manager", name: "Marketing Manager", desc: "Growth Sizing Campaigns, Affiliate Networks, PR Media" },
        { id: "readonly_auditor", name: "Read-Only Auditor", desc: "Full Access to All Logs & Records - Zero Modification Access" }
      ],
      permissions: [
        { roleId: "super_admin", modules: ["dashboard", "crm", "sales", "projects", "products", "orders", "academy", "bookings", "finance", "support", "marketing", "reports", "security", "settings", "admin_management"] },
        { roleId: "ceo", modules: ["dashboard", "crm", "sales", "projects", "products", "orders", "academy", "bookings", "finance", "support", "marketing", "reports", "security", "settings", "admin_management"] },
        { roleId: "operations_manager", modules: ["dashboard", "projects", "bookings", "products", "orders", "reports"] },
        { roleId: "sales_manager", modules: ["dashboard", "crm", "sales", "bookings", "reports"] },
        { roleId: "finance_manager", modules: ["dashboard", "crm", "orders", "finance", "reports"] },
        { roleId: "engineering_manager", modules: ["dashboard", "projects", "products", "bookings", "reports"] },
        { roleId: "academy_manager", modules: ["dashboard", "academy", "reports"] },
        { roleId: "instructor", modules: ["academy"] },
        { roleId: "customer_support", modules: ["dashboard", "crm", "support", "bookings"] },
        { roleId: "store_manager", modules: ["dashboard", "products", "orders", "reports"] },
        { roleId: "marketing_manager", modules: ["dashboard", "marketing", "reports"] },
        { roleId: "readonly_auditor", modules: ["dashboard", "crm", "sales", "projects", "products", "orders", "academy", "bookings", "finance", "support", "marketing", "reports", "security"] }
      ],
      customers: [
        { id: "C-101", name: "Louis Olosunde", email: "olosundelouis@gmail.com", phone: "+234 812 3456", loc: "Abuja, NG", system: "12.4kW Array + 30kWh Battery", warranty: "5 Years left", spend: 27675000, tickets: 0, notes: "Corporate residential setup with net-metering readiness.", status: "Active", joinedDate: "2025-01-12" },
        { id: "C-102", name: "Evelyn Johnson", email: "evelyn.j@gmail.com", phone: "+234 809 9911", loc: "Lekki, Lagos", system: "8.2kW Hybrid + 15kWh Storage", warranty: "4 Years left", spend: 18300000, tickets: 1, notes: "Requires bi-annual dust cleaning service in July.", status: "Active", joinedDate: "2025-04-18" },
        { id: "C-103", name: "Federal School of Tech", email: "admin@fstech.edu.ng", phone: "+234 703 1111", loc: "Kaduna, NG", system: "45kW Microgrid Array", warranty: "9 Years left", spend: 81000000, tickets: 0, notes: "Flagship donor-sponsored 'Energy for Schools' installation.", status: "Active", joinedDate: "2024-11-05" }
      ],
      products: [
        { id: "PRD-201", name: "TAPCO Bifacial Monocrystalline Panel 550W", category: "panels", price: 420000, stock: 142, supplier: "JA Solar Ltd", alert: false, specs: { "Cell Type": "Bifacial Half-Cut Mono", "Warranty": "25 Years", "Dimensions": "2278x1134x35mm" } },
        { id: "PRD-202", name: "TAPCO Smart Hybrid Inverter 10kW MPPT", category: "inverters", price: 2775000, stock: 8, supplier: "Sunsynk Global", alert: true, specs: { "MPPT Channels": "2 Tracker Lines", "Efficiency": "98.4%", "Max PV Input": "13000W" } },
        { id: "PRD-203", name: "TAPCO LiFePO4 Powerwall Storage 15kWh", category: "batteries", price: 6300000, stock: 19, supplier: "BYD Energy", alert: false, specs: { "Chemistry": "LiFePO4 Lithium", "Cycles": "6000 Cycles @ 80% DOD", "BMS Support": "CAN/RS485" } },
        { id: "PRD-204", name: "Heavy-Duty UV Cabling & Combiner box", category: "accessories", price: 142500, stock: 4, supplier: "Local Grid Suppliers", alert: true, specs: { "Standard": "TUV Certified", "IP Rating": "IP67" } }
      ],
      categories: [
        { id: "panels", name: "Solar Panels", desc: "Tier-1 high-efficiency photovoltaics" },
        { id: "inverters", name: "Hybrid Inverters", desc: "Smart grid-tie synchronization hardware" },
        { id: "batteries", name: "Lithium Batteries", desc: "Long-cycle LiFePO4 power storage" },
        { id: "accessories", name: "Installation Accessories", desc: "Certified cables, mounts, earthing rods" }
      ],
      orders: [
        { id: "ORD-901", customer: "Louis Olosunde", amount: 4200000, status: "Shipped", date: "2026-06-29", carrier: "DHL Premium", payStatus: "Paid", trackingNumber: "DHL-NG-91024" },
        { id: "ORD-902", customer: "Kaduna Regional Dealer", amount: 23100000, status: "Processing", date: "2026-06-30", carrier: "GIG Logistics", payStatus: "Pending", trackingNumber: "GIG-KD-20124" }
      ],
      payments: [
        { id: "PAY-001", orderId: "ORD-901", amount: 4200000, method: "Bank Transfer", status: "Completed", txRef: "TXN-91280381023", date: "2026-06-29" },
        { id: "PAY-002", orderId: "ORD-902", amount: 23100000, method: "Corporate Finance Escrow", status: "Pending", txRef: "TXN-01931083012", date: "2026-06-30" }
      ],
      projects: [
        { id: "P-501", customer: "Prestige Estate", phase: "Testing", progress: 85, engineer: "Engr. Yusuf", cost: 63000000, timeline: "Due Jul 15", doc: "Estate_Blueprints.pdf", address: "Plot 12, Phase 2, Abuja", notes: "Estate microgrid with 15 smart powerwalls.", batterySpecs: "15x BYD 15kWh", panelSpecs: "120x TAPCO 550W Panels" },
        { id: "P-502", customer: "Chevron Housing", phase: "Design", progress: 25, engineer: "Engr. Louis", cost: 106500000, timeline: "Due Aug 30", doc: "Roof_Load_Specs.dwg", address: "Chevron Coop Close, Lekki", notes: "A symmetrical grid tie hybrid array over 20 terrace villas." },
        { id: "P-503", customer: "Federal Tech School", phase: "Commissioned", progress: 100, engineer: "Engr. Amadi", cost: 57000000, timeline: "Completed", doc: "Commissioning_Statement.pdf", address: "Main Campus, Kaduna", notes: "Supplies computing center and administrative corridors fully.", panelSpecs: "80x TAPCO 550W Panels", batterySpecs: "4x BYD 15kWh" }
      ],
      services: [
        { id: "srv-1", title: "Corporate Hybrid Microgrids", desc: "Custom designed large-scale battery storage and net-metering synchronization arrays for commercial buildings, factories, and schools.", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600", details: ["Industrial load profile studies", "Licensed structural engineering", "NEMSA regulatory documentation support"], benefit: "Cut diesel overhead expenses immediately by up to 75%.", isPublished: true },
        { id: "srv-2", title: "Luxury Residential Powerwalls", desc: "Noiseless, premium roof-integrated solar installations tailored to power duplexes, flats, and luxury apartments securely.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600", details: ["Smart load isolation", "Under-10ms battery failover times", "Advanced mobile system tracking"], benefit: "Enjoy pure, uncompromised 24/7 power with 10-year support lifecycle guarantees.", isPublished: true },
        { id: "srv-3", title: "Solar Agricultural Irrigation", desc: "High-yield solar-powered pump pits and agro-processing microgrids designed for multi-acre rural and urban farms.", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600", details: ["Submersible direct-drive solar pumps", "Smart automated scheduling", "Tough, weather-hardy mounts"], benefit: "Guarantees reliable water supplies across dry seasons with zero fuel bills.", isPublished: true }
      ],
      heroSlides: [
        { id: "slide-1", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80", label: "Modern Residential Rooftop Solar, Lagos", category: "Residential Solar", headline: "Noise-Free Luxury & Clean Power for Nigerian Homes", description: "Equip your duplex or estate with premium rooftop solar panels and intelligent hybrid systems. Escape grid outages and enjoy seamless 24/7 electricity.", secondaryCta: "Explore Home Solar", isPublished: true, isArchived: false },
        { id: "slide-2", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80", label: "Corporate Commercial Complex, Victoria Island", category: "Commercial & Industrial Solar", headline: "Scale Your Business With High-Yield Solar Microgrids", description: "Power corporate offices, factories, and warehouses in Lagos or Abuja. Reduce dependence on costly diesel generators by up to 75% with zero-emission carports and arrays.", secondaryCta: "Explore Enterprise Solutions", isPublished: true, isArchived: false },
        { id: "slide-3", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80", label: "Solar Irrigation Farm, Northern Nigeria", category: "Agricultural Solar", headline: "Boost Harvest Yields with Solar-Powered Irrigation", description: "Modernize farms across Northern and Western Nigeria. TAPCO delivers smart agricultural irrigation and agro-processing microgrids designed for high operational uptime.", secondaryCta: "Explore Agri-Solar", isPublished: true, isArchived: false }
      ],
      testimonials: [
        { id: "test-1", name: "Alhaji Bello Gwarzo", role: "MD, Gwarzo Agro-Allied Ltd", content: "TAPCO turned our 15-hectare tomato farm in Kano into a year-round goldmine. The solar irrigation pump design is simple, efficient, and requires zero daily diesel expense. Phenomenal certified team!", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
        { id: "test-2", name: "Mrs. Chioma Nwachukwu", role: "Resident, Lekki County Estate", content: "After months of generator noise and sky-high petrol bills, we migrated our home to a 10kVA TAPCO hybrid system. It has run for 14 months without a single millisecond of outage. Life-changing!", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" }
      ],
      teamMembers: [
        { id: "TM-1", name: "Engr. Louis Olosunde", role: "Chief Architect", department: "Engineering", email: "olosundelouis@gmail.com", phone: "09059375492", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", permissions: ["all"] },
        { id: "TM-1b", name: "TAPCO Solar Administrator", role: "Co-Administrator", department: "Executive", email: "tapcosolar@gmail.com", phone: "08120000000", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", permissions: ["all"] },
        { id: "TM-2", name: "Alhaji Ibrahim Musa", role: "Managing Director", department: "Executive", email: "musa@solartech.ng", phone: "08031112222", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop", permissions: ["finance", "crm"] }
      ],
      blogPosts: [
        { id: "blog-1", title: "Demystifying Grid-Tie vs Hybrid Solar Systems in Nigeria", excerpt: "An in-depth technical analysis on selecting the right inverter topology for Nigerian homes to achieve maximum fuel displacement and longest battery shelf life.", content: "### Selecting the Right Inverter Topology\nGrid-tie systems synchronize directly with the utility grid to offset your active load. However, when grid power goes down, grid-tie systems must shut off instantly as a safety precaution... Hybrid systems, on the other hand, couple solar arrays with deep-cycle lithium storage...", author: "Engr. Louis Olosunde", category: "Solar Guides", readTime: "8 min read", date: "June 25, 2026", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600", slug: "grid-tie-vs-hybrid-nigeria" },
        { id: "blog-2", title: "Reducing Diesel Generator Operating Costs by 75% for Offices", excerpt: "A corporate roadmap demonstrating how hybrid energy arrays can replace noisy generators, reduce maintenance intervals, and yield immediate tax writeoffs.", content: "### A Corporate Solar Roadmap\nFor businesses operating in metropolitan capitals, generator maintenance and diesel purchases consume up to 40% of standard operational margins. Transitioning to a hybrid system yields substantial immediate tax writeoffs...", author: "Alhaji Ibrahim Musa", category: "Commercial Power", readTime: "12 min read", date: "July 01, 2026", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600", slug: "reduce-diesel-generator-costs" }
      ],
      resources: [
        { id: "res-1", name: "TAPCO Home Sizing Spreadsheet.xlsx", url: "#", category: "Engineering Manuals" },
        { id: "res-2", name: "NEMSA Installation Guide 2026.pdf", url: "#", category: "Compliance & Safety" }
      ],
      galleryImages: [
        { id: "gal-1", name: "Rooftop_Solar_Lagos.jpg", url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600", folder: "Home Gallery" },
        { id: "gal-2", name: "School_Installation_Kaduna.jpg", url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600", folder: "Industrial & Institutional" }
      ],
      videos: [
        { id: "vid-1", title: "Commissioning of Kaduna School Microgrid", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
      ],
      solarPackages: [
        { id: "pkg-1", name: "TAPCO Starter (1kVA)", usdPrice: 780, capacity: "1kVA / 1kW", price: 1250000, description: "Ideal for small apartments, security kiosks, or basic power setups. Keeps your lights, fans, and routers running uninterrupted.", specs: { panels: "2x 350W Monocrystalline Panels", inverter: "1kVA Smart Hybrid Pure Sine Wave Inverter", battery: "12V 100Ah LiFePO4 Lithium Battery", accessories: "TAPCO High-Grade Roof Mounting Rack, 20m MC4 Solar Cable, DC Disconnect Box" }, suitableFor: ["Small apartments / flats", "Off-grid security cabins", "Emergency lighting system"], recommendedAppliances: ["5x LED Bulbs (10W each)", "2x DC Ceiling Fans (40W each)", "1x Internet Router (15W)", "1x Laptop Charger (65W)", "1x LED TV (60W)"], installationTime: "24 - 48 Hours", warranty: "3 Years Inverter, 25 Years Panels, 5 Years Battery", recommendedUse: "Basic Power Backup" },
        { id: "pkg-3", name: "TAPCO Classic (3kVA)", usdPrice: 2250, capacity: "3kVA / 3kW", price: 3600000, description: "The perfect balance for medium-sized homes. Easily powers standard household appliances including refrigerators, LED TVs, and laptops.", specs: { panels: "6x 450W Premium Monocrystalline Panels", inverter: "3kVA Hybrid Smart Inverter with MPPT", battery: "24V 150Ah LiFePO4 Lithium Battery Module", accessories: "Wind-Resistant Mounting Brackets, 30m Dual Solar Cable, DC/AC Surge Protection" }, suitableFor: ["2-3 Bedroom standard residential homes", "Small retail shops or pharmacy stores", "Branch offices & medical consultation rooms"], recommendedAppliances: ["10x LED Bulbs (10W each)", "4x Ceiling Fans (50W each)", "1x Energy-Star Refrigerator (150W)", "2x LED TVs (75W each)", "1x Microwave (700W - intermittent)", "2x Laptops / Phones (100W)"], installationTime: "24 - 48 Hours", warranty: "3 Years Inverter, 25 Years Panels, 5 Years Battery", recommendedUse: "Whole-House Basic" },
        { id: "pkg-5", name: "TAPCO Premium (5kVA)", usdPrice: 3625, capacity: "5kVA / 5kW", price: 5800000, description: "Our most popular home system. Offers complete energy independence with heavy-duty capacity to comfortably run washing machines, water pumps, and heavy appliances.", specs: { panels: "10x 450W Premium Monocrystalline Panels", inverter: "5kVA Heavy-Duty Hybrid Smart Inverter", battery: "48V 100Ah LiFePO4 Powerwall Storage Unit", accessories: "Wind-Resistant Galvanized Mounting Racks, 50m Heavy MC4 Cabling, DC/AC Isolation Safety Panels" }, suitableFor: ["4-5 Bedroom residential homes", "Supermarkets, boutique hotels, and retail complexes", "SME offices with servers and multiple workstations"], recommendedAppliances: ["15x LED Bulbs (10W each)", "6x Ceiling Fans (50W each)", "1x Deep Freezer (250W)", "1x Energy-Star Refrigerator (200W)", "1x Inverter AC (1.5 HP - during peak solar hours)", "1x Water Pump (1 HP - intermittent)", "4x Laptops & IT Stations"], installationTime: "48 Hours", warranty: "5 Years Inverter, 25 Years Panels, 5 Years Battery", recommendedUse: "Full Energy Autonomy" }
      ],
      quotations: [],
      bookings: [
        { id: "B-701", type: "Site Inspection", name: "Louis Olosunde", date: "2026-07-03", time: "11:00 AM", loc: "Lekki Lagos", status: "Completed" },
        { id: "B-702", type: "Maintenance Visit", name: "Evelyn Johnson", date: "2026-07-05", time: "02:30 PM", loc: "Lagos Victoria Island", status: "Confirmed" }
      ],
      courses: [
        { id: "course-1", title: "Off-Grid Solar System Engineering & Load Sizing", category: "Engineering", duration: "6 Weeks (Self-Paced)", level: "Intermediate", lessons: 12, rating: 4.9, students: 142, desc: "Master the complete sizing pipeline for hybrid residential PV arrays, covering shadow profiling, load schedulers, and battery bank layouts under NEMSA guidelines.", outline: ["Electrical Fundamentals & Power Laws", "Understanding Solar Insolation & Peak Sun Hours", "Comprehensive Load Scheduling & Appliance Profiles", "Inverter Selection: Pure Sine Wave vs Modified vs Hybrid", "Sizing Lithium LiFePO4 vs Lead-Acid Battery Storage Banks", "Photovoltaic Panel Configurations: Series vs Parallel Strings", "Solar Charge Controllers: MPPT vs PWM Efficiencies", "System Protection: AC/DC SPD, Breakers, and Grounding", "Completing NEMSA Installation Compliance Audits", "3D CAD Modeling for Shading Profiles", "Writing Professional Project Proposals", "Final Academy Capstone Engineering Review"] },
        { id: "course-2", title: "Advanced Grid-Tie Solar Synchronizations", category: "Advanced", duration: "8 Weeks", level: "Expert", lessons: 12, rating: 4.8, students: 86, desc: "Master the complexities of synchronizing large-scale industrial arrays with utility power grids and complex three-phase industrial loading generators.", outline: ["Three-Phase Industrial Load Balancing", "Anti-Islanding Safety Protocols & Directives", "Grid-Tie Inverter Configuration & Phase Alignment", "Industrial Net-Metered Systems Setup", "Zero-Export Limitation and Export Control Meters", "CT Coil Installation and Directional Current Profiling", "Configuring Solar/Diesel Generator Microgrid Hubs", "Power Factor Correction and Harmonic Filtering", "Utility Interconnection Applications and Nigeria Grid Codes", "Testing Isolation Transformers and Ground-Fault Arrays", "Remote SCADA Monitoring and Industrial Modbus Setup", "Advanced Utility Sync Capstone Evaluation"] }
      ],
      lessons: [
        { id: "les-1-1", courseId: "course-1", title: "Electrical Fundamentals & Power Laws", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "15m", completedBy: ["olosundelouis@gmail.com"] },
        { id: "les-1-2", courseId: "course-1", title: "Understanding Solar Insolation & Peak Sun Hours", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "18m", completedBy: ["olosundelouis@gmail.com"] }
      ],
      students: [
        { email: "olosundelouis@gmail.com", name: "Louis Olosunde", progress: 100, score: "100%", status: "Graduated", enrolledDate: "2026-01-05", completedLessons: 24, totalLessons: 24 },
        { email: "musa@solartech.ng", name: "Ibrahim Musa", progress: 50, score: "N/A", status: "In Progress", enrolledDate: "2026-05-10", completedLessons: 12, totalLessons: 24 }
      ],
      instructors: [
        { id: "inst-1", name: "Engr. Louis Olosunde", role: "Solar Chief Architect", bio: "Over 12 years designing utility-scale hybrid grids in West Africa." }
      ],
      certificates: [
        { id: "cert-991", studentEmail: "olosundelouis@gmail.com", studentName: "Louis Olosunde", courseTitle: "Off-Grid Solar System Engineering & Load Sizing", issueDate: "2026-02-12", code: "TAPCO-ACAD-2026-0912" }
      ],
      supportTickets: [
        { id: "TK-41", subject: "Inverter WiFi Synchronization Issue", cust: "Louis Olosunde", priority: "Medium", status: "Open", date: "2 hours ago", messages: [{ sender: "client", msg: "Hello! My inverter screen states fault code F56. What should I do?", time: "2 hours ago" }, { sender: "support", msg: "F56 represents DC bus overcurrent. Please shut down your battery switch for 10 seconds, then reboot.", time: "1.5 hours ago" }] },
        { id: "TK-42", subject: "BMS Calibration & Balancing Request", cust: "Evelyn Johnson", priority: "High", status: "In Progress", date: "1 day ago", messages: [{ sender: "client", msg: "Hi, one of my lithium cells is reading slightly lower voltage than the other three.", time: "1 day ago" }] }
      ],
      popupMessages: [
        { id: "pop-1", title: "NEMSA Clean Energy Grant", headline: "TAPCO Schools Intervention Grant 2026", description: "Nominations are now officially open for primary and secondary schools in Lagos and Abuja. Apply for up to 50% installation subsidies for green schooling infrastructure.", buttonText: "Nominate a School", buttonLink: "#", isActive: true, targetPages: ["home"], closeBehaviour: "once" }
      ],
      settings: {
        companyName: "TAPCO Solar Energy Solutions",
        supportEmail: "support@tapcosolar.com",
        contactPhone: "+234 812 000 0000",
        address: "Plot 105, Corporate Boulevard, Lekki, Lagos, Nigeria",
        taxRate: 0.075,
        defaultWarranty: "5 Years"
      },
      notifications: [
        { id: "N1", title: "DC Overvoltage Surge Warning", body: "Lekki Phase II microgrid inverter array 3 reports shade bypass failure.", time: "12m ago" },
        { id: "N2", title: "New Training Course Signup", body: "Louis Olosunde registered for class Off-Grid Solar System Engineering.", time: "44m ago" },
        { id: "N3", title: "Warehouse Stock Alert", body: "LiFePO4 BYD Powerwall units dropped below local buffer capacity threshold (4 left).", time: "2h ago" }
      ],
      auditLogs: [
        { id: "LOG-5001", who: "olosundelouis@gmail.com", action: "User Creation", date: "Today, 08:30 AM", ip: "197.210.64.22", device: "MacBook Pro M3", browser: "Chrome v126", location: "Abuja, NG", status: "SUCCESS" },
        { id: "LOG-5002", who: "tapcosolar@gmail.com", action: "Co-Admin Activated", date: "Today, 08:32 AM", ip: "197.210.64.22", device: "MacBook Pro M3", browser: "Chrome v126", location: "Abuja, NG", status: "SUCCESS" },
        { id: "LOG-5003", who: "olosundelouis@gmail.com", action: "Login Success", date: "Yesterday, 09:45 AM", ip: "197.210.88.94", device: "iPhone 15 Pro", browser: "Safari v17.4", location: "Lagos, NG", status: "SUCCESS" }
      ],
      coupons: [
        { code: "SUNSOLAR10", discount: 10, isActive: true },
        { code: "TAPCOGREEN15", discount: 15, isActive: true }
      ],
      leads: [],
      mediaFiles: [],
      seoSettings: []
    };
  }
}

export const db = new Database();
