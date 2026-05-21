'use client';

/**
 * data_grid_row_selection-mui-T01: Single-row selection by clicking a row
 *
 * A centered isolated card titled "Support tickets" contains a single MUI X DataGrid.
 * The grid is in its default configuration for single row selection: clicking a row selects/highlights it.
 * Spacing is comfortable and scale is default. There are 8 rows visible (no pagination). Columns: Ticket ID,
 * Subject, Priority.
 * Initial state: no row is selected. There are no extra controls (no toolbar, no filters). Feedback is
 * immediate via row highlight and aria-selected state.
 *
 * Success: selected_row_ids equals ['T-104']
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface TicketData {
  id: string;
  ticketId: string;
  subject: string;
  priority: string;
}

const ticketsData: TicketData[] = [
  { id: 'T-101', ticketId: 'T-101', subject: 'Password reset', priority: 'Low' },
  { id: 'T-102', ticketId: 'T-102', subject: 'Payment error', priority: 'High' },
  { id: 'T-103', ticketId: 'T-103', subject: 'Account locked', priority: 'Medium' },
  { id: 'T-104', ticketId: 'T-104', subject: 'Login issue', priority: 'High' },
  { id: 'T-105', ticketId: 'T-105', subject: 'Feature request', priority: 'Low' },
  { id: 'T-106', ticketId: 'T-106', subject: 'Billing inquiry', priority: 'Medium' },
  { id: 'T-107', ticketId: 'T-107', subject: 'Data export', priority: 'Low' },
  { id: 'T-108', ticketId: 'T-108', subject: 'Integration help', priority: 'Medium' },
];

const columns: GridColDef[] = [
  { field: 'ticketId', headerName: 'Ticket ID', width: 120 },
  { field: 'subject', headerName: 'Subject', flex: 1 },
  { field: 'priority', headerName: 'Priority', width: 100 },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  // Get selected IDs as array for comparison
  const selectedIds = Array.from(selectionModel.ids) as string[];

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedIds, ['T-104'])) {
      onSuccess();
    }
  }, [selectedIds, onSuccess]);

  return (
    <Card sx={{ width: 550 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Support tickets
        </Typography>
        <div
          style={{ height: 400 }}
          data-testid="tickets-grid"
          data-selected-row-ids={JSON.stringify(selectedIds)}
        >
          <DataGrid
            rows={ticketsData}
            columns={columns}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(newModel) => setSelectionModel(newModel)}
            hideFooter
            disableColumnMenu
          />
        </div>
      </CardContent>
    </Card>
  );
}
