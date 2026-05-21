'use client';

/**
 * data_table_filterable-mui-v2-T12: Tickets panel – filter status, sort priority
 *
 * An inline_surface work queue with one DataGrid "Tickets". The toolbar has a Filters button.
 * Target: filter Status=Open via filter panel and sort Priority via column header click.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps, FilterModel } from '../../types';

interface TicketRow {
  id: number;
  title: string;
  status: string;
  priority: string;
  assignee: string;
}

const statusOptions = ['Open', 'In Progress', 'Closed', 'Blocked'];
const priorityOptions = ['P0', 'P1', 'P2', 'P3'];

const ticketsData: TicketRow[] = [
  { id: 1, title: 'Fix latency on /api/users', status: 'Open', priority: 'P1', assignee: 'Alice' },
  { id: 2, title: 'Add pagination to list view', status: 'Open', priority: 'P2', assignee: 'Bob' },
  { id: 3, title: 'Investigate latency spikes', status: 'In Progress', priority: 'P0', assignee: 'Carol' },
  { id: 4, title: 'Update dependencies', status: 'Closed', priority: 'P3', assignee: 'Dan' },
  { id: 5, title: 'Latency monitoring dashboard', status: 'Open', priority: 'P1', assignee: 'Eva' },
  { id: 6, title: 'Auth token refresh bug', status: 'Open', priority: 'P1', assignee: 'Frank' },
  { id: 7, title: 'CSS alignment issue', status: 'Blocked', priority: 'P2', assignee: 'Gina' },
  { id: 8, title: 'Database connection pool', status: 'In Progress', priority: 'P0', assignee: 'Hiro' },
];

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 220 },
  { field: 'status', headerName: 'Status', width: 120, type: 'singleSelect', valueOptions: statusOptions },
  { field: 'priority', headerName: 'Priority', width: 100, type: 'singleSelect', valueOptions: priorityOptions },
  { field: 'assignee', headerName: 'Assignee', width: 110 },
];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    const hasStatusOpen = (filterModel.items || []).some(
      i => i.field === 'status' && i.operator === 'is' && i.value === 'Open',
    );
    const hasPriSorted = sortModel.some(s => s.field === 'priority' && (s.sort === 'asc' || s.sort === 'desc'));
    if (hasStatusOpen && hasPriSorted) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filterModel, sortModel, onSuccess]);

  const canonicalModel: FilterModel = {
    table_id: 'tickets',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: (filterModel.items || [])
      .filter(i => i.value !== undefined && i.value !== '')
      .map(i => ({
        column: i.field.charAt(0).toUpperCase() + i.field.slice(1),
        operator: 'equals' as const,
        value: i.value,
      })),
  };

  return (
    <div style={{ width: 700, padding: 16 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Tickets</Typography>
          <div style={{ height: 400 }}>
            <DataGrid
              rows={ticketsData}
              columns={columns}
              filterModel={filterModel}
              onFilterModelChange={setFilterModel}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: false } }}
              disableRowSelectionOnClick
              density="compact"
              data-testid="datagrid-tickets"
              data-filter-model={JSON.stringify(canonicalModel)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
