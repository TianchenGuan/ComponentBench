'use client';

/**
 * data_table_sortable-mui-v2-T11: Incidents drawer – replace stale sort with SLA breach descending
 *
 * A right-side Drawer opens from an operations page. Inside is one DataGrid Pro titled
 * "Incidents". Status is already sorted ascending when the drawer opens. The SLA breach
 * column is visible and sortable. A compact alert legend and help icon are distractors.
 * Dark theme.
 *
 * Success: SLA breach sorted descending (Status no longer sorted, one key only).
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Drawer, Box, IconButton, Chip, createTheme, ThemeProvider,
} from '@mui/material';
import { HelpOutline, WarningAmber } from '@mui/icons-material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface IncidentRow {
  id: string;
  incidentId: string;
  title: string;
  status: string;
  slaBreach: number;
  assignee: string;
  priority: string;
}

const data: IncidentRow[] = [
  { id: '1', incidentId: 'INC-501', title: 'Payment gateway timeout', status: 'Open', slaBreach: 4.2, assignee: 'Alice', priority: 'P1' },
  { id: '2', incidentId: 'INC-502', title: 'Login failures spike', status: 'Investigating', slaBreach: 1.5, assignee: 'Bob', priority: 'P2' },
  { id: '3', incidentId: 'INC-503', title: 'Search latency', status: 'Open', slaBreach: 7.8, assignee: 'Carol', priority: 'P1' },
  { id: '4', incidentId: 'INC-504', title: 'Email delivery lag', status: 'Resolved', slaBreach: 0.0, assignee: 'Dan', priority: 'P3' },
  { id: '5', incidentId: 'INC-505', title: 'CDN cache miss', status: 'Open', slaBreach: 2.1, assignee: 'Eva', priority: 'P2' },
  { id: '6', incidentId: 'INC-506', title: 'Database failover', status: 'Investigating', slaBreach: 12.3, assignee: 'Frank', priority: 'P1' },
  { id: '7', incidentId: 'INC-507', title: 'API rate errors', status: 'Open', slaBreach: 3.0, assignee: 'Grace', priority: 'P2' },
  { id: '8', incidentId: 'INC-508', title: 'Certificate warning', status: 'Resolved', slaBreach: 0.0, assignee: 'Hiro', priority: 'P3' },
  { id: '9', incidentId: 'INC-509', title: 'Queue backlog', status: 'Open', slaBreach: 5.5, assignee: 'Alice', priority: 'P1' },
  { id: '10', incidentId: 'INC-510', title: 'Webhook failures', status: 'Investigating', slaBreach: 8.9, assignee: 'Bob', priority: 'P2' },
];

const cols: GridColDef[] = [
  { field: 'incidentId', headerName: 'Incident', width: 100, sortable: false },
  { field: 'title', headerName: 'Title', width: 180, sortable: false },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'slaBreach', headerName: 'SLA breach', width: 110, type: 'number' },
  { field: 'assignee', headerName: 'Assignee', width: 90, sortable: false },
  { field: 'priority', headerName: 'Priority', width: 80, sortable: false },
];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'status', sort: 'asc' }]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      sortModel.length === 1 &&
      sortModel[0].field === 'slaBreach' &&
      sortModel[0].sort === 'desc'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [sortModel, onSuccess]);

  const canonicalSortModel: SortModel = sortModel.map((item, idx) => ({
    column_key: item.field === 'slaBreach' ? 'sla_breach' : item.field,
    direction: (item.sort || 'asc') as 'asc' | 'desc',
    priority: idx + 1,
  }));

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ padding: 16 }}>
        <Card>
          <CardContent>
            <Button variant="contained" color="warning" startIcon={<WarningAmber />} onClick={() => setOpen(true)}>
              Incidents
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
              10 active incidents
            </Typography>
          </CardContent>
        </Card>

        <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 700 } }}>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6">Incidents</Typography>
              <IconButton size="small"><HelpOutline fontSize="small" /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label="P1 — Critical" size="small" color="error" variant="outlined" />
              <Chip label="P2 — High" size="small" color="warning" variant="outlined" />
              <Chip label="P3 — Medium" size="small" variant="outlined" />
            </Box>
            <div style={{ height: 480 }}>
              <DataGrid
                rows={data}
                columns={cols}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                density="compact"
                data-testid="grid-incidents"
                data-sort-model={JSON.stringify(canonicalSortModel)}
              />
            </div>
          </Box>
        </Drawer>
      </div>
    </ThemeProvider>
  );
}
