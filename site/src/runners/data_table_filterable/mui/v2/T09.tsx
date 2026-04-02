'use client';

/**
 * data_table_filterable-mui-v2-T09: Drawer incidents – "is any of" filter
 *
 * A drawer_flow page. Clicking "Incidents" opens a left-side drawer containing a DataGrid
 * with a Filters toolbar button. The task requires using the "is any of" operator on the
 * Priority column to show only P0 and P1 incidents. Dark theme, compact spacing, auto-apply.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridFilterModel } from '@mui/x-data-grid';
import { Drawer, Button, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import type { TaskComponentProps, FilterModel } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface IncidentRow {
  id: number;
  title: string;
  priority: string;
  status: string;
  assignee: string;
}

const priorityOptions = ['P0', 'P1', 'P2', 'P3', 'P4'];
const statusOptions = ['Open', 'Investigating', 'Resolved', 'Closed'];

const incidentsData: IncidentRow[] = [
  { id: 1, title: 'API gateway outage', priority: 'P0', status: 'Open', assignee: 'Alice' },
  { id: 2, title: 'Payment timeout spike', priority: 'P1', status: 'Investigating', assignee: 'Bob' },
  { id: 3, title: 'Search index lag', priority: 'P2', status: 'Open', assignee: 'Carol' },
  { id: 4, title: 'CDN cache miss rate', priority: 'P3', status: 'Resolved', assignee: 'Dan' },
  { id: 5, title: 'Auth service 503', priority: 'P0', status: 'Investigating', assignee: 'Eva' },
  { id: 6, title: 'Email delivery delay', priority: 'P1', status: 'Open', assignee: 'Frank' },
  { id: 7, title: 'Dashboard render slow', priority: 'P2', status: 'Closed', assignee: 'Gina' },
  { id: 8, title: 'Certificate expiry alert', priority: 'P4', status: 'Resolved', assignee: 'Hiro' },
];

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Incident', width: 200 },
  { field: 'priority', headerName: 'Priority', width: 100, type: 'singleSelect', valueOptions: priorityOptions },
  { field: 'status', headerName: 'Status', width: 120, type: 'singleSelect', valueOptions: statusOptions },
  { field: 'assignee', headerName: 'Assignee', width: 110 },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    const items = filterModel.items || [];
    const anyOf = items.find(
      i => i.field === 'priority' && i.operator === 'isAnyOf' && Array.isArray(i.value),
    );
    if (anyOf) {
      const vals = new Set(anyOf.value as string[]);
      if (vals.has('P0') && vals.has('P1') && vals.size === 2) {
        successFiredRef.current = true;
        onSuccess();
      }
    }
  }, [filterModel, onSuccess]);

  const canonicalModel: FilterModel = {
    table_id: 'incidents',
    logic_operator: (filterModel.logicOperator?.toUpperCase() as 'AND' | 'OR') || 'OR',
    global_filter: null,
    column_filters: (filterModel.items || [])
      .filter(i => i.value !== undefined && i.value !== '')
      .map(i => ({
        column: i.field.charAt(0).toUpperCase() + i.field.slice(1),
        operator: i.operator as 'equals',
        value: i.value,
      })),
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ padding: 24, background: '#121212', minHeight: 400 }}>
        <Button variant="contained" size="small" onClick={() => setDrawerOpen(true)}>
          Incidents
        </Button>

        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <div style={{ width: 620, padding: 16 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Incidents</Typography>
            <div style={{ height: 420 }}>
              <DataGrid
                rows={incidentsData}
                columns={columns}
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: false } }}
                disableRowSelectionOnClick
                density="compact"
                data-testid="datagrid-incidents"
                data-filter-model={JSON.stringify(canonicalModel)}
              />
            </div>
          </div>
        </Drawer>
      </div>
    </ThemeProvider>
  );
}
