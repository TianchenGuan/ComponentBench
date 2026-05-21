'use client';

/**
 * data_grid_row_selection-mui-T10: Compact dark settings panel selection with Apply
 *
 * The scene is a settings_panel in dark theme. A left sidebar shows non-interactive navigation items
 * (Profile, Billing, Flags), and the main panel shows "Feature flags".
 * The main panel contains a MUI X DataGrid with checkboxSelection enabled, rendered in compact spacing with
 * a small visual scale (smaller typography and tighter row height).
 * The grid shows 25 rows (no pagination) with columns: Flag key, Description, Environment. Many flag keys
 * share the "FF-" prefix.
 * At the bottom of the panel, there is a sticky action bar with a primary button labeled "Apply".
 * Initial state: no flags selected. Selection changes are not considered committed until Apply is clicked
 * (Apply closes the pending state and shows a small toast "Selection applied").
 *
 * Success: selected_row_ids equals ['FF-12', 'FF-19', 'FF-23'] AND require_confirm (Apply clicked)
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import {
  Card, Box, Button, Typography, List, ListItem, ListItemText, Snackbar,
  ThemeProvider, createTheme,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface FlagData {
  id: string;
  flagKey: string;
  description: string;
  environment: string;
}

// Generate 25 feature flags
const flagsData: FlagData[] = Array.from({ length: 25 }, (_, i) => {
  const num = i + 10;
  return {
    id: `FF-${num}`,
    flagKey: `FF-${num}`,
    description: `Feature flag ${num} description`,
    environment: ['Production', 'Staging', 'Development'][i % 3],
  };
});

const columns: GridColDef[] = [
  { field: 'flagKey', headerName: 'Flag key', width: 90 },
  { field: 'description', headerName: 'Description', flex: 1 },
  { field: 'environment', headerName: 'Environment', width: 110 },
];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T10({ onSuccess }: TaskComponentProps) {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const [committedSelection, setCommittedSelection] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const hasSucceeded = useRef(false);

  const selectedIds = Array.from(selectionModel.ids) as string[];

  const handleApply = () => {
    setCommittedSelection(selectedIds);
    setShowToast(true);
  };

  // Check success condition
  useEffect(() => {
    if (!hasSucceeded.current && selectionEquals(committedSelection, ['FF-12', 'FF-19', 'FF-23'])) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedSelection, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', width: 800, bgcolor: '#1e1e1e', borderRadius: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Box sx={{ width: 180, bgcolor: '#121212', borderRight: '1px solid #333' }}>
          <Typography sx={{ p: 2, fontWeight: 500, fontSize: 14 }}>Settings</Typography>
          <List dense>
            <ListItem sx={{ opacity: 0.6 }}>
              <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: 13 }} />
            </ListItem>
            <ListItem sx={{ opacity: 0.6 }}>
              <ListItemText primary="Billing" primaryTypographyProps={{ fontSize: 13 }} />
            </ListItem>
            <ListItem sx={{ bgcolor: '#333' }}>
              <ListItemText primary="Flags" primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }} />
            </ListItem>
          </List>
        </Box>

        {/* Main panel */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Feature flags
            </Typography>
          </Box>
          
          <Box
            sx={{ flex: 1, p: 2 }}
            data-testid="flags-grid"
            data-selected-row-ids={JSON.stringify(selectedIds)}
          >
            <DataGrid
              rows={flagsData}
              columns={columns}
              checkboxSelection
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={(newModel) => setSelectionModel(newModel)}
              hideFooter
              disableColumnMenu
              density="compact"
              sx={{ 
                height: 400,
                fontSize: 12,
                '& .MuiDataGrid-cell': { py: 0.5 },
              }}
            />
          </Box>

          {/* Sticky action bar */}
          <Box sx={{ p: 2, borderTop: '1px solid #333', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleApply}
              data-testid="apply-btn"
            >
              Apply
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={showToast}
          autoHideDuration={3000}
          onClose={() => setShowToast(false)}
          message="Selection applied"
        />

        <div
          style={{ display: 'none' }}
          data-testid="committed-selection"
          data-selected-row-ids={JSON.stringify(committedSelection)}
        />
      </Box>
    </ThemeProvider>
  );
}
