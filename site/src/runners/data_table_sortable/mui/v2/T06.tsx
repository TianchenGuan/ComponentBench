'use client';

/**
 * data_table_sortable-mui-v2-T06: Alerts grid – sort risk descending and filter status to Open
 *
 * A compact settings_panel with one DataGrid titled "Alerts". The grid has a toolbar
 * with a Filters button and sortable column headers.
 *
 * Success: sort Risk descending AND filter Status = "Open".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel, GridFilterModel, GridToolbar } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../../types';

interface AlertRow {
  id: string;
  alertId: string;
  source: string;
  risk: number;
  updated: string;
  assignee: string;
  status: string;
}

const statusOptions = ['Open', 'Triaged', 'Resolved'];

const data: AlertRow[] = [
  { id: '1', alertId: 'ALR-101', source: 'Firewall', risk: 9, updated: '2024-02-15 09:30', assignee: 'Alice', status: 'Open' },
  { id: '2', alertId: 'ALR-102', source: 'IDS', risk: 5, updated: '2024-02-14 17:00', assignee: 'Bob', status: 'Triaged' },
  { id: '3', alertId: 'ALR-103', source: 'Endpoint', risk: 8, updated: '2024-02-15 11:15', assignee: 'Carol', status: 'Open' },
  { id: '4', alertId: 'ALR-104', source: 'Firewall', risk: 3, updated: '2024-02-13 08:45', assignee: 'Dan', status: 'Resolved' },
  { id: '5', alertId: 'ALR-105', source: 'SIEM', risk: 9, updated: '2024-02-15 06:20', assignee: 'Eva', status: 'Open' },
  { id: '6', alertId: 'ALR-106', source: 'Endpoint', risk: 7, updated: '2024-02-14 22:10', assignee: 'Frank', status: 'Triaged' },
  { id: '7', alertId: 'ALR-107', source: 'IDS', risk: 4, updated: '2024-02-15 14:00', assignee: 'Grace', status: 'Open' },
  { id: '8', alertId: 'ALR-108', source: 'SIEM', risk: 2, updated: '2024-02-12 10:30', assignee: 'Hiro', status: 'Resolved' },
  { id: '9', alertId: 'ALR-109', source: 'Firewall', risk: 6, updated: '2024-02-15 13:00', assignee: 'Alice', status: 'Open' },
  { id: '10', alertId: 'ALR-110', source: 'Endpoint', risk: 8, updated: '2024-02-14 15:45', assignee: 'Bob', status: 'Resolved' },
];

const columns: GridColDef[] = [
  { field: 'alertId', headerName: 'Alert ID', width: 100 },
  { field: 'source', headerName: 'Source', width: 100 },
  { field: 'risk', headerName: 'Risk', width: 80, type: 'number' },
  { field: 'updated', headerName: 'Updated', width: 150 },
  { field: 'assignee', headerName: 'Assignee', width: 90 },
  { field: 'status', headerName: 'Status', width: 90, type: 'singleSelect', valueOptions: statusOptions },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const hasRiskDesc = sortModel.some(s => s.field === 'risk' && s.sort === 'desc');
    const hasStatusOpen = (filterModel.items || []).some(
      i => i.field === 'status' && i.operator === 'is' && i.value === 'Open',
    );
    if (hasRiskDesc && hasStatusOpen) {
      successFired.current = true;
      onSuccess();
    }
  }, [sortModel, filterModel, onSuccess]);

  const canonicalSortModel: SortModel = sortModel.map((item, idx) => ({
    column_key: item.field,
    direction: (item.sort || 'asc') as 'asc' | 'desc',
    priority: idx + 1,
  }));

  return (
    <div style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%,-50%)', width: 660 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Alerts</Typography>
            <Chip label="10 open" size="small" color="error" variant="outlined" />
          </Box>
          <div style={{ height: 420, width: '100%' }}>
            <DataGrid
              rows={data}
              columns={columns}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              filterModel={filterModel}
              onFilterModelChange={setFilterModel}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: false } }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              density="compact"
              data-testid="grid-alerts"
              {...({ 'data-sort-model': JSON.stringify(canonicalSortModel) } as any)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
