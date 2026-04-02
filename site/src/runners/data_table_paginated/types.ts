import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific data_table_paginated components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Order row data type (for antd)
 */
export interface OrderRow {
  key: string;
  orderId: string;
  customer: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  total: number;
  orderDate: string;
}

/**
 * User row data type (for MUI)
 */
export interface UserRow {
  id: string;
  name: string;
  role: 'Admin' | 'User' | 'Manager' | 'Guest';
  status: 'Active' | 'Inactive' | 'Pending';
  lastSeen: string;
  email: string;
}

/**
 * Product row data type (for Mantine)
 */
export interface ProductRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

/**
 * Invoice row data type (for Mantine match reference)
 */
export interface InvoiceRow {
  id: string;
  invoiceId: string;
  customer: string;
  amount: number;
  flagColor: string;
  flagIcon: string;
}

/**
 * Sales record row data type (for Mantine 3-instance dashboard)
 */
export interface SalesRecordRow {
  id: string;
  recordId: string;
  rep: string;
  amount: number;
  date: string;
}

/**
 * Generates order data for antd tasks
 */
export function generateOrderData(count: number, startId: number = 1001): OrderRow[] {
  const statuses: OrderRow['status'][] = ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
  const customers = [
    'John Smith', 'Jane Doe', 'Bob Wilson', 'Alice Brown', 'Charlie Davis',
    'Diana Miller', 'Eve Johnson', 'Frank Garcia', 'Grace Lee', 'Henry Taylor',
    'Ivy Chen', 'Jack White', 'Kate Black', 'Leo Green', 'Mary Blue',
  ];
  
  const data: OrderRow[] = [];
  for (let i = 0; i < count; i++) {
    const id = startId + i;
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + Math.floor(Math.random() * 365));
    
    data.push({
      key: `A-${id}`,
      orderId: `A-${id}`,
      customer: customers[i % customers.length],
      status: statuses[i % statuses.length],
      total: Math.round((50 + Math.random() * 450) * 100) / 100,
      orderDate: date.toISOString().split('T')[0],
    });
  }
  return data;
}

/**
 * Generates user data for MUI tasks
 */
export function generateUserData(count: number): UserRow[] {
  const roles: UserRow['role'][] = ['Admin', 'User', 'Manager', 'Guest'];
  const statuses: UserRow['status'][] = ['Active', 'Inactive', 'Pending'];
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mary', 'Nick', 'Olivia', 'Paul', 'Quinn', 'Rose'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Chen', 'Lee', 'Wilson', 'Moore', 'Taylor'];
  
  const data: UserRow[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const id = `U-${String(i + 1).padStart(4, '0')}`;
    const date = new Date(2024, 0, 1);
    date.setHours(date.getHours() + Math.floor(Math.random() * 8760));
    
    data.push({
      id,
      name: `${firstName} ${lastName}`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      lastSeen: date.toISOString(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    });
  }
  
  // Insert specific user for search task
  const mariaIndex = data.findIndex(u => u.id === 'U-0137');
  if (mariaIndex >= 0) {
    data[mariaIndex].name = 'Maria Chen';
    data[mariaIndex].email = 'maria.chen@example.com';
  }
  
  return data;
}

/**
 * Generates product data for Mantine tasks
 */
export function generateProductData(count: number): ProductRow[] {
  const categories = ['Electronics', 'Clothing', 'Home', 'Sports', 'Books', 'Toys', 'Music'];
  const products = [
    'Wireless Mouse', 'USB Cable', 'Laptop Stand', 'Headphones', 'Keyboard',
    'Monitor', 'Webcam', 'Speakers', 'Microphone', 'Mouse Pad',
    'T-Shirt', 'Jeans', 'Sneakers', 'Jacket', 'Hat',
    'Lamp', 'Chair', 'Desk', 'Bookshelf', 'Rug',
    'Basketball', 'Tennis Racket', 'Yoga Mat', 'Dumbbells', 'Jump Rope',
    'Novel', 'Cookbook', 'Dictionary', 'Atlas', 'Biography',
    'Action Figure', 'Board Game', 'Puzzle', 'Building Blocks', 'Doll',
    'Acoustic Guitar', 'Piano Keyboard', 'Drum Sticks', 'Violin', 'Flute',
  ];
  
  const data: ProductRow[] = [];
  for (let i = 0; i < count; i++) {
    const sku = `SKU-${String(i + 100).padStart(4, '0')}`;
    
    data.push({
      id: sku,
      sku,
      name: products[i % products.length],
      category: categories[i % categories.length],
      price: Math.round((10 + Math.random() * 490) * 100) / 100,
      stock: Math.floor(Math.random() * 100),
    });
  }
  return data;
}

/**
 * Generates invoice data for Mantine visual badge matching task
 */
export function generateInvoiceData(count: number): InvoiceRow[] {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const icons = ['flag', 'star', 'heart', 'bolt', 'bell', 'bookmark'];
  
  const data: InvoiceRow[] = [];
  for (let i = 0; i < count; i++) {
    const id = `INV-${String(i + 1).padStart(4, '0')}`;
    
    data.push({
      id,
      invoiceId: id,
      customer: `Customer ${i + 1}`,
      amount: Math.round((100 + Math.random() * 900) * 100) / 100,
      flagColor: colors[i % colors.length],
      flagIcon: icons[i % icons.length],
    });
  }
  
  // Set specific badge for INV-0094 (target for visual matching)
  const targetIndex = data.findIndex(inv => inv.invoiceId === 'INV-0094');
  if (targetIndex >= 0) {
    data[targetIndex].flagColor = 'purple';
    data[targetIndex].flagIcon = 'star';
  }
  
  return data;
}

/**
 * Generates sales record data for Mantine 3-region dashboard
 */
export function generateSalesData(count: number): SalesRecordRow[] {
  const reps = ['Alex', 'Beth', 'Carl', 'Dana', 'Eric', 'Faye', 'Greg', 'Heidi', 'Ivan', 'Julia'];
  
  const data: SalesRecordRow[] = [];
  for (let i = 0; i < count; i++) {
    const id = `SALE-${String(i + 401).padStart(4, '0')}`;
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + i);
    
    data.push({
      id,
      recordId: id,
      rep: reps[i % reps.length],
      amount: Math.round((100 + Math.random() * 4900) * 100) / 100,
      date: date.toISOString().split('T')[0],
    });
  }
  return data;
}
