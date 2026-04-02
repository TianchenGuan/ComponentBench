'use client';

/**
 * data_table_sortable-mui-T13: Tickets - toggle Priority to High→Low (DataGrid)
 *
 * Single MUI X DataGrid in an isolated card titled "Tickets".
 * - Columns: Ticket #, Subject, Priority, Owner, Updated.
 * - Priority is sortable with categorical values (High/Medium/Low).
 * - Initial state: unsorted.
 *
 * Success: Priority sorted descending (High → Medium → Low).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel, GridRenderCellParams } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../types';

interface TicketData {
  id: string;
  ticketNum: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  priorityValue: number;
  owner: string;
  updated: string;
}

const ticketsData: TicketData[] = [
  { id: '1', ticketNum: 'TKT-001', subject: 'Login page crash', priority: 'High', priorityValue: 3, owner: 'Alice', updated: '2024-02-15' },
  { id: '2', ticketNum: 'TKT-002', subject: 'Update user API', priority: 'Medium', priorityValue: 2, owner: 'Bob', updated: '2024-02-14' },
  { id: '3', ticketNum: 'TKT-003', subject: 'Fix typo', priority: 'Low', priorityValue: 1, owner: 'Carol', updated: '2024-02-13' },
  { id: '4', ticketNum: 'TKT-004', subject: 'Database timeout', priority: 'High', priorityValue: 3, owner: 'David', updated: '2024-02-15' },
  { id: '5', ticketNum: 'TKT-005', subject: 'Add dark mode', priority: 'Medium', priorityValue: 2, owner: 'Emma', updated: '2024-02-12' },
  { id: '6', ticketNum: 'TKT-006', subject: 'Email failing', priority: 'High', priorityValue: 3, owner: 'Frank', updated: '2024-02-11' },
  { id: '7', ticketNum: 'TKT-007', subject: 'Improve search', priority: 'Medium', priorityValue: 2, owner: 'Grace', updated: '2024-02-10' },
  { id: '8', ticketNum: 'TKT-008', subject: 'Update docs', priority: 'Low', priorityValue: 1, owner: 'Henry', updated: '2024-02-09' },
];

const priorityColors: Record<string, 'error' | 'warning' | 'success'> = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
};

const columns: GridColDef[] = [
  { field: 'ticketNum', headerName: 'Ticket #', width: 100, sortable: false },
  { field: 'subject', headerName: 'Subject', width: 180, sortable: false },
  {
    field: 'priorityValue',
    headerName: 'Priority',
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={params.row.priority}
        color={priorityColors[params.row.priority]}
        size="small"
      />
    ),
  },
  { field: 'owner', headerName: 'Owner', width: 100, sortable: false },
  { field: 'updated', headerName: 'Updated', width: 110, sortable: false },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  // Check success condition
  useEffect(() => {
    if (sortModel.length === 1 && sortModel[0].field === 'priorityValue' && sortModel[0].sort === 'desc') {
      onSuccess();
    }
  }, [sortModel, onSuccess]);

  const canonicalSortModel: SortModel = sortModel.map((item: GridSortModel[number], idx: number) => ({
    column_key: item.field === 'priorityValue' ? 'priority' : item.field,
    direction: item.sort || 'asc',
    priority: idx + 1,
  }));

  return (
    <Card sx={{ width: 650 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Tickets
        </Typography>
        <div style={{ height: 400 }}>
          <DataGrid
            rows={ticketsData}
            columns={columns}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            data-testid="grid-tickets"
            data-sort-model={JSON.stringify(canonicalSortModel)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
