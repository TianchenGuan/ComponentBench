'use client';

/**
 * data_table_paginated-mui-v2-T06: Products grid — page size and page in the correct dashboard card
 *
 * Dashboard with two MUI DataGrid cards: "Products" and "Services".
 * Both expose footer rows-per-page + pagination. Small card actions as clutter.
 * Initial: both page 1, size 10. Target: Products → size 50, page 3.
 * Services must remain page 1, size 10.
 */

import React, { useState, useRef, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import {
  Card, CardHeader, CardContent, Box, Typography, IconButton, Chip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { TaskComponentProps } from '../../types';
import { generateUserData } from '../../types';

const productColumns: GridColDef[] = [
  { field: 'id', headerName: 'Product ID', width: 110 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'role', headerName: 'Category', width: 110 },
  { field: 'status', headerName: 'Status', width: 100,
    renderCell: (p) => <Chip label={p.value} size="small" color={p.value === 'Active' ? 'success' : 'default'} /> },
];

const serviceColumns: GridColDef[] = [
  { field: 'id', headerName: 'Service ID', width: 110 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'role', headerName: 'Tier', width: 110 },
  { field: 'status', headerName: 'Status', width: 100,
    renderCell: (p) => <Chip label={p.value} size="small" variant="outlined" /> },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [productRows] = useState(() => generateUserData(300));
  const [serviceRows] = useState(() =>
    generateUserData(200).map((u) => ({ ...u, id: u.id.replace('U-', 'SVC-') })),
  );

  const [productsPM, setProductsPM] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [servicesPM, setServicesPM] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      productsPM.pageSize === 50 && productsPM.page === 2 &&
      servicesPM.pageSize === 10 && servicesPM.page === 0
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [productsPM, servicesPM, onSuccess]);

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, maxWidth: 1100 }}>
      <Card sx={{ flex: 1 }} data-testid="products-card">
        <CardHeader
          title="Products"
          action={<><IconButton size="small"><RefreshIcon fontSize="small" /></IconButton>
            <IconButton size="small"><FileDownloadIcon fontSize="small" /></IconButton></>}
        />
        <CardContent>
          <DataGrid
            rows={productRows}
            columns={productColumns}
            paginationModel={productsPM}
            onPaginationModelChange={setProductsPM}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{ height: 460 }}
            data-testid="products-grid"
            data-current-page={productsPM.page + 1}
            data-page-size={productsPM.pageSize}
          />
        </CardContent>
      </Card>

      <Card sx={{ flex: 1 }} data-testid="services-card">
        <CardHeader
          title="Services"
          action={<><IconButton size="small"><RefreshIcon fontSize="small" /></IconButton>
            <IconButton size="small"><FileDownloadIcon fontSize="small" /></IconButton></>}
        />
        <CardContent>
          <DataGrid
            rows={serviceRows}
            columns={serviceColumns}
            paginationModel={servicesPM}
            onPaginationModelChange={setServicesPM}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{ height: 460 }}
            data-testid="services-grid"
            data-current-page={servicesPM.page + 1}
            data-page-size={servicesPM.pageSize}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
