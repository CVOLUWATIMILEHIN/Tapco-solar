import React, { useState } from "react";
import {
  Users, Shield, Key, Mail, Phone, Clock, ShieldAlert, UserCheck, CheckCircle,
  AlertTriangle, Filter, Eye, RefreshCw, Send, Sliders, Download, Search,
  ArrowRight, Settings, PlusCircle, Trash, X, Lock, Unlock, Laptop, Smartphone, Check, HelpCircle
} from "lucide-react";

// Predefined Module List
const MODULES = [
  "Customers", "Products", "Inventory", "Orders", "Courses", "Students",
  "Payments", "Reports", "Projects", "Settings", "UserManagement", "Security"
];

// Predefined Permission Types
const PERMISSIONS_TYPES = ["View", "Create", "Edit", "Delete", "Export"];

// Predefined Role Templates for Permissions
const ROLE_PERMISSION_TEMPLATES: Record<string, Record<string, string[]>> = {
  super_admin: MODULES.reduce((acc, mod) => ({ ...acc, [mod]: [...PERMISSIONS_TYPES] }), {}),
  ceo: MODULES.reduce((acc, mod) => ({ ...acc, [mod]: ["View", "Export"] }), {}),
  operations_manager: {
    Projects: ["View", "Create", "Edit", "Delete", "Export"],
    Orders: ["View", "Edit"],
    Inventory: ["View", "Edit"],
    Customers: ["View"],
    Reports: ["View"]
  },
  sales_manager: {
    Customers: ["View", "Create", "Edit"],
    Payments: ["View"],
    Reports: ["View"],
    Projects: ["View"]
  },
  finance_manager: {
    Payments: ["View", "Create", "Edit", "Export"],
    Reports: ["View", "Export"],
    Orders: ["View", "Edit"],
    Customers: ["View"]
  },
  engineering_manager: {
    Projects: ["View", "Create", "Edit", "Export"],
    Products: ["View", "Create", "Edit"],
    Inventory: ["View", "Edit"],
    Reports: ["View"]
  },
  academy_manager: {
    Courses: ["View", "Create", "Edit", "Delete", "Export"],
    Students: ["View", "Create", "Edit", "Export"],
    Reports: ["View"]
  },
  instructor: {
    Courses: ["View"],
    Students: ["View"]
  },
  customer_support: {
    Customers: ["View", "Create", "Edit"],
    Orders: ["View"],
    Courses: ["View"],
    Students: ["View"]
  },
  store_manager: {
    Inventory: ["View", "Create", "Edit", "Export"],
    Products: ["View", "Create", "Edit"],
    Orders: ["View", "Edit"]
  },
  marketing_manager: {
    Customers: ["View"],
    Reports: ["View"],
    Products: ["View"]
  },
  hr_manager: {
    UserManagement: ["View", "Create", "Edit", "Delete"],
    Reports: ["View"]
  },
  readonly_auditor: MODULES.reduce((acc, mod) => ({ ...acc, [mod]: ["View"] }), {})
};

const ROLES_LIST = [
  { id: "super_admin", name: "Super Admin", dept: "Security & Governance" },
  { id: "ceo", name: "CEO", dept: "Executive Office" },
  { id: "operations_manager", name: "Operations Manager", dept: "Logistics" },
  { id: "sales_manager", name: "Sales Manager", dept: "Sales & Marketing" },
  { id: "engineering_manager", name: "Engineering Manager", dept: "Engineering" },
  { id: "finance_manager", name: "Finance Manager", dept: "Finance" },
  { id: "academy_manager", name: "Academy Manager", dept: "Training Academy" },
  { id: "store_manager", name: "Store Manager", dept: "Warehouse" },
  { id: "customer_support", name: "Customer Support Manager", dept: "Support" },
  { id: "marketing_manager", name: "Marketing Manager", dept: "Sales & Marketing" },
  { id: "hr_manager", name: "HR Manager", dept: "Human Resources" },
  { id: "instructor", name: "Instructor", dept: "Training Academy" },
  { id: "readonly_auditor", name: "Read-Only Auditor", dept: "Compliance" }
];

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  role: string;
  status: "active" | "suspended" | "invited" | "compromised";
  mfaEnabled: boolean;
  lastLogin: string;
  activeSessions: number;
  photoUrl: string;
  permissions: Record<string, string[]>;
  loginHistory: Array<{
    date: string;
    time: string;
    ip: string;
    device: string;
    browser: string;
    location: string;
  }>;
}

interface AdminManagementSystemProps {
  currentRole: string;
  loginEmail: string;
  addAuditLog: (action: string, whoOverride?: string, statusVal?: "SUCCESS" | "BLOCKED" | "WARNING") => void;
  showToast: (msg: string) => void;
  sendSimulatedEmail: (to: string, subject: string, body: string, code?: string) => void;
}

