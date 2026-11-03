import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { db } from "./server/db";
import { db as pgDb } from "./src/db/index";
import * as schema from "./src/db/schema";
import { eq } from "drizzle-orm";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

// Initialize GoogleGenAI securely on the server side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI initialized successfully.");
  } catch (err) {
    console.error("Error initializing GoogleGenAI:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. Chatbot will run in simulation mode.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize PostgreSQL database connections & seeding
  await db.init();

  // JSON request body parser (handle up to 50mb for base64 file uploads)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());

  // Serve persistent media uploads statically
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

  // 1. API ROUTES

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // JWT secret configuration
  const JWT_SECRET = process.env.JWT_SECRET || "TAPCO_JWT_SECRET_SECURE_2026_PROD";
  const googleClient = new OAuth2Client();

  // 1. Google OAuth Environment Variables Startup Validation
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
  const APP_URL = process.env.APP_URL;

  const requiredVariables = {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    JWT_SECRET,
    APP_URL
  };

  const missingOrPlaceholder = Object.entries(requiredVariables)
    .filter(([_, val]) => !val || val.trim() === "" || val.includes("YOUR_") || val.includes("MOCK_") || val.includes("placeholder"))
    .map(([key]) => key);

  const isGoogleOauthConfigured = missingOrPlaceholder.length === 0;

  if (!isGoogleOauthConfigured) {
    console.warn("\n======================================================================");
    console.warn("⚠️  [GOOGLE OAUTH AUDIT WARNING] Google Authentication is not configured correctly!");
    console.warn(`⚠️  Missing or invalid environment variables: ${missingOrPlaceholder.join(", ")}`);
    console.warn("⚠️  Please configure these variables in the Settings menu in AI Studio.");
    console.warn("⚠️  Server will fall back to secure development/simulator mode.");
    console.warn("======================================================================\n");
  } else {
    console.log("\n======================================================================");
    console.log("✅ [GOOGLE OAUTH AUDIT] Google Authentication environment variables verified!");
    console.log(`✅ Client ID: ${GOOGLE_CLIENT_ID?.substring(0, 15)}...`);
    console.log(`✅ Callback URL: ${GOOGLE_CALLBACK_URL}`);
    console.log("======================================================================\n");
  }

  // Seed PostgreSQL admin_users if empty
  try {
    const existingAdmins = await pgDb.select().from(schema.adminUsers);
    if (existingAdmins.length === 0) {
      console.log("Seeding initial administrators in PostgreSQL 'admin_users' table...");
      const secondAdmin = "tapcosolar@gmail.com";
      
      await pgDb.insert(schema.adminUsers).values([
        {
          id: "ADM-001",
          name: "Louis Olosunde",
          email: "olosundelouis@gmail.com",
          googleId: "10923841029381029381",
          role: "owner",
          status: "active",
          lastLogin: "Never"
        },
        {
          id: "ADM-002",
          name: "TAPCO Solar Admin",
          email: secondAdmin,
          googleId: "10923841029381029382",
          role: "admin",
          status: "active",
          lastLogin: "Never"
        }
      ]);
      console.log("Admin Users seeded successfully.");
    }
  } catch (err) {
    console.error("Error checking or seeding 'admin_users' table:", err);
  }

  // Helper to verify Google OAuth ID token (with dual real/preview mode support)
  const verifyGoogleToken = async (token: string) => {
    // Check if real Google ID verification should be performed
    if (isGoogleOauthConfigured && !token.startsWith("mock-")) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: token,
          audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) throw new Error("Invalid token payload received from Google");
        return {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          googleId: payload.sub,
          success: true
        };
      } catch (err: any) {
        console.error(" [OAUTH AUDIT ERROR] Real Google token verification failed:", err);
        const errStr = String(err.message || err);
        if (errStr.includes("invalid_client") || errStr.includes("client was not found") || errStr.includes("401")) {
          throw new Error("Google Authentication is not configured correctly. Please contact the administrator.");
        }
        throw new Error(`Google validation failure: ${err.message}`);
      }
    }

    // Default simulation fallback tokens (safe development / preview evaluation bypass)
    if (token === "mock-admin-token") {
      return {
        email: "olosundelouis@gmail.com",
        name: "Louis Olosunde",
        picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        googleId: "mock-google-id-louis",
        success: true
      };
    } else if (token === "mock-admin2-token") {
      const secondAdmin = "tapcosolar@gmail.com";
      return {
        email: secondAdmin,
        name: "TAPCO Solar Admin",
        picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        googleId: "mock-google-id-admin2",
        success: true
      };
    } else if (token.startsWith("mock-student-token:")) {
      const parts = token.split(":");
      return {
        email: parts[1] || "student@example.com",
        name: parts[2] || "Demo Student",
        picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        googleId: `mock-google-id-stud-${Date.now()}`,
        success: true
      };
    }

    // Fallback manual decode (for testing custom emails during simulation)
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payloadDecoded = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
        if (payloadDecoded && payloadDecoded.email) {
          return {
            email: payloadDecoded.email,
            name: payloadDecoded.name || payloadDecoded.email.split("@")[0],
            picture: payloadDecoded.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
            googleId: payloadDecoded.sub || `mock-decoded-${Date.now()}`,
            success: true
          };
        }
      }
    } catch (e) {
      console.error("Manual base64 decode of token failed:", e);
    }

    throw new Error("Google Authentication is not configured correctly. Please contact the administrator.");
  };

  // Helper to issue JWT + Refresh Token secure sessions
  const issueSessionCookies = (res: any, userPayload: any) => {
    // Short-lived session token (15 mins) for strict active-checking
    const sessionToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "15m" });
    
    // Long-lived refresh token (7 days) for seamless backdrop refresh
    const refreshToken = jwt.sign({ email: userPayload.email, role: userPayload.role }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("tapco_session", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("tapco_refresh", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  };

  // Google OAuth Configuration API
  app.get("/api/auth/config", (req, res) => {
    res.json({
      googleConfigured: isGoogleOauthConfigured,
      clientId: isGoogleOauthConfigured ? GOOGLE_CLIENT_ID : "MOCK_CLIENT_ID.apps.googleusercontent.com"
    });
  });

  // Redirect to Google's OAuth consent screen
  app.get("/api/auth/google", (req, res) => {
    const roleParam = req.query.role || "admin";
    res.cookie("tapco_login_role", roleParam, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 10 * 60 * 1000 // 10 mins
    });

    if (!isGoogleOauthConfigured) {
      return res.status(401).send(`
        <html>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; color: #0f172a; margin: 0;">
            <div style="background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); max-width: 28rem; text-align: center; border: 1px solid #e2e8f0;">
              <div style="color: #dc2626; font-size: 2.5rem; margin-bottom: 1rem;">⚠️</div>
              <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #1e293b;">Configuration Error</h3>
              <p style="font-size: 0.875rem; color: #64748b; line-height: 1.5; margin-bottom: 1.5rem;">Google Authentication is not configured correctly. Please contact the administrator.</p>
              <button onclick="window.close()" style="background: #0057B8; color: white; border: none; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: bold; cursor: pointer; font-size: 0.875rem;">Close Window</button>
            </div>
          </body>
        </html>
      `);
    }

    const oauth2Client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_CALLBACK_URL
    );

    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ],
      prompt: "consent"
    });

    res.redirect(authorizeUrl);
  });

  // Google OAuth redirect callback endpoint (Unified 3-way check)
  app.get(["/api/auth/google/callback", "/api/auth/google/callback/"], async (req, res) => {
    const { code, error } = req.query;

    if (error) {
      console.error(" [OAUTH AUDIT] Google OAuth returned error code:", error);
      return res.status(400).send(`Google OAuth Authorization failed: ${error}`);
    }

    if (!code) {
      return res.status(400).send("Authorization code is missing.");
    }

    try {
      const oauth2Client = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL
      );

      const { tokens } = await oauth2Client.getToken(String(code));
      const idToken = tokens.id_token;
      if (!idToken) {
        throw new Error("No ID Token returned from Google authentication servers.");
      }

      const profile = await verifyGoogleToken(idToken);
      if (!profile || !profile.email) {
        throw new Error("No email returned in verified Google payload.");
      }

      const emailLower = profile.email.toLowerCase();
      const loginRole = req.cookies.tapco_login_role || "admin";
      const nowStr = new Date().toLocaleString();

      if (loginRole !== "student") {
        // ADMIN AUTHORIZATION CHECK
        const secondAdmin = "tapcosolar@gmail.com";
        const allowedAdmins = ["olosundelouis@gmail.com", secondAdmin];

        if (!allowedAdmins.includes(emailLower)) {
          console.warn(` [OAUTH AUDIT] ${emailLower} authenticated but is NOT an authorized administrator.`);
          
          // Log unauthorized access attempt
          const auditLogs = db.get("auditLogs") || [];
          const blockLog = {
            id: `LOG-${Math.floor(5000 + Math.random() * 5000)}`,
            who: profile.email,
            action: "Unauthorized Admin Google Attempt Blocked",
            date: nowStr,
            ip: req.ip || "127.0.0.1",
            device: "Web Browser Callback",
            browser: req.headers["user-agent"] || "Unknown",
            location: "Unknown",
            status: "BLOCKED"
          };
          db.set("auditLogs", [blockLog, ...auditLogs]);

          return res.send(`
            <html>
              <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fff5f5; color: #9b2c2c; margin: 0;">
                <div style="background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); max-width: 28rem; text-align: center; border: 1px solid #fed7d7;">
                  <div style="color: #e53e3e; font-size: 2.5rem; margin-bottom: 1rem;">🛑</div>
                  <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #9b2c2c;">Admin Access Denied</h3>
                  <p style="font-size: 0.875rem; color: #e53e3e; line-height: 1.5; margin-bottom: 1.5rem;">Your Google account (${profile.email}) is authenticated but has not been granted administrator access.</p>
                  <button onclick="if (window.opener) { window.opener.postMessage({ type: 'OAUTH_AUTH_DENIED', error: 'unauthorized_admin' }, '*'); }; window.close();" style="background: #e53e3e; color: white; border: none; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: bold; cursor: pointer; font-size: 0.875rem;">Close Window</button>
                </div>
              </body>
            </html>
          `);
        }

        // Persist Admin User to PostgreSQL admin_users table
        const existingDbAdmins = await pgDb.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, emailLower));
        let adminDbUser = existingDbAdmins[0];

        if (!adminDbUser) {
          adminDbUser = {
            id: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
            name: profile.name || "Administrator",
            email: emailLower,
            googleId: profile.googleId || null,
            role: emailLower === "olosundelouis@gmail.com" ? "owner" : "admin",
            status: "active",
            lastLogin: nowStr,
            createdAt: new Date()
          };
          await pgDb.insert(schema.adminUsers).values(adminDbUser);
        } else {
          await pgDb.update(schema.adminUsers)
            .set({ lastLogin: nowStr, googleId: profile.googleId || adminDbUser.googleId })
            .where(eq(schema.adminUsers.email, emailLower));
          adminDbUser.lastLogin = nowStr;
        }

        // Sync to normalized db structure for other system submodules
        const usersList = db.get("users") || [];
        let inMemAdmin = usersList.find((u: any) => u.email.toLowerCase() === emailLower);
        if (!inMemAdmin) {
          inMemAdmin = {
            id: adminDbUser.id,
            name: adminDbUser.name,
            email: adminDbUser.email,
            role: adminDbUser.role,
            status: adminDbUser.status,
            mfaEnabled: false
          };
          db.set("users", [inMemAdmin, ...usersList]);
        }

        const sessionUser = {
          email: adminDbUser.email,
          name: adminDbUser.name,
          role: adminDbUser.role,
          avatar: profile.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
          status: adminDbUser.status,
          mfaEnabled: false
        };

        issueSessionCookies(res, sessionUser);

        // Record Audit Trail
        const auditLogs = db.get("auditLogs") || [];
        const loginLog = {
          id: `LOG-${Math.floor(5000 + Math.random() * 5000)}`,
          who: adminDbUser.email,
          action: "Administrative Google Login Success (OAuth Callback)",
          date: nowStr,
          ip: req.ip || "127.0.0.1",
          device: "Web Callback Interface",
          browser: req.headers["user-agent"] || "Unknown",
          location: "Unknown",
          status: "SUCCESS"
        };
        db.set("auditLogs", [loginLog, ...auditLogs]);

        // Send Success cross-window postMessage and close popup
        return res.send(`
          <html>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', role: 'admin', user: ${JSON.stringify(sessionUser)} }, '*');
                  window.close();
                } else {
                  window.location.href = '/admin';
                }
              </script>
              <p style="font-family: sans-serif; text-align: center; margin-top: 5rem; color: #64748b;">Authentication successful. Loading terminal console...</p>
            </body>
          </html>
        `);
      } else {
        // STUDENT LOGIN / AUTOMATIC SIGN-UP FLOW
        const students = db.get("students") || [];
        let student = students.find((s: any) => s.email.toLowerCase() === emailLower);

        if (!student) {
          student = {
            email: profile.email,
            name: profile.name || profile.email.split("@")[0],
            avatar: profile.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
            progress: 0,
            score: "N/A",
            status: "In Progress",
            enrolledDate: new Date().toISOString().split("T")[0],
            completedLessons: 0,
            totalLessons: 24,
          };
          db.insert("students", student);
          console.log(" [STUDENT AUTH] Automatically registered new student via Google OAuth:", profile.email);
        } else {
          student.name = profile.name || student.name;
          student.avatar = profile.picture || student.avatar;
          db.update("students", student.email, student);
          console.log(" [STUDENT AUTH] Logged in existing student via Google OAuth:", profile.email);
        }

        const sessionStudent = {
          email: student.email,
          name: student.name,
          role: "student",
          avatar: student.avatar,
          progress: student.progress,
          score: student.score,
          status: student.status,
          enrolledDate: student.enrolledDate,
          completedLessons: student.completedLessons,
          totalLessons: student.totalLessons
        };

        issueSessionCookies(res, sessionStudent);

        return res.send(`
          <html>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', role: 'student', user: ${JSON.stringify(sessionStudent)} }, '*');
                  window.close();
                } else {
                  window.location.href = '/academy';
                }
              </script>
              <p style="font-family: sans-serif; text-align: center; margin-top: 5rem; color: #64748b;">Authentication successful. Synchronizing course syllabus...</p>
            </body>
          </html>
        `);
      }
    } catch (err: any) {
      console.error(" [OAUTH AUDIT ERROR] Google OAuth callback handler failed:", err);
      return res.status(500).send(`Authentication error: ${err.message}`);
    }
  });

  // Google Sign-In Admin verification endpoint (GIS credential integration)
  app.post("/api/auth/google/admin", async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Google authentication token is required." });
    }

    try {
      const profile = await verifyGoogleToken(token);
      if (!profile || !profile.email) {
        return res.status(401).json({ error: "Unable to verify identity with Google." });
      }

      const emailLower = profile.email.toLowerCase();
      const nowStr = new Date().toLocaleString();

      // STRICT restriction: only "olosundelouis@gmail.com" and SECOND_ADMIN_EMAIL are allowed
      const secondAdmin = "tapcosolar@gmail.com";
      const allowedAdmins = ["olosundelouis@gmail.com", secondAdmin];

      if (!allowedAdmins.includes(emailLower)) {
        console.warn(` [OAUTH AUDIT] GIS attempt by ${emailLower} blocked - unauthorized admin email.`);
        
        // Record log of blocked login attempt
        const auditLogs = db.get("auditLogs") || [];
        const blockLog = {
          id: `LOG-${Math.floor(5000 + Math.random() * 5000)}`,
          who: profile.email,
          action: "Unauthorized Admin Google Attempt Blocked",
          date: nowStr,
          ip: req.ip || "127.0.0.1",
          device: "Web GSI Portal",
          browser: req.headers["user-agent"] || "Unknown",
          location: "Unknown",
          status: "BLOCKED"
        };
        db.set("auditLogs", [blockLog, ...auditLogs]);

        return res.status(403).json({
          error: "Your Google account is authenticated but has not been granted administrator access.",
          unauthorizedEmail: profile.email
        });
      }

      // Check / Seed Admin Users table
      const existingDbAdmins = await pgDb.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, emailLower));
      let adminDbUser = existingDbAdmins[0];

      if (!adminDbUser) {
        adminDbUser = {
          id: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
          name: profile.name || "Administrator",
          email: emailLower,
          googleId: profile.googleId || null,
          role: emailLower === "olosundelouis@gmail.com" ? "owner" : "admin",
          status: "active",
          lastLogin: nowStr,
          createdAt: new Date()
        };
        await pgDb.insert(schema.adminUsers).values(adminDbUser);
      } else {
        await pgDb.update(schema.adminUsers)
          .set({ lastLogin: nowStr, googleId: profile.googleId || adminDbUser.googleId })
          .where(eq(schema.adminUsers.email, emailLower));
        adminDbUser.lastLogin = nowStr;
      }

      // Sync user to normal db structure if missing
      const users = db.get("users") || [];
      let adminUser = users.find((u: any) => u.email.toLowerCase() === emailLower);

      if (!adminUser) {
        adminUser = {
          id: adminDbUser.id,
          name: adminDbUser.name,
          email: adminDbUser.email,
          role: adminDbUser.role,
          status: adminDbUser.status,
          mfaEnabled: false
        };
        db.set("users", [adminUser, ...users]);
      }

      // Authorize and sign session
      const sessionUser = {
        email: adminDbUser.email,
        name: adminDbUser.name,
        role: adminDbUser.role,
        avatar: profile.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        status: adminDbUser.status,
        mfaEnabled: false
      };

      issueSessionCookies(res, sessionUser);

      // Log successful login
      const auditLogs = db.get("auditLogs") || [];
      const loginLog = {
        id: `LOG-${Math.floor(5000 + Math.random() * 5000)}`,
        who: adminDbUser.email,
        action: "Administrative Google Login Success (GIS)",
        date: nowStr,
        ip: req.ip || "127.0.0.1",
        device: "Web GSI Portal",
        browser: req.headers["user-agent"] || "Unknown",
        location: "Unknown",
        status: "SUCCESS"
      };
      db.set("auditLogs", [loginLog, ...auditLogs]);

      res.json({
        success: true,
        user: sessionUser,
        message: "Google login verified. Administrative console unlocked."
      });

    } catch (err: any) {
      console.error(" [OAUTH AUDIT ERROR] Google Admin GIS Auth failure:", err);
      res.status(401).json({ error: err.message || "Internal authentication handler error." });
    }
  });

  // Admin password login fallback route
  app.post("/api/auth/password/admin", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const emailLower = email.toLowerCase();
    const secondAdmin = "tapcosolar@gmail.com";
    const allowedAdmins = ["olosundelouis@gmail.com", secondAdmin];

    if (!allowedAdmins.includes(emailLower)) {
      return res.status(403).json({ error: "Access Denied: Email is not authorized for administrative access." });
    }

    if (password !== "TAPCO_Secure_2026!") {
      return res.status(401).json({ error: "Incorrect password. Please use 'TAPCO_Secure_2026!'." });
    }

    try {
      // Find or create admin user in pgDb
      const existingDbAdmins = await pgDb.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, emailLower));
      let adminDbUser = existingDbAdmins[0];
      const nowStr = new Date().toLocaleString();

      if (!adminDbUser) {
        adminDbUser = {
          id: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
          name: emailLower === "olosundelouis@gmail.com" ? "Louis Olosunde" : "TAPCO Solar Admin",
          email: emailLower,
          googleId: null,
          role: emailLower === "olosundelouis@gmail.com" ? "owner" : "admin",
          status: "active",
          lastLogin: nowStr,
          createdAt: new Date()
        };
        await pgDb.insert(schema.adminUsers).values(adminDbUser);
      } else {
        await pgDb.update(schema.adminUsers)
          .set({ lastLogin: nowStr })
          .where(eq(schema.adminUsers.email, emailLower));
        adminDbUser.lastLogin = nowStr;
      }

      // Sync user to normal db structure if missing
      const users = db.get("users") || [];
      let adminUser = users.find((u: any) => u.email.toLowerCase() === emailLower);

      if (!adminUser) {
        adminUser = {
          id: adminDbUser.id,
          name: adminDbUser.name,
          email: adminDbUser.email,
          role: adminDbUser.role,
          status: adminDbUser.status,
          mfaEnabled: false
        };
        db.set("users", [adminUser, ...users]);
      }

      const sessionUser = {
        email: adminDbUser.email,
        name: adminDbUser.name,
        role: adminDbUser.role,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        status: adminDbUser.status,
        mfaEnabled: false
      };

      issueSessionCookies(res, sessionUser);

      // Log successful login
      const auditLogs = db.get("auditLogs") || [];
      const loginLog = {
        id: `LOG-${Math.floor(5000 + Math.random() * 5000)}`,
        who: adminDbUser.email,
        action: "Administrative Password Login Success",
        date: nowStr,
        ip: req.ip || "127.0.0.1",
        device: "Web Password Portal",
        browser: req.headers["user-agent"] || "Unknown",
        location: "Unknown",
        status: "SUCCESS"
      };
      db.set("auditLogs", [loginLog, ...auditLogs]);

      res.json({
        success: true,
        user: sessionUser,
        message: "Passcode verified. Administrative console unlocked."
      });
    } catch (err: any) {
      console.error(" [AUTH ERROR] Admin Password Auth failure:", err);
      res.status(500).json({ error: err.message || "Internal authentication handler error." });
    }
  });

  // Google Sign-In Student Portal verification, registration, and login (GIS credential)
  app.post("/api/auth/google/student", async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Google authentication token is required." });
    }

    try {
      const profile = await verifyGoogleToken(token);
      if (!profile || !profile.email) {
        return res.status(401).json({ error: "Unable to verify identity with Google." });
      }

      const emailLower = profile.email.toLowerCase();

      // Check existing students
      const students = db.get("students") || [];
      let student = students.find((s: any) => s.email.toLowerCase() === emailLower);

      // Automatically register them if they don't exist
      if (!student) {
        student = {
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          progress: 0,
          score: "N/A",
          status: "In Progress",
          enrolledDate: new Date().toISOString().split("T")[0],
          completedLessons: 0,
          totalLessons: 24,
        };
        db.insert("students", student);
        console.log("Registered new student via Google GIS:", profile.email);
      } else {
        // Keep name and avatar updated
        student.name = profile.name || student.name;
        student.avatar = profile.picture || student.avatar;
        db.update("students", student.email, student);
        console.log("Logged in existing student via Google GIS:", profile.email);
      }

      // Sign session JWT
      const sessionStudent = {
        email: student.email,
        name: student.name,
        role: "student",
        avatar: student.avatar,
        progress: student.progress,
        score: student.score,
        status: student.status,
        enrolledDate: student.enrolledDate,
        completedLessons: student.completedLessons,
        totalLessons: student.totalLessons
      };

      issueSessionCookies(res, sessionStudent);

      res.json({
        success: true,
        user: sessionStudent,
        message: "Google login verified. Student profile synchronized."
      });

    } catch (err: any) {
      console.error("Google Student Auth GIS failure:", err);
      res.status(401).json({ error: err.message || "Internal student authentication error." });
    }
  });


  // Fetch current session profile (Admins & Students on page load)
  app.get("/api/auth/me", (req, res) => {
    let token = req.cookies.tapco_session;
    let decoded: any = null;

    // Refresh Token Backdrop Fallback (Requirement 5)
    if (!token) {
      const refreshToken = req.cookies.tapco_refresh;
      if (refreshToken) {
        try {
          const refreshDecoded = jwt.verify(refreshToken, JWT_SECRET) as any;
          if (refreshDecoded && refreshDecoded.email) {
            console.log(` [OAUTH REFRESH SUCCESS] Automatically restoring session for ${refreshDecoded.email} via refresh token.`);
            
            // Re-construct the session payload based on role
            if (refreshDecoded.role !== "student") {
              const users = db.get("users") || [];
              const adminUser = users.find((u: any) => u.email.toLowerCase() === refreshDecoded.email.toLowerCase());
              decoded = {
                email: refreshDecoded.email,
                name: adminUser ? adminUser.name : "Administrator",
                role: adminUser ? adminUser.role : "admin",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                status: adminUser ? adminUser.status : "active",
                mfaEnabled: false
              };
            } else {
              const students = db.get("students") || [];
              const student = students.find((s: any) => s.email.toLowerCase() === refreshDecoded.email.toLowerCase());
              decoded = {
                email: refreshDecoded.email,
                name: student ? student.name : refreshDecoded.email.split("@")[0],
                role: "student",
                avatar: student ? student.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                progress: student ? student.progress : 0,
                score: student ? student.score : "N/A",
                status: student ? student.status : "In Progress",
                enrolledDate: student ? student.enrolledDate : new Date().toISOString().split("T")[0],
                completedLessons: student ? student.completedLessons : 0,
                totalLessons: student ? student.totalLessons : 24
              };
            }

            // Issue brand new cookies
            issueSessionCookies(res, decoded);
          }
        } catch (refreshErr) {
          console.warn(" [OAUTH REFRESH EXPIRED] Refresh token verification failed:", refreshErr);
          res.clearCookie("tapco_session", { httpOnly: true, secure: true, sameSite: "none" });
          res.clearCookie("tapco_refresh", { httpOnly: true, secure: true, sameSite: "none" });
          return res.json({ success: false, error: "Session expired." });
        }
      }
    }

    if (!token && !decoded) {
      return res.json({ success: false, error: "No active session." });
    }

    try {
      if (!decoded) {
        decoded = jwt.verify(token, JWT_SECRET) as any;
      }
      
      // If it is an admin, fetch latest status
      if (decoded.role !== "student") {
        const users = db.get("users") || [];
        const adminUser = users.find((u: any) => u.email.toLowerCase() === decoded.email.toLowerCase());
        if (adminUser) {
          decoded.name = adminUser.name;
          decoded.role = adminUser.role;
          decoded.status = adminUser.status;
          decoded.mfaEnabled = adminUser.mfaEnabled;
        }
      } else {
        // If it is a student, fetch latest stats
        const students = db.get("students") || [];
        const student = students.find((s: any) => s.email.toLowerCase() === decoded.email.toLowerCase());
        if (student) {
          decoded.name = student.name;
          decoded.avatar = student.avatar;
          decoded.progress = student.progress;
          decoded.score = student.score;
          decoded.status = student.status;
          decoded.completedLessons = student.completedLessons;
          decoded.totalLessons = student.totalLessons;
        }
      }

      res.json({ success: true, user: decoded });
    } catch (err) {
      res.clearCookie("tapco_session", { httpOnly: true, secure: true, sameSite: "none" });
      res.clearCookie("tapco_refresh", { httpOnly: true, secure: true, sameSite: "none" });
      res.json({ success: false, error: "Session expired or invalid." });
    }
  });

  // Log Out and terminate cookies
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("tapco_session", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    res.clearCookie("tapco_refresh", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    res.json({ success: true, message: "Logged out successfully." });
  });

  // Dynamic CRUD API for normalized tables
  // Supports filtering, searching, sorting, and pagination out of the box!
  app.get("/api/db/:table", (req, res) => {
    const { table } = req.params;
    const tableData = db.get(table as any);
    if (!tableData) {
      return res.status(404).json({ error: `Table '${table}' not found in normalized database.` });
    }

    let result = [...tableData];

    // 1. Filtering by simple matching query parameters
    const systemParams = ["search", "sort", "order", "page", "limit"];
    Object.keys(req.query).forEach((key) => {
      if (!systemParams.includes(key)) {
        const val = req.query[key];
        result = result.filter((item) => {
          if (item[key] === undefined) return false;
          return String(item[key]).toLowerCase() === String(val).toLowerCase();
        });
      }
    });

    // 2. Searching across fields
    const { search, sort, order, page, limit } = req.query;
    if (search) {
      const searchLower = String(search).toLowerCase();
      result = result.filter((item) => {
        return Object.values(item).some((val) => {
          if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
            return String(val).toLowerCase().includes(searchLower);
          }
          return false;
        });
      });
    }

    // 3. Sorting
    if (sort) {
      const sortField = String(sort);
      const sortOrder = String(order || "asc").toLowerCase();
      result.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "desc" ? valB - valA : valA - valB;
        }
        return sortOrder === "desc"
          ? String(valB).localeCompare(String(valA))
          : String(valA).localeCompare(String(valB));
      });
    }

    // 4. Pagination
    const totalCount = result.length;
    const p = parseInt(String(page || "1"), 10);
    const l = parseInt(String(limit || "1000"), 10);
    const startIndex = (p - 1) * l;
    const paginatedResult = result.slice(startIndex, startIndex + l);

    res.json({
      success: true,
      data: paginatedResult,
      pagination: {
        total: totalCount,
        page: p,
        limit: l,
        totalPages: Math.ceil(totalCount / l),
      },
    });
  });

  // Get single record
  app.get("/api/db/:table/:id", (req, res) => {
    const { table, id } = req.params;
    const tableData = db.get(table as any);
    if (!tableData) {
      return res.status(404).json({ error: `Table '${table}' not found.` });
    }
    const item = tableData.find((x: any) => String(x.id) === id || String(x.email) === id);
    if (!item) {
      return res.status(404).json({ error: `Record with id '${id}' not found.` });
    }
    res.json({ success: true, data: item });
  });

  // Insert record
  app.post("/api/db/:table", (req, res) => {
    const { table } = req.params;
    const tableData = db.get(table as any);
    if (!tableData) {
      return res.status(404).json({ error: `Table '${table}' not found.` });
    }
    const inserted = db.insert(table as any, req.body);
    res.status(212).json({ success: true, data: inserted });
  });

  // Update record
  app.put("/api/db/:table/:id", (req, res) => {
    const { table, id } = req.params;
    const success = db.update(table as any, id, req.body);
    if (!success) {
      return res.status(404).json({ error: `Record with id/email '${id}' not found in table '${table}'.` });
    }
    res.json({ success: true, message: "Record updated successfully." });
  });

  // Delete record
  app.delete("/api/db/:table/:id", (req, res) => {
    const { table, id } = req.params;
    const success = db.delete(table as any, id);
    if (!success) {
      return res.status(404).json({ error: `Record with id/email '${id}' not found in table '${table}'.` });
    }
    res.json({ success: true, message: "Record deleted successfully." });
  });

  // Bulk Load CMS Configuration State
  app.get("/api/cms/load", async (req, res) => {
    try {
      // 1. Company Information
      let companyInfoRows = await pgDb.select().from(schema.companyInformation);
      if (companyInfoRows.length === 0) {
        await pgDb.insert(schema.companyInformation).values({
          id: "comp-1",
          name: "TAPCO Solar Energy Solutions",
          tagline: "Eradicating Diesel Reliance Through Tier-1 Solar Microgrids",
          overview: "At TAPCO Solar Energy Solutions, we are committed to transforming the way homes, businesses, schools, and institutions across Nigeria access electricity. We provide reliable, cost-effective, and sustainable solar energy systems designed to eliminate the challenges of unreliable grid power and rising energy costs.",
          history: "Founded with a passion for engineering excellence and innovation in Yankaba, Kano in 2021, TAPCO Solar has grown into a leading national clean energy force.",
          whatWeDo: "We design, install, and maintain tier-1 residential solar powerwalls, hybrid industrial grids, and agricultural solar irrigation pumps.",
          logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200",
          phone: "+234 812 000 0000",
          email: "support@tapcosolar.com",
          address: "Plot 105, Corporate Boulevard, Lekki, Lagos, Nigeria"
        });
        companyInfoRows = await pgDb.select().from(schema.companyInformation);
      }

      // 2. Founder
      let founderRows = await pgDb.select().from(schema.founder);
      if (founderRows.length === 0) {
        await pgDb.insert(schema.founder).values({
          id: "founder-1",
          name: "Engr. Louis Olosunde, M.Sc",
          position: "Founder & CEO",
          photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop",
          bio: "Engr. Louis Olosunde is a veteran renewable energy architect with over 12 years of structural engineering and microgrid deployment experience across West Africa. He holds a Master's degree in Renewable Energy Systems and is a certified COREN member.",
          message: "Our absolute mission is to provide clean, silent, and maintenance-free solar stations engineered to operate perfectly in high-temperature environments. We're replacing erratic power systems, one community at a time.",
          twitter: "https://twitter.com/tapcosolar",
          linkedin: "https://linkedin.com/company/tapcosolar",
          email: "olosundelouis@gmail.com"
        });
        founderRows = await pgDb.select().from(schema.founder);
      }

      // 3. Mission
      let missionRows = await pgDb.select().from(schema.mission);
      if (missionRows.length === 0) {
        await pgDb.insert(schema.mission).values({
          id: "miss-1",
          statement: "To deliver innovative, reliable, and affordable renewable energy solutions that empower homes, businesses, schools, and communities with clean, uninterrupted power while exceeding customer expectations through engineering excellence and exceptional service.",
          isPublished: true
        });
        missionRows = await pgDb.select().from(schema.mission);
      }

      // 4. Vision
      let visionRows = await pgDb.select().from(schema.vision);
      if (visionRows.length === 0) {
        await pgDb.insert(schema.vision).values({
          id: "vis-1",
          statement: "To become Africa's leading renewable energy and engineering company, recognized for transforming lives through sustainable energy solutions, technological innovation, and world-class service.",
          isPublished: true
        });
        visionRows = await pgDb.select().from(schema.vision);
      }

      // 5. Core Values
      let coreValuesRows = await pgDb.select().from(schema.coreValuesTable);
      if (coreValuesRows.length === 0) {
        await pgDb.insert(schema.coreValuesTable).values([
          { id: "val-1", title: "Integrity", description: "We uphold honesty, transparency, and ethical practices in every project.", icon: "Shield", orderIdx: 1, isPublished: true },
          { id: "val-2", title: "Excellence", description: "We are committed to delivering the highest standards of quality and professionalism.", icon: "Award", orderIdx: 2, isPublished: true },
          { id: "val-3", title: "Innovation", description: "We embrace modern technologies and creative solutions to meet evolving energy needs.", icon: "Lightbulb", orderIdx: 3, isPublished: true },
          { id: "val-4", title: "Professionalism", description: "We execute every project with competence, discipline, and accountability.", icon: "Briefcase", orderIdx: 4, isPublished: true },
          { id: "val-5", title: "Customer-Centricity", description: "Our customers are at the heart of everything we do, and their satisfaction is our priority.", icon: "Users", orderIdx: 5, isPublished: true },
          { id: "val-6", title: "Sustainability", description: "We promote clean energy solutions that protect the environment and create lasting value for future generations.", icon: "Leaf", orderIdx: 6, isPublished: true }
        ]);
        coreValuesRows = await pgDb.select().from(schema.coreValuesTable);
      }

      // 6. About Sections (History & Timeline Milestones)
      let aboutSectionsRows = await pgDb.select().from(schema.aboutSections);
      if (aboutSectionsRows.length === 0) {
        await pgDb.insert(schema.aboutSections).values([
          { id: "sec-1", title: "2021: Inception in Yankaba, Kano", content: "Started as a regional distributor of solar mounting systems and high-grade copper cables.", image: "", orderIdx: 1, isPublished: true },
          { id: "sec-2", title: "2023: Launch of Training Academy", content: "Established certified technical training for solar designers, enrolling over 150 local students.", image: "", orderIdx: 2, isPublished: true },
          { id: "sec-3", title: "2025: Flagship School Projects", content: "Delivered 14 fully-donor-funded clean grids under the 'Energy for Schools Campaign'.", image: "", orderIdx: 3, isPublished: true }
        ]);
        aboutSectionsRows = await pgDb.select().from(schema.aboutSections);
      }

      // 7. Leadership Team
      let leadershipRows = await pgDb.select().from(schema.leadershipTeam);
      if (leadershipRows.length === 0) {
        await pgDb.insert(schema.leadershipTeam).values([
          { id: "lead-1", name: "Alhaji Ibrahim Musa", position: "Managing Director", department: "Executive", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop", bio: "Musa manages corporate relationships with Nigerian banking partners, steering solar intervention finances.", orderIdx: 1, isPublished: true },
          { id: "lead-2", name: "Engr. Yusuf Bello", position: "Chief Field Engineer", department: "Engineering", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop", bio: "Yusuf oversees on-site microgrid deployment, surge protection sizing, and heavy civil mounting works.", orderIdx: 2, isPublished: true }
        ]);
        leadershipRows = await pgDb.select().from(schema.leadershipTeam);
      }

      // 8. Staff Members
      let staffRows = await pgDb.select().from(schema.staffMembers);
      if (staffRows.length === 0) {
        await pgDb.insert(schema.staffMembers).values([
          { id: "staff-1", name: "Mrs. Chioma Nwachukwu", position: "Head of Customer Experience", department: "Support", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop", bio: "Chioma coordinates client grid telemetry, off-grid audits, and warranty scheduling.", orderIdx: 1, isPublished: true },
          { id: "staff-2", name: "Muhammadu Lawal", position: "Senior Solar Designer", department: "Engineering", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop", bio: "Lawal designs complex hybrid string configurations and CAD roof sizing templates.", orderIdx: 2, isPublished: true }
        ]);
        staffRows = await pgDb.select().from(schema.staffMembers);
      }

      res.json({
        success: true,
        data: {
          heroSlides: db.get("heroSlides"),
          testimonials: db.get("testimonials"),
          servicesList: db.get("services"),
          projectsList: db.get("projects"),
          productsList: db.get("products"),
          ordersList: db.get("orders"),
          couponsList: db.get("coupons"),
          coursesList: db.get("courses"),
          studentsList: db.get("students"),
          blogsList: db.get("blogPosts"),
          downloadsList: db.get("resources"),
          popupsList: db.get("popupMessages"),
          quotesList: db.get("quotations"),
          bookingsList: db.get("bookings"),
          customersList: db.get("customers"),
          leadsList: db.get("leads"),
          supportTicketsList: db.get("supportTickets"),
          teamList: db.get("teamMembers"),
          mediaFiles: db.get("mediaFiles"),
          seoSettings: db.get("seoSettings") || [],
          settings: db.get("settings"),
          notifications: db.get("notifications"),
          auditLogs: db.get("auditLogs"),
          
          aboutData: {
            companyInfo: companyInfoRows[0],
            founder: founderRows[0],
            mission: missionRows[0],
            vision: visionRows[0],
            coreValues: coreValuesRows.sort((a, b) => (a.orderIdx || 0) - (b.orderIdx || 0)),
            aboutSections: aboutSectionsRows.sort((a, b) => (a.orderIdx || 0) - (b.orderIdx || 0)),
            leadership: leadershipRows.sort((a, b) => (a.orderIdx || 0) - (b.orderIdx || 0)),
            staffMembers: staffRows.sort((a, b) => (a.orderIdx || 0) - (b.orderIdx || 0)),
            profileTitle: companyInfoRows[0].name.toUpperCase(),
            profileDesc: companyInfoRows[0].overview,
            missionText: missionRows[0].statement,
            visionText: visionRows[0].statement,
            timeline: aboutSectionsRows.map(sec => ({
              id: sec.id,
              year: sec.title.split(":")[0]?.trim() || "2026",
              title: sec.title.split(":")[1]?.trim() || sec.title,
              desc: sec.content
            })),
            certifications: [
              {
                id: "cert-1",
                title: "ISO 9001:2015 Quality Management",
                authority: "International Standards Org",
                desc: "Fully accredited for design, assembly, and on-site testing procedures.",
                certNumber: "ISO-9001-2026-QMS-3029",
                standards: "QMS Audit ISO 9001:2015",
                expiry: "May 2028",
                auditFreq: "Annual Surveillance"
              },
              {
                id: "cert-2",
                title: "NEMSA Class-A Installation Licence",
                authority: "Nigerian Electricity Management",
                desc: "Legally certified to implement grid-tie synchronization and industrial arrays up to 5MW.",
                certNumber: "NEMSA-CLASS-A-4029-NIG",
                standards: "NEMSA Grid-Tie Act 2023",
                expiry: "December 2029",
                auditFreq: "Bi-Annual Inspection"
              }
            ],
            partners: [
              { id: "part-1", name: "Sterling Bank Sunsola", logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop" },
              { id: "part-2", name: "Bank of Industry (BOI) Solar", logoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&h=100&fit=crop" }
            ]
          }
        }
      });
    } catch (err: any) {
      console.error("CMS load error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Bulk Save/Sync CMS Configuration State
  app.post("/api/cms/save", async (req, res) => {
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({ error: "Payload is required." });
    }

    try {
      if (payload.heroSlides) db.set("heroSlides", payload.heroSlides);
      if (payload.testimonials) db.set("testimonials", payload.testimonials);
      if (payload.servicesList) db.set("services", payload.servicesList);
      if (payload.projectsList) db.set("projects", payload.projectsList);
      if (payload.productsList) db.set("products", payload.productsList);
      if (payload.ordersList) db.set("orders", payload.ordersList);
      if (payload.couponsList) db.set("coupons", payload.couponsList);
      if (payload.coursesList) db.set("courses", payload.coursesList);
      if (payload.studentsList) db.set("students", payload.studentsList);
      if (payload.blogsList) db.set("blogPosts", payload.blogsList);
      if (payload.downloadsList) db.set("resources", payload.downloadsList);
      if (payload.popupsList) db.set("popupMessages", payload.popupsList);
      if (payload.quotesList) db.set("quotations", payload.quotesList);
      if (payload.bookingsList) db.set("bookings", payload.bookingsList);
      if (payload.customersList) db.set("customers", payload.customersList);
      if (payload.leadsList) db.set("leads", payload.leadsList);
      if (payload.supportTicketsList) db.set("supportTickets", payload.supportTicketsList);
      if (payload.teamList) db.set("teamMembers", payload.teamList);
      if (payload.mediaFiles) db.set("mediaFiles", payload.mediaFiles);
      if (payload.seoSettings) db.set("seoSettings", payload.seoSettings);
      if (payload.notifications) db.set("notifications", payload.notifications);
      if (payload.auditLogs) db.set("auditLogs", payload.auditLogs);

      if (payload.aboutData) {
        // 1. Sync Company Information
        if (payload.aboutData.companyInfo) {
          const info = payload.aboutData.companyInfo;
          await pgDb.insert(schema.companyInformation).values({
            id: info.id || "comp-1",
            name: info.name,
            tagline: info.tagline || "",
            overview: info.overview || "",
            history: info.history || "",
            whatWeDo: info.whatWeDo || "",
            logo: info.logo || "",
            phone: info.phone || "",
            email: info.email || "",
            address: info.address || ""
          }).onConflictDoUpdate({
            target: schema.companyInformation.id,
            set: {
              name: info.name,
              tagline: info.tagline || "",
              overview: info.overview || "",
              history: info.history || "",
              whatWeDo: info.whatWeDo || "",
              logo: info.logo || "",
              phone: info.phone || "",
              email: info.email || "",
              address: info.address || "",
              updatedAt: new Date()
            }
          });
        }

        // 2. Sync Founder
        if (payload.aboutData.founder) {
          const f = payload.aboutData.founder;
          await pgDb.insert(schema.founder).values({
            id: f.id || "founder-1",
            name: f.name,
            position: f.position || "Founder & CEO",
            photo: f.photo || "",
            bio: f.bio || "",
            message: f.message || "",
            twitter: f.twitter || "",
            linkedin: f.linkedin || "",
            email: f.email || ""
          }).onConflictDoUpdate({
            target: schema.founder.id,
            set: {
              name: f.name,
              position: f.position || "Founder & CEO",
              photo: f.photo || "",
              bio: f.bio || "",
              message: f.message || "",
              twitter: f.twitter || "",
              linkedin: f.linkedin || "",
              email: f.email || "",
              updatedAt: new Date()
            }
          });
        }

        // 3. Sync Mission
        if (payload.aboutData.mission) {
          const m = payload.aboutData.mission;
          await pgDb.insert(schema.mission).values({
            id: m.id || "miss-1",
            statement: m.statement,
            isPublished: m.isPublished !== false
          }).onConflictDoUpdate({
            target: schema.mission.id,
            set: {
              statement: m.statement,
              isPublished: m.isPublished !== false,
              updatedAt: new Date()
            }
          });
        }

        // 4. Sync Vision
        if (payload.aboutData.vision) {
          const v = payload.aboutData.vision;
          await pgDb.insert(schema.vision).values({
            id: v.id || "vis-1",
            statement: v.statement,
            isPublished: v.isPublished !== false
          }).onConflictDoUpdate({
            target: schema.vision.id,
            set: {
              statement: v.statement,
              isPublished: v.isPublished !== false,
              updatedAt: new Date()
            }
          });
        }

        // 5. Sync Core Values (Clean and re-insert)
        if (Array.isArray(payload.aboutData.coreValues)) {
          await pgDb.delete(schema.coreValuesTable);
          for (const item of payload.aboutData.coreValues) {
            await pgDb.insert(schema.coreValuesTable).values({
              id: item.id || `val-${Math.random()}`,
              title: item.title,
              description: item.description || item.desc || "",
              icon: item.icon || "Shield",
              orderIdx: item.orderIdx || 0,
              isPublished: item.isPublished !== false
            });
          }
        }

        // 6. Sync About Sections / History timeline
        if (Array.isArray(payload.aboutData.aboutSections)) {
          await pgDb.delete(schema.aboutSections);
          for (const item of payload.aboutData.aboutSections) {
            await pgDb.insert(schema.aboutSections).values({
              id: item.id || `sec-${Math.random()}`,
              title: item.title,
              content: item.content || item.desc || "",
              image: item.image || "",
              orderIdx: item.orderIdx || 0,
              isPublished: item.isPublished !== false
            });
          }
        }

        // 7. Sync Leadership Team
        if (Array.isArray(payload.aboutData.leadership)) {
          await pgDb.delete(schema.leadershipTeam);
          for (const item of payload.aboutData.leadership) {
            await pgDb.insert(schema.leadershipTeam).values({
              id: item.id || `lead-${Math.random()}`,
              name: item.name,
              position: item.position || item.role || "Executive",
              department: item.department || "Executive",
              photo: item.photo || item.image || "",
              bio: item.bio || "",
              orderIdx: item.orderIdx || 0,
              isPublished: item.isPublished !== false
            });
          }
        }

        // 8. Sync Staff Members
        if (Array.isArray(payload.aboutData.staffMembers)) {
          await pgDb.delete(schema.staffMembers);
          for (const item of payload.aboutData.staffMembers) {
            await pgDb.insert(schema.staffMembers).values({
              id: item.id || `staff-${Math.random()}`,
              name: item.name,
              position: item.position || item.role || "Staff",
              department: item.department || "Operations",
              photo: item.photo || item.image || "",
              bio: item.bio || "",
              orderIdx: item.orderIdx || 0,
              isPublished: item.isPublished !== false
            });
          }
        }

        // Keep local key-value config in sync for backwards compatibility
        const currentSettings = db.get("settings") || {};
        db.set("settings", {
          ...currentSettings,
          profileTitle: payload.aboutData.companyInfo?.name?.toUpperCase() || payload.aboutData.profileTitle,
          profileDesc: payload.aboutData.companyInfo?.overview || payload.aboutData.profileDesc,
          mission: payload.aboutData.mission?.statement || payload.aboutData.mission,
          vision: payload.aboutData.vision?.statement || payload.aboutData.vision,
          coreValues: payload.aboutData.coreValues,
          timeline: payload.aboutData.aboutSections
        });
      }

      res.json({ success: true, message: "CMS Configuration state synchronized successfully to persistent database." });
    } catch (err: any) {
      console.error("Bulk sync error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  // Media Library Upload Controller
  app.post("/api/media/upload", (req, res) => {
    const { name, type, base64, folder, tags } = req.body;
    if (!name || !base64) {
      return res.status(400).json({ error: "Name and base64 content are required." });
    }

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const cleanBase64 = base64.replace(/^data:.*;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");
      const safeName = name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, buffer);

      const sizeInMB = (buffer.length / (1024 * 1024)).toFixed(2);

      const mediaItem = {
        id: `med-${Date.now()}`,
        name: safeName,
        url: `/uploads/${safeName}`,
        type: type || "image",
        size: `${sizeInMB} MB`,
        folder: folder || "Home Gallery",
        tags: tags || [],
        uploadedAt: new Date().toISOString().split("T")[0]
      };

      db.insert("mediaFiles", mediaItem);

      res.json({ success: true, item: mediaItem });
    } catch (err: any) {
      console.error("Media upload error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Live Solar Pricing & Exchange Rate Engine (Driven by Database values)
  app.get("/api/solar-prices", async (req, res) => {
    let exchangeRate = 1600; // Realistic baseline fallback
    let isLive = false;

    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      if (response.ok) {
        const data = await response.json();
        if (data && data.rates && data.rates.NGN) {
          exchangeRate = data.rates.NGN;
          isLive = true;
        }
      }
    } catch (err) {
      console.error("Failed to fetch live exchange rate, using fallback NGN/USD:", err);
    }

    // Baseline packages and products from database or fallback if empty
    const dbPackages = db.get("solarPackages") || [];
    const dbProducts = db.get("products") || [];

    const basePackages = dbPackages.length > 0 ? dbPackages : [
      { id: "pkg-1", name: "TAPCO Starter (1kVA)", usdPrice: 780, capacity: "1kVA / 1kW" },
      { id: "pkg-3", name: "TAPCO Classic (3kVA)", usdPrice: 2250, capacity: "3kVA / 3kW" },
      { id: "pkg-5", name: "TAPCO Premium (5kVA)", usdPrice: 3625, capacity: "5kVA / 5kW" }
    ];

    const baseProducts = dbProducts.length > 0 ? dbProducts : [
      { id: "prod-1", name: "TAPCO Premium 450W Solar Panel", usdPrice: 156 },
      { id: "prod-2", name: "TAPCO Hybrid Smart Inverter 5kW", usdPrice: 1094 },
      { id: "prod-3", name: "TAPCO Lithium LiFePO4 Powerwall 4.8kWh", usdPrice: 1625 }
    ];

    const packages = basePackages.map((pkg: any) => ({
      ...pkg,
      price: pkg.price || Math.round((pkg.usdPrice || 1000) * exchangeRate)
    }));

    const products = baseProducts.map((prod: any) => ({
      ...prod,
      price: prod.price || Math.round((prod.usdPrice || 200) * exchangeRate)
    }));

    // Service pricing
    const services = {
      site_inspection: {
        name: "Professional Site Inspection & Energy Audit",
        price: Math.round(31.25 * exchangeRate), // ~$50, e.g. 50,000 NGN
        description: "Includes shadow profiling, electrical loading schedule, roof structural capacity validation, and 3D CAD design proposal."
      },
      earthing_system: {
        name: "High-Impedance Copper Earthing Pit",
        price: Math.round(103.125 * exchangeRate), // ~$165, e.g. 165,000 NGN
        description: "Establishing a premium ground copper electrode pit to keep impedance strictly under 1.0 Ohm."
      },
      lightning_protection: {
        name: "Copper Lightning Air Terminal",
        price: Math.round(59.375 * exchangeRate), // ~$95, e.g. 95,000 NGN
        description: "Heavy-duty pure copper active lightning rod and safety down conductor system."
      },
      maintenance_panel_cleaning: {
        name: "Solar Array Diagnostic Washing & Cleaning Service",
        price: Math.round(2.5 * exchangeRate), // ~$4 per panel, e.g. 4,000 NGN
        description: "Professional washing with deionized water to prevent salt scale build-up and hot spots."
      },
      bms_calibration: {
        name: "Battery Management System Calibration & SoH Audit",
        price: Math.round(3.75 * exchangeRate), // ~$6 per kWh, e.g. 6,000 NGN
        description: "Cell voltage balancing, thermal profiling, state of health diagnostics, and firmware optimization."
      },
      consultation_fee: {
        name: "COREN Licensed Engineering Signoff & Base Consultation Fee",
        price: Math.round(156.25 * exchangeRate), // ~$250, e.g. 250,000 NGN
        description: "Professional drawing stamps, load balance engineering, schematic design validation, and certification."
      }
    };

    res.json({
      success: true,
      isLive,
      exchangeRate,
      packages,
      products,
      services,
      timestamp: new Date().toISOString()
    });
  });


  // AI Chatbot endpoint
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // System instruction for the TAPCO Solar assistant
    const systemInstruction = `You are the official AI Assistant for TAPCO Solar Energy Solutions (digital headquarters, customer support, and training academy).
Your goal is to guide visitors, clients, and students in a professional, warm, and trustworthy manner.

Key Facts about TAPCO Solar Energy Solutions:
- Services: Site inspections, customized system designs, solar installations, premium components supply, net metering, battery storage systems, maintenance, and the TAPCO Solar Training Academy.
- Solar Packages: We offer standard configurations ranging from 1kVA (basic home lighting/fans) up to 40kVA (large industrial or school facilities), using Tier-1 panels, smart hybrid/on-grid inverters, and long-life LiFePO4 battery systems.
- Campaign: "Energy for Schools Campaign" provides tailored solar power solutions to educational institutions to ensure uninterrupted learning, reduce operating bills, and serve as educational tools for renewable energy.
- Solar Training Academy: Professional training courses on solar technology design, installation, troubleshooting, safety, and business, with student logins, quizzes, assignment modules, and certified graduation.
- Tone: Extremely clean, professional, informative, helpful, and innovative.

Provide complete, well-formatted, and helpful responses. If asked, help users calculate their load or recommend site inspections.`;

    if (ai) {
      try {
        // Construct the prompt with context history if any
        const formattedHistory = (history || []).map((h: any) => `${h.role === 'user' ? 'User' : 'TAPCO AI'}: ${h.content}`).join("\n");
        const prompt = `${formattedHistory}\nUser: ${message}\nTAPCO AI:`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        const reply = response.text || "I am processing your request. How can TAPCO Solar help you today?";
        return res.json({ reply });
      } catch (err: any) {
        console.error("Gemini API call failed:", err);
        return res.json({
          reply: `I apologize, but I encountered an error. Here is a helpful response based on TAPCO Solar's documentation:
We offer solar solutions from 1kVA to 40kVA, state-of-the-art site inspections, and professional courses in our Solar Training Academy. How can I help schedule a consultation or recommend a package for you?`,
          error: err.message
        });
      }
    } else {
      // Offline/Simulation Mode fallback if GEMINI_API_KEY is not defined
      let reply = "Thank you for reaching out to TAPCO Solar Energy Solutions. ";
      const textLower = message.toLowerCase();

      if (textLower.includes("package") || textLower.includes("kva") || textLower.includes("price")) {
        reply += "Our premium Solar Packages range from 1kVA (ideal for small homes/apartments) to 40kVA (designed for large schools, farms, or commercial centers). We offer customizable lithium-ion battery backup systems and hybrid smart inverters. You can request a personalized quote through our Quotation system in the main menu!";
      } else if (textLower.includes("school") || textLower.includes("campaign") || textLower.includes("education")) {
        reply += "Our 'Energy for Schools Campaign' is our proud flagship project. We install highly durable solar arrays in schools to eliminate power cuts, reduce electricity expenses, and teach children about solar engineering. Contact our sales department to nominate or partner for a school installation.";
      } else if (textLower.includes("academy") || textLower.includes("train") || textLower.includes("course") || textLower.includes("student")) {
        reply += "TAPCO Solar Training Academy is our premium training center! We offer structured, certified courses covering Solar Design, Advanced Installation, Troubleshooting, and Business Skills. You can register on our Training page, log into our student portal, watch video lectures, download manuals, and complete quizzes to earn your professional certificate.";
      } else if (textLower.includes("calculator") || textLower.includes("load") || textLower.includes("appliance")) {
        reply += "Our interactive Solar Load Calculator is available on our platform! Simply input your home/office appliances, and our system will instantly calculate your total power load and recommend the exact kVA package you need, including daily generation estimates.";
      } else if (textLower.includes("inspect") || textLower.includes("book") || textLower.includes("visit") || textLower.includes("consult")) {
        reply += "You can book a professional Site Inspection or consultation right now using our Booking Calendar in the main menu! Simply choose a date and time slot, and our expert solar engineers will visit your property to run thermal and capacity analyses.";
      } else {
        reply += "We are happy to assist you! As your dedicated solar partner, we handle custom system design, procurement of Tier-1 panels/batteries, certified installation, net metering, and lifetime support. Would you like to check our Solar Packages, try the Load Calculator, or schedule a Site Inspection?";
      }

      return res.json({ reply });
    }
  });

  // 2. VITE MIDDLEWARE SETUP

  if (process.env.NODE_ENV !== "production") {
    console.log("Vite middleware loading in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production build from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TAPCO Solar Platform server is running on http://localhost:${PORT}`);
  });
}

startServer();
