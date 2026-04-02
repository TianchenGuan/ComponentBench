'use client';

/**
 * table_static-mui-T01: Select a product row (by SKU)
 *
 * A single read-only Products table is displayed in a centered isolated card using the Material UI Table
 * components (Table, TableHead, TableBody). Columns are: SKU, Product, Price, and Stock. The table has ~15 rows with no
 * pagination, sorting, or filtering controls. Rows are single-select: clicking a row highlights it with a subtle background
 * and sets aria-selected="true" on the TableRow. Initial state: no selection. No other interactive elements are on the page.
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface ProductData {
  key: string;
  sku: string;
  product: string;
  price: string;
  stock: number;
}

const productsData: ProductData[] = [
  { key: 'SKU-7708', sku: 'SKU-7708', product: 'Wireless Mouse', price: '$29.99', stock: 150 },
  { key: 'SKU-7709', sku: 'SKU-7709', product: 'USB Keyboard', price: '$49.99', stock: 85 },
  { key: 'SKU-7710', sku: 'SKU-7710', product: 'Monitor Stand', price: '$79.99', stock: 42 },
  { key: 'SKU-7711', sku: 'SKU-7711', product: 'Webcam HD', price: '$89.99', stock: 63 },
  { key: 'SKU-7712', sku: 'SKU-7712', product: 'USB Hub', price: '$24.99', stock: 200 },
  { key: 'SKU-7713', sku: 'SKU-7713', product: 'Desk Lamp', price: '$34.99', stock: 95 },
  { key: 'SKU-7714', sku: 'SKU-7714', product: 'Mouse Pad XL', price: '$19.99', stock: 180 },
  { key: 'SKU-7715', sku: 'SKU-7715', product: 'Cable Organizer', price: '$14.99', stock: 250 },
  { key: 'SKU-7716', sku: 'SKU-7716', product: 'Headphone Stand', price: '$29.99', stock: 75 },
  { key: 'SKU-7717', sku: 'SKU-7717', product: 'Laptop Stand', price: '$59.99', stock: 55 },
  { key: 'SKU-7718', sku: 'SKU-7718', product: 'Wrist Rest', price: '$22.99', stock: 120 },
  { key: 'SKU-7719', sku: 'SKU-7719', product: 'Screen Cleaner', price: '$9.99', stock: 300 },
  { key: 'SKU-7720', sku: 'SKU-7720', product: 'USB-C Adapter', price: '$39.99', stock: 88 },
  { key: 'SKU-7721', sku: 'SKU-7721', product: 'Desk Organizer', price: '$44.99', stock: 65 },
  { key: 'SKU-7722', sku: 'SKU-7722', product: 'Monitor Light', price: '$54.99', stock: 48 },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleRowClick = (record: ProductData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'SKU-7710') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Products
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsData.map((row) => (
                <TableRow
                  key={row.key}
                  onClick={() => handleRowClick(row)}
                  aria-selected={selectedRowKey === row.key}
                  data-row-key={row.key}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedRowKey === row.key ? 'action.selected' : undefined,
                    '&:hover': {
                      backgroundColor: selectedRowKey === row.key ? 'action.selected' : 'action.hover',
                    },
                  }}
                >
                  <TableCell>{row.sku}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