export default function AdminManagementSystem({
  currentRole,
  loginEmail,
  addAuditLog,
  showToast,
  sendSimulatedEmail
}: AdminManagementSystemProps) {
  // Main admin list state (Hydrated with initial high-fidelity corporate database)
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: "ADM-001",
      name: "Olosunde Louis",
      email: "olosundelouis@gmail.com",
      phone: "+234 812 345 6789",
      department: "Executive Office",
      jobTitle: "Chief Technology Architect",
      role: "super_admin",
      status: "active",
      mfaEnabled: true,
      lastLogin: "2026-07-02 08:30:11 UTC",
      activeSessions: 2,
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
      permissions: ROLE_PERMISSION_TEMPLATES.super_admin,
      loginHistory: [
        { date: "2026-07-02", time: "08:30 AM", ip: "197.210.64.22", device: "MacBook Pro M3", browser: "Chrome v126", location: "Abuja, NG" },
        { date: "2026-07-01", time: "09:45 AM", ip: "197.210.88.94", device: "iPhone 15 Pro", browser: "Safari v17.4", location: "Lagos, NG" }
      ]
    },
    {
      id: "ADM-001b",
      name: "TAPCO Solar Admin",
      email: "tapcosolar@gmail.com",
      phone: "+234 812 000 0000",
      department: "Executive Office",
      jobTitle: "Co-Administrator",
      role: "super_admin",
      status: "active",
      mfaEnabled: true,
      lastLogin: "2026-07-10 05:30:00 UTC",
      activeSessions: 1,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      permissions: ROLE_PERMISSION_TEMPLATES.super_admin,
      loginHistory: [
        { date: "2026-07-10", time: "05:30 AM", ip: "197.210.64.22", device: "MacBook Pro M3", browser: "Chrome v126", location: "Abuja, NG" }
      ]
    },
    {
      id: "ADM-002",
      name: "Dr. Amadi Bello",
      email: "amadi@belloclinic.org",
      phone: "+234 815 222 3344",
      department: "Executive Office",
      jobTitle: "CEO / Managing Director",
      role: "ceo",
      status: "active",
      mfaEnabled: true,
      lastLogin: "2026-07-01 14:22:05 UTC",
      activeSessions: 1,
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
      permissions: ROLE_PERMISSION_TEMPLATES.ceo,
      loginHistory: [
        { date: "2026-07-01", time: "02:22 PM", ip: "102.89.2.14", device: "iPad Pro", browser: "Safari Mobile v17", location: "Lagos, NG" }
      ]
    },
    {
      id: "ADM-003",
      name: "Engr. Yusuf Bello",
      email: "yusuf.b@tapco.com",
      phone: "+234 803 111 2222",
      department: "Engineering",
      jobTitle: "Grid Engineering Manager",
      role: "engineering_manager",
      status: "active",
      mfaEnabled: false,
      lastLogin: "2026-06-30 11:15:42 UTC",
      activeSessions: 1,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      permissions: ROLE_PERMISSION_TEMPLATES.engineering_manager,
      loginHistory: [
        { date: "2026-06-30", time: "11:15 AM", ip: "102.91.4.52", device: "Dell XPS 15", browser: "Firefox v125", location: "Kaduna, NG" }
      ]
    },
    {
      id: "ADM-004",
      name: "Ibrahim Musa",
      email: "musa@solartech.ng",
      phone: "+234 703 111 5555",
      department: "Finance",
      jobTitle: "Financial Controller",
      role: "finance_manager",
      status: "active",
      mfaEnabled: true,
      lastLogin: "2026-06-29 16:45:10 UTC",
      activeSessions: 0,
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
      permissions: ROLE_PERMISSION_TEMPLATES.finance_manager,
      loginHistory: [
        { date: "2026-06-29", time: "04:45 PM", ip: "197.210.74.88", device: "MacBook Air", browser: "Chrome v126", location: "Abuja, NG" }
      ]
    },
    {
      id: "ADM-005",
      name: "Evelyn Johnson",
      email: "evelyn.j@gmail.com",
      phone: "+234 809 991 1122",
      department: "Support",
      jobTitle: "Customer Care Director",
      role: "customer_support",
      status: "active",
      mfaEnabled: true,
      lastLogin: "2026-07-02 09:05:12 UTC",
      activeSessions: 1,
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
      permissions: ROLE_PERMISSION_TEMPLATES.customer_support,
      loginHistory: [
        { date: "2026-07-02", time: "09:05 AM", ip: "197.210.88.94", device: "MacBook Pro M1", browser: "Chrome v126", location: "Lagos, NG" }
      ]
    },
    {
      id: "ADM-006",
      name: "Auditor Smith",
      email: "auditor@tapco.com",
      phone: "+234 901 222 3333",
      department: "Compliance",
      jobTitle: "External Read-Only Auditor",
      role: "readonly_auditor",
      status: "suspended",
      mfaEnabled: true,
      lastLogin: "2026-06-15 10:00:00 UTC",
      activeSessions: 0,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      permissions: ROLE_PERMISSION_TEMPLATES.readonly_auditor,
      loginHistory: [
        { date: "2026-06-15", time: "10:00 AM", ip: "102.89.5.6", device: "ThinkPad X1 Carbon", browser: "Chrome v124", location: "London, UK" }
      ]
    }
  ]);

  // Invites state
  const [invites, setInvites] = useState<any[]>([
    { id: "INV-501", email: "operations.lead@tapco.com", role: "operations_manager", department: "Logistics", invitedBy: "olosundelouis@gmail.com", expiry: "2026-07-04 09:10 UTC", status: "Pending" },
    { id: "INV-502", email: "academy.instr@tapco.com", role: "instructor", department: "Training Academy", invitedBy: "olosundelouis@gmail.com", expiry: "Expired", status: "Expired" }
  ]);

  // UI state controllers
  const [activeSubTab, setActiveSubTab] = useState<"directory" | "create" | "invites" | "security_audits">("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected Admin for Deep Inspect / Edit Drawer
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);

  // Form States for creating new Admin
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDepartment, setFormDepartment] = useState("Engineering");
  const [formJobTitle, setFormJobTitle] = useState("");
  const [formRole, setFormRole] = useState("engineering_manager");
  const [formMfa, setFormMfa] = useState(true);
  const [formPasswordMode, setFormPasswordMode] = useState<"auto" | "manual">("auto");
  const [formPassword, setFormPassword] = useState("");

  // Form States for Invitations
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("operations_manager");
  const [inviteDept, setInviteDept] = useState("Logistics");
  const [inviteExpiryHours, setInviteExpiryHours] = useState(48);

  // Active Security Event List
  const [securityEvents, setSecurityEvents] = useState<any[]>([
    { id: "SEC-901", user: "olosundelouis@gmail.com", event: "Permission Map Updated", time: "Today, 08:35 AM", ip: "197.210.64.22", device: "MacBook Pro M3", browser: "Chrome v126" },
    { id: "SEC-902", user: "evelyn.j@gmail.com", event: "Force Logout Session Execution", time: "Today, 08:12 AM", ip: "197.210.88.94", device: "MacBook Pro M1", browser: "Chrome v126" },
    { id: "SEC-903", user: "auditor@tapco.com", event: "Account Suspended by Super Admin", time: "Yesterday, 14:15 PM", ip: "197.210.64.22", device: "MacBook Pro M3", browser: "Chrome v126" }
  ]);

  // Access Control Check
  if (currentRole !== "super_admin") {
    return (
      <div className="min-h-[500px] bg-white border border-rose-100 rounded-3xl p-12 flex flex-col justify-center items-center text-center space-y-6 max-w-4xl mx-auto shadow-sm my-12 animate-fade-in">
        <div className="h-20 w-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner border border-rose-100/50">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100/60">
            Access Control Violation
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">TAPCO IAM Security: Access Denied</h2>
          <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
            Your current administrative session is bound to the <span className="font-extrabold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{ROLES_LIST.find(r => r.id === currentRole)?.name || currentRole}</span> context, which lacks security clearance for the **Identity Governance & Control Console**.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 max-w-md w-full space-y-2 text-left text-xs font-semibold text-slate-600">
          <div className="flex justify-between">
            <span>Security Zone:</span>
            <span className="text-slate-900 font-bold">FIPS-IAM-ADMIN-ZONE</span>
          </div>
          <div className="flex justify-between">
            <span>Identity Token:</span>
            <span className="text-mono text-slate-400">SESSION_CLEARED_LEVL_0</span>
          </div>
          <div className="flex justify-between">
            <span>Required Clearance:</span>
            <span className="text-[#0057B8] font-black">SUPER_ADMIN</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-bold">
          Please toggle the role context switcher in the top right header to <span className="text-[#0057B8]">Super Admin</span> to access this workspace.
        </p>
      </div>
    );
  }

  // Handle Add Administrator
  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      showToast("Please fill in required credentials.");
      return;
    }

    const tempPass = formPasswordMode === "auto" 
      ? "TAPCO_" + Math.random().toString(36).slice(-8).toUpperCase() + "!" 
      : formPassword;

    const newAdmin: Admin = {
      id: "ADM-0" + (admins.length + 1),
      name: formName,
      email: formEmail,
      phone: formPhone || "+234 812 000 0000",
      department: formDepartment,
      jobTitle: formJobTitle || ROLES_LIST.find(r => r.id === formRole)?.name + " Lead" || "Operator",
      role: formRole,
      status: "active",
      mfaEnabled: formMfa,
      lastLogin: "Never Logged In",
      activeSessions: 0,
      photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces",
      permissions: ROLE_PERMISSION_TEMPLATES[formRole] || ROLE_PERMISSION_TEMPLATES.readonly_auditor,
      loginHistory: []
    };

    setAdmins([newAdmin, ...admins]);
    addAuditLog(`Administrator Created: ${newAdmin.name} (${newAdmin.email})`, loginEmail, "SUCCESS");
    
    // Log Security events
    const newSecEvent = {
      id: "SEC-" + Math.floor(904 + Math.random() * 900),
      user: loginEmail,
      event: `Administrator Created: ${newAdmin.name}`,
      time: "Just Now",
      ip: "197.210.64.22",
      device: "MacBook Pro M3",
      browser: "Chrome v126"
    };
    setSecurityEvents([newSecEvent, ...securityEvents]);

    // Dispatch simulated credentials email
    sendSimulatedEmail(
      newAdmin.email,
      "TAPCO Security Center: New Administrator Credentials Assigned",
      `Hello ${newAdmin.name},\n\nAn administrative account has been provisioned for you at the TAPCO Control Center.\n\nYour Temporary Password: ${tempPass}\nTemporary Status: ACTIVE\nTwo-Factor Status: ${newAdmin.mfaEnabled ? "ENFORCED" : "OPTIONAL"}\nRole Tier: ${ROLES_LIST.find(r => r.id === newAdmin.role)?.name}\n\nPlease click the Instant Magic link below to log in and set your profile settings.`
    );

    showToast(`Admin ${newAdmin.name} created successfully.`);
    // Reset Form
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormJobTitle("");
    setFormPassword("");
    setActiveSubTab("directory");
  };

  // Handle Send Invitation
  const handleSendInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      showToast("Please enter an invitation target email.");
      return;
    }

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + inviteExpiryHours);
    const formattedExpiry = expiryDate.toISOString().replace("T", " ").substring(0, 16) + " UTC";

    const newInvite = {
      id: "INV-" + Math.floor(503 + Math.random() * 900),
      email: inviteEmail,
      role: inviteRole,
      department: inviteDept,
      invitedBy: loginEmail,
      expiry: formattedExpiry,
      status: "Pending"
    };

    setInvites([newInvite, ...invites]);
    addAuditLog(`Security Invitation Issued: ${inviteEmail}`, loginEmail, "SUCCESS");

    // Secure URL Setup Token for Sandbox instant onboarding
    const secureToken = Math.random().toString(36).slice(2, 10).toUpperCase();

    // Send Simulated Email with secure activation link
    sendSimulatedEmail(
      inviteEmail,
      `TAPCO Control Center: Security Invitation Workspace Access Required (${inviteRole.toUpperCase()})`,
      `Hello,\n\nYou have been invited by the Super Admin to join the secure TAPCO Control Center team.\n\nAssigned Role: ${ROLES_LIST.find(r => r.id === inviteRole)?.name}\nDepartment: ${inviteDept}\nInvitation Expiration: ${formattedExpiry} (${inviteExpiryHours} Hours)\n\nPlease click the Setup Account wizard in this email to activate your administrator dashboard file.`,
      secureToken
    );

    showToast(`Invitation dispatched to ${inviteEmail}.`);
    setInviteEmail("");
  };

  // Force Logout session
  const forceLogoutSession = (adminId: string) => {
    setAdmins(admins.map(a => {
      if (a.id === adminId) {
        addAuditLog(`Force Logout: Cleared all active sessions for ${a.name}`, loginEmail, "WARNING");
        showToast(`Terminated active sessions for ${a.name}`);
        return { ...a, activeSessions: 0 };
      }
      return a;
    }));
    // Append to security logs
    setSecurityEvents([
      {
        id: "SEC-" + Math.floor(904 + Math.random() * 900),
        user: loginEmail,
        event: `Force Logout Session: ${adminId}`,
        time: "Just Now",
        ip: "197.210.64.22",
        device: "MacBook Pro M3",
        browser: "Chrome v126"
      },
      ...securityEvents
    ]);
  };

  // Toggle Deactivate / Suspend account
  const toggleAccountStatus = (adminId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    setAdmins(admins.map(a => {
      if (a.id === adminId) {
        addAuditLog(`Account Status Modified: ${a.name} is now ${nextStatus.toUpperCase()}`, loginEmail, "WARNING");
        showToast(`Administrator account is now ${nextStatus}`);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
    // Append to security logs
    setSecurityEvents([
      {
        id: "SEC-" + Math.floor(904 + Math.random() * 900),
        user: loginEmail,
        event: `Account Status Modified: ${adminId} to ${nextStatus}`,
        time: "Just Now",
        ip: "197.210.64.22",
        device: "MacBook Pro M3",
        browser: "Chrome v126"
      },
      ...securityEvents
    ]);
    if (selectedAdmin && selectedAdmin.id === adminId) {
      setSelectedAdmin({ ...selectedAdmin, status: nextStatus });
    }
  };

  // Delete Administrator Account
  const deleteAdminAccount = (adminId: string, name: string) => {
    if (adminId === "ADM-001") {
      showToast("Critical Safeguard: You cannot delete the primary Super Admin root account!");
      return;
    }
    setAdmins(admins.filter(a => a.id !== adminId));
    addAuditLog(`Account Deleted: ${name} (${adminId})`, loginEmail, "WARNING");
    showToast(`Deleted admin account ${name}.`);
    setSelectedAdmin(null);
  };

  // Reset password
  const triggerPasswordReset = (adminId: string, name: string, email: string) => {
    const tempPass = "TAPCO_RST_" + Math.floor(1000 + Math.random() * 9000) + "!";
    addAuditLog(`Password Reset Forced: Generated temporary credentials for ${name}`, loginEmail, "WARNING");
    showToast(`Credentials reset successfully for ${name}. Temporary password dispatched to channel.`);

    sendSimulatedEmail(
      email,
      "TAPCO Security Hub: Administrator Password Reset Notification",
      `Hello ${name},\n\nYour TAPCO administrator password has been reset by the Super Admin.\n\nTemporary Password: ${tempPass}\n\nPlease authenticate immediately using these temporary credentials and configure your MFA settings.`
    );
  };

  // Customize Granular Permissions
  const handlePermissionToggle = (module: string, type: string) => {
    if (!selectedAdmin) return;
    const currentPerms = selectedAdmin.permissions[module] || [];
    let updatedPerms = [...currentPerms];
    if (currentPerms.includes(type)) {
      updatedPerms = updatedPerms.filter(t => t !== type);
    } else {
      updatedPerms.push(type);
    }

    const updatedAdmin = {
      ...selectedAdmin,
      permissions: {
        ...selectedAdmin.permissions,
        [module]: updatedPerms
      }
    };

    setSelectedAdmin(updatedAdmin);
    setAdmins(admins.map(a => a.id === selectedAdmin.id ? updatedAdmin : a));
    addAuditLog(`Permission Map Updated: ${selectedAdmin.name} (${module} - ${type})`, loginEmail, "SUCCESS");
  };

  // Stats Counters
  const totalCount = admins.length;
  const activeCount = admins.filter(a => a.status === "active").length;
  const suspendedCount = admins.filter(a => a.status === "suspended").length;
  const mfaEnabledCount = admins.filter(a => a.mfaEnabled).length;
  const mfaRatio = totalCount > 0 ? Math.round((mfaEnabledCount / totalCount) * 100) : 0;

  // Filter and Search admins
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          admin.phone.includes(searchQuery) ||
                          admin.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || admin.role === roleFilter;
    const matchesStatus = statusFilter === "all" || admin.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* MODULE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0057B8] flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" /> Identity & Access Governance
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">Administrator Management Center</h2>
          <p className="text-xs text-slate-400 font-medium">Configure team roles, manage zero-trust permission structures, monitor security events, and audit access credentials.</p>
        </div>
        
        {/* Subtab controls */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0 text-xs font-bold font-sans">
          <button
            onClick={() => setActiveSubTab("directory")}
            className={`px-4 py-2 rounded-xl transition ${activeSubTab === "directory" ? "bg-white text-[#0057B8] shadow-sm" : "text-slate-500 hover:text-slate-950"}`}
          >
            Admins Directory ({admins.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab("create");
              // Set up an auto password
              setFormPassword("TAPCO_" + Math.random().toString(36).slice(-8).toUpperCase() + "!");
            }}
            className={`px-4 py-2 rounded-xl transition ${activeSubTab === "create" ? "bg-white text-[#0057B8] shadow-sm" : "text-slate-500 hover:text-slate-950"}`}
          >
            Add Administrator
          </button>
          <button
            onClick={() => setActiveSubTab("invites")}
            className={`px-4 py-2 rounded-xl transition ${activeSubTab === "invites" ? "bg-white text-[#0057B8] shadow-sm" : "text-slate-500 hover:text-slate-950"}`}
          >
            Email Invitations ({invites.length})
          </button>
          <button
            onClick={() => setActiveSubTab("security_audits")}
            className={`px-4 py-2 rounded-xl transition ${activeSubTab === "security_audits" ? "bg-white text-[#0057B8] shadow-sm" : "text-slate-500 hover:text-slate-950"}`}
          >
            Security Telemetry Logs
          </button>
        </div>
      </div>

      {/* REVOLVING METRICS GRID (OKTA DESIGN) */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Governance Seats", val: `${totalCount} Registered`, desc: "Total administrative licenses in use", icon: Users, color: "text-[#0057B8] bg-blue-50 border-blue-100" },
          { title: "Active Credentials", val: `${activeCount} Active`, desc: "Staff currently authenticated with active leases", icon: UserCheck, color: "text-[#00A651] bg-emerald-50 border-emerald-100" },
          { title: "Risk Mitigation", val: `${suspendedCount} Suspended`, desc: "Compromised or deactivated operator licenses", icon: Lock, color: "text-rose-600 bg-rose-50 border-rose-100" },
          { title: "2FA Enforcement", val: `${mfaRatio}% MFA`, desc: "Two-factor authenticator app enforcement score", icon: Shield, color: "text-indigo-600 bg-indigo-50 border-indigo-100" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between transition hover:shadow-md">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">{stat.title}</span>
              <p className="text-lg font-black text-slate-900 leading-none">{stat.val}</p>
              <span className="text-[10px] text-slate-400 font-semibold block">{stat.desc}</span>
            </div>
            <div className={`h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* TAB SUBPANEL RENDERERS */}
      
      {/* SUBPANEL 1: ADMIN DIRECTORY */}
      {activeSubTab === "directory" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search administrators by name, email, department..."
                className="pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0057B8] transition-all w-full"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs">
              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold text-slate-700 cursor-pointer text-xs"
              >
                <option value="all">All Roles Available</option>
                {ROLES_LIST.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold text-slate-700 cursor-pointer text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Accounts</option>
                <option value="suspended">Suspended Accounts</option>
              </select>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                  showToast("Cleared filters.");
                }}
                className="px-3.5 py-2 hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 hover:text-slate-900 transition flex items-center gap-1"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Directory Table (Google Workspace Admin design) */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 uppercase text-[9px] tracking-wider font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-4">Administrator / Identity Profile</th>
                  <th className="px-5 py-4">Access Clearance Role</th>
                  <th className="px-5 py-4">Department Station</th>
                  <th className="px-5 py-4">Status & MFA</th>
                  <th className="px-5 py-4">Last Activity Telemetry</th>
                  <th className="px-5 py-4 text-right">Actions Panel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600 bg-white">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-bold">
                      No administrator directory files match current search query or filter context.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50/50 transition">
                      {/* Identity profile */}
                      <td className="px-5 py-4.5 flex items-center gap-3">
                        <img
                          src={admin.photoUrl}
                          alt={admin.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200/50 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <span className="block font-black text-slate-900 truncate">{admin.name}</span>
                          <span className="text-[10px] text-slate-400 block font-mono font-semibold truncate">{admin.email}</span>
                        </div>
                      </td>

                      {/* Access Clearance */}
                      <td className="px-5 py-4.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0057B8] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg uppercase">
                          <Shield className="h-3 w-3 shrink-0" /> {ROLES_LIST.find(r => r.id === admin.role)?.name || admin.role}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4.5 font-bold text-slate-500">
                        {admin.department}
                        <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">{admin.jobTitle}</span>
                      </td>

                      {/* Status and MFA */}
                      <td className="px-5 py-4.5 space-y-1">
                        <div>
                          {admin.status === "active" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[9px] font-black uppercase text-[#00A651]">
                              Active Account
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-100 px-2.5 py-0.5 text-[9px] font-black uppercase text-rose-600 animate-pulse">
                              Suspended
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                          <Key className={`h-3 w-3 ${admin.mfaEnabled ? "text-[#00A651]" : "text-slate-300"}`} />
                          <span>{admin.mfaEnabled ? "MFA Enabled" : "No MFA (Risk)"}</span>
                        </div>
                      </td>

                      {/* Last login telemetry */}
                      <td className="px-5 py-4.5 space-y-1">
                        <div className="flex items-center gap-1 text-slate-700 font-bold">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-[11px] truncate max-w-[130px]">{admin.lastLogin}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-semibold">
                          Sessions active: <strong className="text-slate-900">{admin.activeSessions}</strong>
                        </span>
                      </td>

                      {/* Actions Panel */}
                      <td className="px-5 py-4.5 text-right">
                        <div className="inline-flex gap-2.5">
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setIsEditingPermissions(false);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                          >
                            <Sliders className="h-3.5 w-3.5" /> Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBPANEL 2: ADD ADMINISTRATOR */}
      {activeSubTab === "create" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <PlusCircle className="h-4.5 w-4.5 text-[#0057B8]" /> Profile Sizing & Credentials Provisioning
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Specify full administrative details. The system will auto-assign permissions and notify the operator instantly.</p>
            </div>

            <form onSubmit={handleAddAdminSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Full Administrative Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ibrahim Abubakar"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-xs bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#0057B8]"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Corporate Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="abubakar@tapco.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-xs bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#0057B8]"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Mobile Contact Number (WhatsApp Proxy)</label>
                  <input
                    type="text"
                    placeholder="+234 812 000 0000"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-xs bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#0057B8]"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Department Station</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-xs bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#0057B8] cursor-pointer"
                    value={formDepartment}
                    onChange={e => setFormDepartment(e.target.value)}
                  >
                    <option value="Executive Office">Executive Office</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Finance">Finance</option>
                    <option value="Training Academy">Training Academy</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Support">Support</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Specific Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Lithium Battery Specialist"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-xs bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#0057B8]"
                    value={formJobTitle}
                    onChange={e => setFormJobTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Identity Access Role</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-xs bg-slate-50/50 text-[#0057B8] font-bold focus:bg-white focus:outline-none focus:border-[#0057B8] cursor-pointer"
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                  >
                    {ROLES_LIST.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Secure Credentials Setups */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase">Two-Factor Authentication (MFA) Policy</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Enforces authenticator app enrollment on initial user login session.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formMfa}
                      onChange={e => setFormMfa(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0057B8]" />
                  </label>
                </div>

                <div className="space-y-3.5 pt-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Password Provisioning Protocol</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormPasswordMode("auto")}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase transition ${formPasswordMode === "auto" ? "bg-slate-900 border-slate-900 text-white" : "border-slate-200 text-slate-400 hover:text-slate-900"}`}
                      >
                        Auto-Generate Secure Pass
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormPasswordMode("manual")}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase transition ${formPasswordMode === "manual" ? "bg-slate-900 border-slate-900 text-white" : "border-slate-200 text-slate-400 hover:text-slate-900"}`}
                      >
                        Manual Assignment
                      </button>
                    </div>
                  </div>

                  {formPasswordMode === "manual" ? (
                    <div className="space-y-1 animate-fade-in">
                      <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Manual Secure Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Assign custom temporary password..."
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-xs bg-white text-slate-800 focus:outline-none focus:border-[#0057B8]"
                        value={formPassword}
                        onChange={e => setFormPassword(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-left flex justify-between items-center font-mono text-xs animate-fade-in">
                      <div>
                        <span className="block text-[8px] uppercase font-black text-slate-500 tracking-wider">Automatic Secure Token</span>
                        <code className="text-emerald-500 font-semibold">{formPassword}</code>
                      </div>
                      <span className="text-[9px] text-slate-500 font-extrabold uppercase">FIPS Compliant</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("directory")}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-xs font-black uppercase text-slate-500 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 text-white px-8 py-3 font-extrabold text-xs uppercase tracking-wider transition shadow-md shadow-[#0057B8]/10"
                >
                  Authorize Profile Lease
                </button>
              </div>
            </form>
          </div>

          {/* Quick Info Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 text-slate-200 rounded-3xl border border-slate-800 p-6 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-3">
                <Shield className="text-[#00A651] h-4.5 w-4.5" /> Identity Provisioning Policies
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Upon submitting the form, the operator's record will be written to the secure directory database with an active lease.
              </p>
              <div className="space-y-3 pt-2 text-[11px] text-slate-400 font-semibold">
                <div className="flex gap-2">
                  <div className="h-5 w-5 bg-[#00A651]/10 text-[#00A651] rounded-full flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                  <span>Temporary passwords automatically enforce change on initial access.</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-5 w-5 bg-[#00A651]/10 text-[#00A651] rounded-full flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                  <span>Permissions correspond to enterprise role matrix defaults, custom override enabled post-provisioning.</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-5 w-5 bg-[#00A651]/10 text-[#00A651] rounded-full flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                  <span>Credentials are encrypted using GCM-AES256 keys.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBPANEL 3: EMAIL INVITATIONS */}
      {activeSubTab === "invites" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Send Invitation Form */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 h-fit">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <Send className="h-4.5 w-4.5 text-[#0057B8]" /> Dispatch Secure Invite Link
              </h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1">Invites allow staff to securely configure their passwords and register themselves into directory slots.</p>
            </div>

            <form onSubmit={handleSendInviteSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Recipient Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@tapco.com"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#0057B8]"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Access Clearance Role</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-slate-50/50 text-[#0057B8] font-bold focus:bg-white focus:outline-none focus:border-[#0057B8] cursor-pointer"
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                >
                  {ROLES_LIST.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Department Station</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#0057B8] cursor-pointer"
                  value={inviteDept}
                  onChange={e => setInviteDept(e.target.value)}
                >
                  <option value="Executive Office">Executive Office</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Finance">Finance</option>
                  <option value="Training Academy">Training Academy</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Support">Support</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Invite Expiration Lease</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#0057B8] cursor-pointer"
                  value={inviteExpiryHours}
                  onChange={e => setInviteExpiryHours(parseInt(e.target.value) || 48)}
                >
                  <option value={48}>48 Hours (FIPS Recommended)</option>
                  <option value={72}>72 Hours Lease</option>
                  <option value={24}>24 Hours Express</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 text-white py-3 font-extrabold text-xs uppercase tracking-wider transition shadow-md shadow-[#0057B8]/10"
              >
                Dispatch Secure Invitation
              </button>
            </form>
          </div>

          {/* Invitation Log */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-bold">Active Security Invitations</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 uppercase text-[9px] tracking-wider font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Invitation target</th>
                    <th className="px-4 py-3">Assigned Role & Dept</th>
                    <th className="px-4 py-3">Expiry Time</th>
                    <th className="px-4 py-3 text-right">Status & Magic Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600 bg-white">
                  {invites.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3.5">
                        <span className="block font-black text-slate-900">{inv.email}</span>
                        <span className="text-[10px] text-slate-400 block font-mono font-semibold">Token: {inv.id}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="block font-bold text-slate-700">{ROLES_LIST.find(r => r.id === inv.role)?.name}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold">{inv.department}</span>
                      </td>
                      <td className="px-4 py-3.5 font-bold font-mono text-slate-500 text-[11px]">{inv.expiry}</td>
                      <td className="px-4 py-3.5 text-right space-y-1">
                        <div>
                          {inv.status === "Pending" ? (
                            <span className="rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 text-[9px] font-black uppercase text-amber-600 animate-pulse">
                              Pending Setup
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase text-slate-400">
                              Expired
                            </span>
                          )}
                        </div>
                        {inv.status === "Pending" && (
                          <button
                            onClick={() => {
                              // Simulate client clicked activation
                              const activationPassword = "TAPCO_SETUP_" + Math.random().toString(36).slice(-6).toUpperCase() + "!";
                              const newJoinedAdmin: Admin = {
                                id: "ADM-0" + (admins.length + 1),
                                name: inv.email.split("@")[0].toUpperCase().replace(".", " "),
                                email: inv.email,
                                phone: "+234 812 000 0000",
                                department: inv.department,
                                jobTitle: ROLES_LIST.find(r => r.id === inv.role)?.name || "Officer",
                                role: inv.role,
                                status: "active",
                                mfaEnabled: true,
                                lastLogin: "Just Onboarded",
                                activeSessions: 1,
                                photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces",
                                permissions: ROLE_PERMISSION_TEMPLATES[inv.role] || ROLE_PERMISSION_TEMPLATES.readonly_auditor,
                                loginHistory: [{ date: "2026-07-02", time: "Just Now", ip: "197.210.64.22", device: "Admin Setup Portal", browser: "Chrome v126", location: "Abuja, NG" }]
                              };
                              setAdmins([newJoinedAdmin, ...admins]);
                              setInvites(invites.map(i => i.id === inv.id ? { ...i, status: "Activated" } : i));
                              addAuditLog(`Onboarding Completed: ${inv.email} joins as ${inv.role}`, loginEmail, "SUCCESS");
                              showToast(`Sandbox Onboard success! Added ${inv.email} to Admin Directory.`);
                            }}
                            className="text-[9px] text-slate-400 hover:text-[#0057B8] font-black uppercase hover:underline"
                          >
                            [Simulate User Activation]
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBPANEL 4: SECURITY TELEMETRY LOGS */}
      {activeSubTab === "security_audits" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">WAF Security Operations Logs</h3>
              <p className="text-[10px] text-slate-400 font-medium">FIPS audit log history. Immutable tamper-proof activity register.</p>
            </div>
            <button
              onClick={() => {
                showToast("Audit logs exported to Excel ledger format.");
                addAuditLog("Immutable Security Audit Logs Exported", loginEmail, "SUCCESS");
              }}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export Audit Ledger
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 uppercase text-[9px] tracking-wider font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Security Officer</th>
                  <th className="px-4 py-3">Security Event Action</th>
                  <th className="px-4 py-3 font-mono">Operator Telemetry (IP / Device)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-500 bg-white">
                {securityEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3 font-bold text-slate-400 text-[10px]">{evt.time}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{evt.user}</td>
                    <td className="px-4 py-3 text-slate-900 font-black flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> {evt.event}
                    </td>
                    <td className="px-4 py-3 text-[10px] leading-relaxed">
                      IP: <strong className="text-slate-800">{evt.ip}</strong> • Device: <span className="font-sans font-semibold text-slate-400">{evt.device} ({evt.browser})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FLYOUT OVERLAY DRAWER: ADMIN DEEP INSPECT & GRANULAR ACCESS REVISION */}
      {selectedAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl p-8 overflow-y-auto space-y-6 flex flex-col justify-between border-l border-slate-200">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase font-black text-[#0057B8] bg-blue-50 px-2.5 py-1 rounded">
                    LIC: {selectedAdmin.id}
                  </span>
                  <h3 className="text-base font-black text-slate-900">Administrator Credentials Review</h3>
                </div>
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Toggle Inspect Mode */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit text-[11px] font-bold">
                <button
                  onClick={() => setIsEditingPermissions(false)}
                  className={`px-3 py-1 rounded-lg transition ${!isEditingPermissions ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-900"}`}
                >
                  Profile & Actions
                </button>
                <button
                  onClick={() => setIsEditingPermissions(true)}
                  className={`px-3 py-1 rounded-lg transition ${isEditingPermissions ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-900"}`}
                >
                  Granular Permissions Matrix
                </button>
              </div>

              {!isEditingPermissions ? (
                /* PROFILE ACTIONS AND SECURITY OVERVIEW */
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-150">
                    <img
                      src={selectedAdmin.photoUrl}
                      alt={selectedAdmin.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900">{selectedAdmin.name}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-[#0057B8] uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {ROLES_LIST.find(r => r.id === selectedAdmin.role)?.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{selectedAdmin.department}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">{selectedAdmin.email} • {selectedAdmin.phone}</p>
                    </div>
                  </div>

                  {/* Operational Security controls */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Zero-Trust Command Panel</span>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {/* Active Toggle Status */}
                      <button
                        onClick={() => toggleAccountStatus(selectedAdmin.id, selectedAdmin.status)}
                        className={`p-3 rounded-2xl border text-xs font-bold text-left flex justify-between items-center transition cursor-pointer ${
                          selectedAdmin.status === "active" 
                            ? "bg-rose-50/50 border-rose-100 text-rose-700 hover:bg-rose-100/50" 
                            : "bg-emerald-50/50 border-emerald-100 text-emerald-700 hover:bg-emerald-100/50"
                        }`}
                      >
                        <div>
                          <span className="block font-black uppercase text-[10px]">
                            {selectedAdmin.status === "active" ? "Deactivate Account" : "Reactivate Account"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            {selectedAdmin.status === "active" ? "Temporarily suspend accesses" : "Unlock dashboard features"}
                          </span>
                        </div>
                        {selectedAdmin.status === "active" ? <Unlock className="h-4.5 w-4.5" /> : <Lock className="h-4.5 w-4.5" />}
                      </button>

                      {/* Reset Passwords */}
                      <button
                        onClick={() => triggerPasswordReset(selectedAdmin.id, selectedAdmin.name, selectedAdmin.email)}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-left flex justify-between items-center transition cursor-pointer"
                      >
                        <div>
                          <span className="block font-black uppercase text-[10px] text-slate-800">Reset Credentials</span>
                          <span className="text-[10px] text-slate-400 font-medium block">Force immediate password config</span>
                        </div>
                        <Key className="h-4.5 w-4.5 text-slate-400" />
                      </button>

                      {/* Force sessions logout */}
                      <button
                        onClick={() => forceLogoutSession(selectedAdmin.id)}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-left flex justify-between items-center transition cursor-pointer"
                      >
                        <div>
                          <span className="block font-black uppercase text-[10px] text-slate-800">Force Global Logout</span>
                          <span className="text-[10px] text-slate-400 font-medium block">Clear active device leases ({selectedAdmin.activeSessions})</span>
                        </div>
                        <RefreshCw className="h-4.5 w-4.5 text-slate-400" />
                      </button>

                      {/* Delete profile lease */}
                      <button
                        onClick={() => deleteAdminAccount(selectedAdmin.id, selectedAdmin.name)}
                        className="p-3 bg-rose-50/30 hover:bg-rose-100/20 border border-rose-100 rounded-2xl text-xs font-bold text-left flex justify-between items-center transition cursor-pointer"
                      >
                        <div>
                          <span className="block font-black uppercase text-[10px] text-rose-600">Delete Operator Slot</span>
                          <span className="text-[10px] text-rose-400 font-medium block">Irreversibly delete admin slot</span>
                        </div>
                        <Trash className="h-4.5 w-4.5 text-rose-500" />
                      </button>
                    </div>
                  </div>

                  {/* Telemetry log summaries */}
                  <div className="bg-slate-50/50 p-4 border border-slate-150 rounded-2xl space-y-3">
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Access History Telemetry</span>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedAdmin.loginHistory.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-bold">No active telemetry logged for this administrator yet.</p>
                      ) : (
                        selectedAdmin.loginHistory.map((hist, idx) => (
                          <div key={idx} className="flex justify-between text-[10px] border-b border-slate-100 pb-2 last:border-none">
                            <div>
                              <strong className="text-slate-800 font-mono">{hist.ip}</strong>
                              <span className="block text-slate-400 font-semibold">{hist.device} • {hist.browser}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-slate-700 block">{hist.date} {hist.time}</span>
                              <span className="text-slate-400 block font-semibold">{hist.location}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* GRANULAR PERMISSIONS MATRIX CHANGER */
                <div className="space-y-4 text-left animate-fade-in">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase">Enterprise Modules Permissions Matrix</h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">Toggle fine-grained View, Create, Edit, Delete, or Export permissions over discrete system scopes.</p>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {MODULES.map(module => {
                      const activePerms = selectedAdmin.permissions[module] || [];
                      return (
                        <div key={module} className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <span className="text-xs font-black text-slate-900 block sm:w-28 shrink-0">{module}</span>
                          
                          <div className="flex flex-wrap gap-1.5">
                            {PERMISSIONS_TYPES.map(type => {
                              const isChecked = activePerms.includes(type);
                              return (
                                <button
                                  key={type}
                                  onClick={() => handlePermissionToggle(module, type)}
                                  className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase transition flex items-center gap-1 cursor-pointer ${
                                    isChecked 
                                      ? "bg-[#0057B8] border-[#0057B8] text-white" 
                                      : "bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-350"
                                  }`}
                                >
                                  {isChecked && <Check className="h-3 w-3" />}
                                  <span>{type}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAdmin(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition"
              >
                Close File Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
