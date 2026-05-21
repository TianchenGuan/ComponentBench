'use client';

/**
 * data_table_sortable-mui-T20: Drawer - reset sorting and confirm (Inventory grid)
 *
 * Drawer flow scene with confirmation dialog.
 * - Main page has "Open Inventory" button.
 * - Clicking opens a right-side Drawer titled "Inventory".
 * - Inside: DataGrid with columns: Item, Category, Stock, Reorder level, Updated.
 * - Initial state: grid is pre-sorted by Stock descending.
 * - "Reset sorting" button opens a confirmation Dialog.
 * - Sort state is only cleared when "Reset" is clicked.
 *
 * Distractors: Close icon in drawer.
 * Success: Drawer open AND sort_model is empty (confirmed reset).
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Drawer,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Inventory2, Close } from '@mui/icons-material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../types';

interface InventoryData {
  id: string;
  item: string;
  category: string;
  stock: number;
  reorderLevel: number;
  updated: string;
}

const inventoryData: InventoryData[] = [
  { id: '1', item: 'Widget A', category: 'Electronics', stock: 150, reorderLevel: 50, updated: '2024-02-15' },
  { id: '2', item: 'Widget B', category: 'Electronics', stock: 85, reorderLevel: 30, updated: '2024-02-14' },
  { id: '3', item: 'Gadget X', category: 'Accessories', stock: 42, reorderLevel: 20, updated: '2024-02-13' },
  { id: '4', item: 'Gadget Y', category: 'Accessories', stock: 200, reorderLevel: 75, updated: '2024-02-12' },
  { id: '5', item: 'Tool Pro', category: 'Tools', stock: 63, reorderLevel: 25, updated: '2024-02-11' },
  { id: '6', item: 'Tool Basic', category: 'Tools', stock: 95, reorderLevel: 40, updated: '2024-02-10' },
  { id: '7', item: 'Part Alpha', category: 'Parts', stock: 180, reorderLevel: 100, updated: '2024-02-09' },
  { id: '8', item: 'Part Beta', category: 'Parts', stock: 250, reorderLevel: 80, updated: '2024-02-08' },
];

const columns: GridColDef[] = [
  { field: 'item', headerName: 'Item', width: 120 },
  { field: 'category', headerName: 'Category', width: 110 },
  { field: 'stock', headerName: 'Stock', width: 90 },
  { field: 'reorderLevel', headerName: 'Reorder level', width: 120 },
  { field: 'updated', headerName: 'Updated', width: 110 },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // Start with Stock sorted descending
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'stock', sort: 'desc' }]);

  const handleResetClick = () => {
    setDialogOpen(true);
  };

  const handleConfirmReset = () => {
    setSortModel([]);
    setDialogOpen(false);
  };

  const handleCancelReset = () => {
    setDialogOpen(false);
  };

  // Check success condition: drawer open AND sort model is empty
  useEffect(() => {
    if (drawerOpen && sortModel.length === 0) {
      onSuccess();
    }
  }, [drawerOpen, sortModel, onSuccess]);

  const canonicalSortModel: SortModel = sortModel.map((item: GridSortModel[number], idx: number) => ({
    column_key: item.field,
    direction: item.sort || 'asc',
    priority: idx + 1,
  }));

  return (
    <div style={{ width: 400 }}>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Inventory Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Inventory2 />}
            onClick={() => setDrawerOpen(true)}
          >
            Open Inventory
          </Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-overlay-type="drawer"
        data-overlay-label="Inventory"
      >
        <Box sx={{ width: 600, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Inventory</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Button
            variant="text"
            onClick={handleResetClick}
            sx={{ mb: 2 }}
          >
            Reset sorting
          </Button>

          <div style={{ height: 400 }}>
            <DataGrid
              rows={inventoryData}
              columns={columns}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              data-testid="grid-inventory"
              data-sort-model={JSON.stringify(canonicalSortModel)}
            />
          </div>
        </Box>
      </Drawer>

      <Dialog open={dialogOpen} onClose={handleCancelReset}>
        <DialogTitle>Reset sorting for Inventory?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will clear all sorting and return the table to its default order.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReset}>Cancel</Button>
          <Button onClick={handleConfirmReset} variant="contained" color="primary">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
