'use client';

/**
 * data_table_paginated-mui-T07: Users grid: reset filters and sorting to default view
 *
 * Layout: **settings_panel** for "User Directory". The Users grid is the main element,
 * with a compact toolbar at the top.
 *
 * Component: MUI X DataGrid with a custom toolbar that includes a **Reset view** button.
 *
 * Initial state (important): the grid starts in a non-default state:
 * • Filter active: Status equals Inactive
 * • Sort active: Last seen descending
 * • Current page: 4
 *
 * Distractors: the settings panel also includes toggles ("Show avatars", "Show emails")
 * above the grid; they do not affect the checker.
 *
 * Success: Pagination is on page 1, no filters are active, no sorting is active.
 */

import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridFilterModel,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { Card, CardHeader, CardContent, Chip, Box, Button, Switch, FormControlLabel, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import type { TaskComponentProps } from '../types';
import { generateUserData } from '../types';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'User ID', width: 100, sortable: true },
  { field: 'name', headerName: 'Name', width: 150, sortable: true },
  { field: 'role', headerName: 'Role', width: 100, sortable: true },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    sortable: true,
    type: 'singleSelect',
    valueOptions: ['Active', 'Inactive', 'Pending'],
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={params.value === 'Active' ? 'success' : params.value === 'Inactive' ? 'default' : 'warning'}
      />
    ),
  },
  {
    field: 'lastSeen',
    headerName: 'Last seen',
    width: 180,
    sortable: true,
    valueFormatter: (value: string) => new Date(value).toLocaleString(),
  },
];

interface CustomToolbarProps {
  onReset: () => void;
}

function CustomToolbar({ onReset }: CustomToolbarProps) {
  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <Button
        startIcon={<RestartAltIcon />}
        onClick={onReset}
        size="small"
        data-testid="reset-view-button"
      >
        Reset view
      </Button>
    </GridToolbarContainer>
  );
}

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [rows] = useState(() => generateUserData(250));
  
  // Start in non-default state
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 3, // Page 4 (0-indexed)
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'lastSeen', sort: 'desc' },
  ]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [{ field: 'status', operator: 'is', value: 'Inactive' }],
  });
  
  // Distractor settings
  const [showAvatars, setShowAvatars] = useState(true);
  const [showEmails, setShowEmails] = useState(true);
  
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    const isPageOne = paginationModel.page === 0;
    // Consider filters empty if no items have actual values
    const activeFilters = filterModel.items.filter(i => i.value !== undefined && i.value !== '' && i.value !== null);
    const noFilters = activeFilters.length === 0;
    const noSort = sortModel.length === 0 || sortModel.every(s => s.sort === undefined || s.sort === null);
    
    if (isPageOne && noFilters && noSort && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [paginationModel, filterModel, sortModel, hasSucceeded, onSuccess]);

  const handleReset = () => {
    setPaginationModel({ page: 0, pageSize: 25 });
    setSortModel([]);
    setFilterModel({ items: [] });
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h6" gutterBottom>User Directory Settings</Typography>
      
      {/* Settings toggles (distractors) */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControlLabel
          control={<Switch checked={showAvatars} onChange={(e) => setShowAvatars(e.target.checked)} />}
          label="Show avatars"
        />
        <FormControlLabel
          control={<Switch checked={showEmails} onChange={(e) => setShowEmails(e.target.checked)} />}
          label="Show emails"
        />
      </Box>

      {/* Users grid */}
      <Card data-testid="users-card">
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            pageSizeOptions={[25]}
            disableRowSelectionOnClick
            slots={{
              toolbar: () => <CustomToolbar onReset={handleReset} />,
            }}
            sx={{ height: 500 }}
            data-testid="users-grid"
            data-current-page={paginationModel.page + 1}
            data-filter-model={JSON.stringify(filterModel)}
            data-sort-model={JSON.stringify(sortModel)}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
