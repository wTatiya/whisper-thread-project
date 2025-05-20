
export interface Comment {
  id: string;
  text: string;
  isAdmin: boolean;
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
export const addComment = (ticketId: string, text: string, isAdmin: boolean): Comment | null => {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex === -1) return null;
  
  const comment: Comment = {
    id: generateId(),
    text,
    isAdmin,
    createdAt: new Date().toISOString()
  };
  
  tickets[ticketIndex].comments.push(comment);
  saveTickets(tickets);
  
  return comment;
};

// Get admin password from localStorage (this is just for demo - would use a real auth system)
export const getAdminPassword = (): string => {
  const adminPassword = localStorage.getItem('whistleblower-admin-password');
  if (!adminPassword) {
    // Set a default admin password if none exists (in a real app, this would be properly set up)
    const defaultPassword = 'admin123';
    localStorage.setItem('whistleblower-admin-password', defaultPassword);
    return defaultPassword;
  }
  return adminPassword;
};

// Verify admin password
export const verifyAdminPassword = (password: string): boolean => {
  return password === getAdminPassword();
};
