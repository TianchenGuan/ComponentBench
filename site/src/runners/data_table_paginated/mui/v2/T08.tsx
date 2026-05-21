'use client';

/**
 * data_table_paginated-mui-v2-T08: Cross-page exact selection in dark DataGrid
 *
 * Dark settings_panel with one MUI DataGrid "Users". Checkbox selection persists
 * across pages. Compact, small-scale presentation.
 * Initial: page 1, no selection. Target: exactly {U-0020, U-0077, U-0199} selected.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  DataGrid, GridColDef, GridPaginationModel, GridRowSelectionModel,
} from '@mui/x-data-grid';
import { Card, CardHeader, CardContent, Chip, ThemeProvider, createTheme } from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { generateUserData } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const columns: GridColDef[] = [
  { field: 'id', headerName: 'User ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 140 },
  { field: 'role', headerName: 'Role', width: 90 },
  {
    field: 'status', headerName: 'Status', width: 90,
    renderCell: (p) => (
      <Chip label={p.value} size="small"
        color={p.value === 'Active' ? 'success' : p.value === 'Inactive' ? 'default' : 'warning'} />
    ),
  },
  {
    field: 'lastSeen', headerName: 'Last seen', width: 160,
    valueFormatter: (v: string) => new Date(v).toLocaleString(),
  },
];

const TARGET_IDS = new Set(['U-0020', 'U-0077', 'U-0199']);

export default function T08({ onSuccess }: TaskComponentProps) {
  const [rows] = useState(() => generateUserData(250));
  const [pm, setPM] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set<string>(),
  });
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const ids = selectionModel.ids;
    if (ids.size === TARGET_IDS.size && Array.from(TARGET_IDS).every((id) => ids.has(id))) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectionModel, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ padding: 16, maxWidth: 680, background: '#121212', minHeight: '100vh' }}>
        <Card data-testid="users-card">
          <CardHeader title="Users" titleTypographyProps={{ variant: 'subtitle1' }} />
          <CardContent>
            <DataGrid
              rows={rows}
              columns={columns}
              paginationModel={pm}
              onPaginationModelChange={setPM}
              pageSizeOptions={[10, 25]}
              checkboxSelection
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={setSelectionModel}
              sx={{ height: 460 }}
              data-testid="users-grid"
              data-current-page={pm.page + 1}
              data-selected-rows={JSON.stringify(Array.from(selectionModel.ids))}
            />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}
