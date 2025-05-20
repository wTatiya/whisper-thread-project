
export interface Comment {
  id: string;
  text: string;
  isAdmin: boolean;
  adminUsername?: string;
  adminName?: string;
  adminTitle?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  password: string;
  createdAt: string;
  comments: Comment[];
}

export interface AdminUser {
  username: string;
  password: string;
  name: string;
  email: string;
  title: string;
  isSuperAdmin: boolean;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  adminUsername: string;
  action: string;
  timestamp: string;
  details?: string;
}

// Function to generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Function to generate a secure password
export const generatePassword = (): string => {
  return Math.random().toString(36).substring(2, 10) + 
         Math.random().toString(36).substring(2, 10);
};

// Get all tickets from localStorage
export const getTickets = (): Ticket[] => {
  const tickets = localStorage.getItem('whistleblower-tickets');
  return tickets ? JSON.parse(tickets) : [];
};

// Save tickets to localStorage
export const saveTickets = (tickets: Ticket[]): void => {
  localStorage.setItem('whistleblower-tickets', JSON.stringify(tickets));
};

// Get admin users from localStorage
export const getAdminUsers = (): AdminUser[] => {
  const admins = localStorage.getItem('whistleblower-admins');
  if (!admins) {
    // Initialize with the main admin account
    const defaultAdmin: AdminUser = {
      username: '5650414',
      password: 'Wise160141',
      name: 'Super Admin',
      email: 'admin@example.com',
      title: 'Main Administrator',
      isSuperAdmin: true,
      createdAt: new Date().toISOString()
    };
    
    saveAdminUsers([defaultAdmin]);
    return [defaultAdmin];
  }
  
  return JSON.parse(admins);
};

// Save admin users to localStorage
export const saveAdminUsers = (admins: AdminUser[]): void => {
  localStorage.setItem('whistleblower-admins', JSON.stringify(admins));
};

// Get admin logs from localStorage
export const getAdminLogs = (): AdminLog[] => {
  const logs = localStorage.getItem('whistleblower-admin-logs');
  return logs ? JSON.parse(logs) : [];
};

// Save admin logs to localStorage
export const saveAdminLogs = (logs: AdminLog[]): void => {
  localStorage.setItem('whistleblower-admin-logs', JSON.stringify(logs));
};

// Log admin activity
export const logAdminActivity = (adminUsername: string, action: string, details?: string): void => {
  const logs = getAdminLogs();
  const newLog: AdminLog = {
    id: generateId(),
    adminUsername,
    action,
    timestamp: new Date().toISOString(),
    details
  };
  
  saveAdminLogs([newLog, ...logs]);
};

// Get ticket by ID and password
export const getTicketByIdAndPassword = (id: string, password: string): Ticket | undefined => {
  const tickets = getTickets();
  return tickets.find(ticket => ticket.id === id && ticket.password === password);
};

// Get ticket by ID (for admin use only)
export const getTicketById = (id: string): Ticket | undefined => {
  const tickets = getTickets();
  return tickets.find(ticket => ticket.id === id);
};

// Add a new ticket
export const addTicket = (title: string, description: string): { ticket: Ticket, password: string } => {
  const id = generateId();
  const password = generatePassword();
  const newTicket: Ticket = {
    id,
    title,
    description,
    status: 'new',
    password,
    createdAt: new Date().toISOString(),
    comments: []
  };
  
  const tickets = getTickets();
  saveTickets([...tickets, newTicket]);
  
  return { ticket: newTicket, password };
};

// Update a ticket
export const updateTicket = (updatedTicket: Ticket): boolean => {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => t.id === updatedTicket.id);
  
  if (ticketIndex === -1) return false;
  
  tickets[ticketIndex] = updatedTicket;
  saveTickets(tickets);
  return true;
};

// Add a comment to a ticket
export const addComment = (ticketId: string, text: string, isAdmin: boolean, adminUsername?: string): Comment | null => {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex === -1) return null;
  
  let adminName, adminTitle;
  if (isAdmin && adminUsername) {
    const admins = getAdminUsers();
    const admin = admins.find(a => a.username === adminUsername);
    if (admin) {
      adminName = admin.name;
      adminTitle = admin.title;
    }
  }
  
  const comment: Comment = {
    id: generateId(),
    text,
    isAdmin,
    adminUsername: isAdmin ? adminUsername : undefined,
    adminName: isAdmin ? adminName : undefined,
    adminTitle: isAdmin ? adminTitle : undefined,
    createdAt: new Date().toISOString()
  };
  
  tickets[ticketIndex].comments.push(comment);
  saveTickets(tickets);
  
  if (isAdmin && adminUsername) {
    logAdminActivity(adminUsername, 'add_comment', `Added comment to ticket ${ticketId}`);
  }
  
  return comment;
};

// Verify admin password
export const verifyAdminPassword = (username: string, password: string): AdminUser | null => {
  const admins = getAdminUsers();
  const admin = admins.find(a => a.username === username && a.password === password);
  
  if (admin) {
    logAdminActivity(admin.username, 'login', 'Administrator login successful');
    return admin;
  }
  
  return null;
};

// Add a new admin user (super admin only)
export const addAdminUser = (currentAdmin: string, newAdmin: Omit<AdminUser, 'isSuperAdmin' | 'createdAt'>): boolean => {
  const admins = getAdminUsers();
  const admin = admins.find(a => a.username === currentAdmin && a.isSuperAdmin);
  
  if (!admin) return false; // Only super admin can add other admins
  
  if (admins.some(a => a.username === newAdmin.username)) {
    return false; // Username already exists
  }
  
  const adminUser: AdminUser = {
    ...newAdmin,
    isSuperAdmin: false,
    createdAt: new Date().toISOString()
  };
  
  admins.push(adminUser);
  saveAdminUsers(admins);
  
  logAdminActivity(currentAdmin, 'add_admin', `Added new admin: ${newAdmin.username}`);
  
  return true;
};

// Check if user is super admin
export const isSuperAdmin = (username: string): boolean => {
  const admins = getAdminUsers();
  const admin = admins.find(a => a.username === username);
  return admin?.isSuperAdmin || false;
};

// Delete an admin user (super admin only)
export const deleteAdminUser = (currentAdmin: string, usernameToDelete: string): boolean => {
  const admins = getAdminUsers();
  const admin = admins.find(a => a.username === currentAdmin && a.isSuperAdmin);
  
  if (!admin) return false; // Only super admin can delete admins
  if (currentAdmin === usernameToDelete) return false; // Cannot delete yourself
  
  const updatedAdmins = admins.filter(a => a.username !== usernameToDelete);
  
  if (updatedAdmins.length === admins.length) {
    return false; // Admin not found
  }
  
  saveAdminUsers(updatedAdmins);
  logAdminActivity(currentAdmin, 'delete_admin', `Deleted admin: ${usernameToDelete}`);
  
  return true;
};
