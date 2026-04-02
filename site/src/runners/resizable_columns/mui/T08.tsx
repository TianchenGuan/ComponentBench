'use client';

/**
 * Task ID: resizable_columns-mui-T08
 * Task Name: Compact small DataGrid: precisely set 2 adjacent widths
 *
 * Setup Description:
 * Layout: isolated_card, centered. Spacing is compact and scale is small.
 * One MUI DataGrid ("Sales by product"):
 * - Headers: Product, Region, Units, Revenue.
 * - Compact density with sorting icons present.
 * - Width Monitor: "Product: ###px • Region: ###px".
 *
 * Initial state: Product 200px, Region 180px.
 *
 * Success Trigger: Product ±4px of 240px, Region ±4px of 140px.
 *
 * Theme: light, Spacing: compact, Layout: isolated_card, Placement: center, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

const rows = [
  { id: 1, product: 'Widget A', region: 'North', units: 150, revenue: '$7,500' },
  { id: 2, product: 'Widget B', region: 'South', units: 120, revenue: '$6,000' },
  { id: 3, product: 'Gadget X', region: 'East', units: 200, revenue: '$12,000' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    product: 200,
    region: 180,
    units: 100,
    revenue: 120,
  });
  const successFired = useRef(false);

  const productWidth = columnWidths.product ?? 200;
  const regionWidth = columnWidths.region ?? 180;

  useEffect(() => {
    const productOk = isWithinTolerance(productWidth, 240, 4);
    const regionOk = isWithinTolerance(regionWidth, 140, 4);
    
    if (!successFired.current && productOk && regionOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [productWidth, regionWidth, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'product', headerName: 'Product', width: columnWidths.product, minWidth: 140, resizable: true, sortable: true },
    { field: 'region', headerName: 'Region', width: columnWidths.region, minWidth: 120, resizable: true, sortable: true },
    { field: 'units', headerName: 'Units', width: columnWidths.units, resizable: true, sortable: true },
    { field: 'revenue', headerName: 'Revenue', width: columnWidths.revenue, resizable: true, sortable: true },
  ];

  return (
    <Card sx={{ width: 680 }} data-testid="rc-datagrid-sales">
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" gutterBottom>
          Sales by product
        </Typography>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }} data-testid="rc-width-monitor">
          Product: {productWidth}px • Region: {regionWidth}px
        </Typography>

        <Box sx={{ height: 220, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            density="compact"
            disableRowSelectionOnClick
            hideFooter
            onColumnWidthChange={(params) => {
              setColumnWidths(prev => ({
                ...prev,
                [params.colDef.field]: params.width,
              }));
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
