'use client';

/**
 * data_grid_row_selection-mui-T03: Clear selection using toolbar button
 *
 * A centered isolated card titled "Files" contains a MUI X DataGrid with checkboxSelection enabled and a
 * simple toolbar row above it.
 * The toolbar shows text "2 selected" and a button labeled "Clear selection".
 * Spacing is comfortable and size is default. The grid shows 9 file rows (no pagination) with columns:
 * File, Owner, Modified.
 * Initial state: two rows are pre-selected (file_Alpha.pdf and file_Bravo.pdf). Clicking "Clear selection"
 * resets the rowSelectionModel to empty and updates the selected count.
 * No other interactive widgets are present.
 *
 * Success: selected_row_ids equals []
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface FileData {
  id: string;
  file: string;
  owner: string;
  modified: string;
}

const filesData: FileData[] = [
  { id: 'file_Alpha', file: 'Alpha.pdf', owner: 'Alice Chen', modified: '2024-02-10' },
  { id: 'file_Bravo', file: 'Bravo.pdf', owner: 'Bob Martinez', modified: '2024-02-12' },
  { id: 'file_Charlie', file: 'Charlie.docx', owner: 'Carol Williams', modified: '2024-02-08' },
  { id: 'file_Delta', file: 'Delta.xlsx', owner: 'David Kim', modified: '2024-02-15' },
  { id: 'file_Echo', file: 'Echo.pdf', owner: 'Eva Schmidt', modified: '2024-02-11' },
  { id: 'file_Foxtrot', file: 'Foxtrot.docx', owner: 'Frank Jones', modified: '2024-02-09' },
  { id: 'file_Golf', file: 'Golf.xlsx', owner: 'Grace Liu', modified: '2024-02-13' },
  { id: 'file_Hotel', file: 'Hotel.pdf', owner: 'Henry Wilson', modified: '2024-02-14' },
  { id: 'file_India', file: 'India.docx', owner: 'Iris Chang', modified: '2024-02-07' },
];

const columns: GridColDef[] = [
  { field: 'file', headerName: 'File', flex: 1 },
  { field: 'owner', headerName: 'Owner', width: 130 },
  { field: 'modified', headerName: 'Modified', width: 120 },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(['file_Alpha', 'file_Bravo']),
  });

  const selectedIds = Array.from(selectionModel.ids) as string[];

  const handleClearSelection = () => {
    setSelectionModel({ type: 'include', ids: new Set() });
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedIds, [])) {
      onSuccess();
    }
  }, [selectedIds, onSuccess]);

  return (
    <Card sx={{ width: 550 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Files
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {selectedIds.length} selected
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClearSelection}
            data-testid="clear-selection-btn"
          >
            Clear selection
          </Button>
        </Box>
        <div
          style={{ height: 400 }}
          data-testid="files-grid"
          data-selected-row-ids={JSON.stringify(selectedIds)}
        >
          <DataGrid
            rows={filesData}
            columns={columns}
            checkboxSelection
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
