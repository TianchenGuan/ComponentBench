import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific data_grid_editable components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Order row data type
 */
export interface OrderRow {
  key: string;
  orderId: string;
  customer: string;
  quantity: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Cancelled';
  notes: string;
  paid: boolean;
}

/**
 * Invoice row data type
 */
export interface InvoiceRow {
  key: string;
  invoiceId: string;
  customer: string;
  quantity: number;
  notes: string;
}

/**
 * Inventory row data type
 */
export interface InventoryRow {
  key: string;
  sku: string;
  item: string;
  quantity: number;
  location: string;
}

/**
 * Returns row data type
 */
export interface ReturnsRow {
  key: string;
  returnId: string;
  reason: string;
  status: 'Requested' | 'Under Review' | 'Approved' | 'Denied';
  notes: string;
}

/**
 * Support ticket row data type
 */
export interface TicketRow {
  key: string;
  ticketId: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  owner: string;
}

/**
 * Delivery row data type
 */
export interface DeliveryRow {
  key: string;
  orderId: string;
  destination: string;
  dueDate: string;
  notes: string;
}

/**
 * Team assignment row data type
 */
export interface TeamAssignmentRow {
  key: string;
  taskId: string;
  title: string;
  assignee: string;
  status: string;
}

/**
 * Policy row data type
 */
export interface PolicyRow {
  key: string;
  policyId: string;
  region: string;
  maxRefund: number;
  active: boolean;
}

/**
 * Vendor row data type
 */
export interface VendorRow {
  key: string;
  vendorId: string;
  company: string;
  contact: string;
  email: string;
}

/**
 * MUI Users row data type
 */
export interface UserRow {
  id: number;
  name: string;
  age: number;
  role: 'Staff' | 'Manager' | 'Director' | 'Designer';
  active: boolean;
  notes: string;
}

/**
 * MUI Orders row data type
 */
export interface MuiOrderRow {
  id: number;
  orderId: string;
  customer: string;
  amount: number;
  status: 'New' | 'Processing' | 'Shipped' | 'Cancelled' | 'Paid' | 'Pending' | 'Overdue';
}

/**
 * MUI Employees row data type
 */
export interface EmployeeRow {
  id: number;
  name: string;
  role: 'Staff' | 'Manager' | 'Director' | 'Designer';
  location: string;
}

/**
 * MUI Projects row data type
 */
export interface ProjectRow {
  id: number;
  project: string;
  budget: number;
  owner: string;
}

/**
 * MUI Invoice row data type
 */
export interface MuiInvoiceRow {
  id: string;
  customer: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Overdue';
}

/**
 * MUI Backlog row data type
 */
export interface BacklogRow {
  id: string;
  title: string;
  owner: string;
  status: string;
}

/**
 * MUI Tickets row data type
 */
export interface MuiTicketRow {
  id: number;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  owner: string;
}

/**
 * MUI Notes row data type
 */
export interface NotesRow {
  id: number;
  notes: string;
  updated: string;
}

/**
 * MUI Schedule row data type
 */
export interface ScheduleRow {
  id: number;
  task: string;
  startDate: string;
  owner: string;
}

/**
 * MUI Team assignment row data type
 */
export interface MuiTeamAssignmentRow {
  id: string;
  title: string;
  assignee: string;
  due: string;
}

/**
 * MUI Records row data type
 */
export interface RecordsRow {
  id: number;
  name: string;
  age: number;
  status: 'New' | 'Active' | 'Archived';
}
