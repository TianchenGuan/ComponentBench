'use client';

/**
 * data_grid_row_selection-mui-T06: Select multiple members in a dialog and apply
 *
 * The scene uses a modal_flow: the base page shows a button labeled "Add members".
 * Clicking it opens a MUI Dialog titled "Add members". The dialog body contains a MUI X DataGrid with
 * checkboxSelection enabled.
 * Spacing is comfortable and scale is default. The DataGrid shows 15 members with columns: Member ID,
 * Name, Role.
 * Initial state: no rows selected in the dialog. The dialog footer has a primary button labeled "Add selected"
 * and a secondary "Cancel".
 * Feedback: selecting rows checks their boxes; clicking "Add selected" closes the dialog and commits the
 * selected member IDs to an underlying selection state.
 *
 * Success: selected_row_ids equals ['M-12', 'M-19', 'M-23'] AND require_confirm (Add selected clicked)
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import {
  Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface MemberData {
  id: string;
  memberId: string;
  name: string;
  role: string;
}

const membersData: MemberData[] = [
  { id: 'M-10', memberId: 'M-10', name: 'Alice Chen', role: 'Developer' },
  { id: 'M-11', memberId: 'M-11', name: 'Bob Martinez', role: 'Designer' },
  { id: 'M-12', memberId: 'M-12', name: 'Carol Williams', role: 'Manager' },
  { id: 'M-13', memberId: 'M-13', name: 'David Kim', role: 'Developer' },
  { id: 'M-14', memberId: 'M-14', name: 'Eva Schmidt', role: 'QA' },
  { id: 'M-15', memberId: 'M-15', name: 'Frank Jones', role: 'Developer' },
  { id: 'M-16', memberId: 'M-16', name: 'Grace Liu', role: 'Designer' },
  { id: 'M-17', memberId: 'M-17', name: 'Henry Wilson', role: 'Manager' },
  { id: 'M-18', memberId: 'M-18', name: 'Iris Chang', role: 'Developer' },
  { id: 'M-19', memberId: 'M-19', name: 'Jack Brown', role: 'QA' },
  { id: 'M-20', memberId: 'M-20', name: 'Karen Lee', role: 'Developer' },
  { id: 'M-21', memberId: 'M-21', name: 'Leo Garcia', role: 'Designer' },
  { id: 'M-22', memberId: 'M-22', name: 'Mia Taylor', role: 'Manager' },
  { id: 'M-23', memberId: 'M-23', name: 'Noah Davis', role: 'Developer' },
  { id: 'M-24', memberId: 'M-24', name: 'Olivia Moore', role: 'QA' },
];

const columns: GridColDef[] = [
  { field: 'memberId', headerName: 'Member ID', width: 100 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'role', headerName: 'Role', width: 100 },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogSelection, setDialogSelection] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const [committedSelection, setCommittedSelection] = useState<string[]>([]);
  const hasSucceeded = useRef(false);

  const dialogSelectedIds = Array.from(dialogSelection.ids) as string[];

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setDialogSelection({ type: 'include', ids: new Set() });
  };

  const handleAddSelected = () => {
    setCommittedSelection(dialogSelectedIds);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setDialogSelection({ type: 'include', ids: new Set() });
  };

  // Check success condition
  useEffect(() => {
    if (!hasSucceeded.current && selectionEquals(committedSelection, ['M-12', 'M-19', 'M-23'])) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedSelection, onSuccess]);

  return (
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Button variant="contained" onClick={handleOpenDialog} data-testid="add-members-btn">
          Add members
        </Button>

        <Dialog open={isDialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
          <DialogTitle>Add members</DialogTitle>
          <DialogContent>
            <div
              style={{ height: 400, width: '100%' }}
              data-testid="members-grid"
              data-dialog-selected={JSON.stringify(dialogSelectedIds)}
            >
              <DataGrid
                rows={membersData}
                columns={columns}
                checkboxSelection
                rowSelectionModel={dialogSelection}
                onRowSelectionModelChange={(newModel) => setDialogSelection(newModel)}
                hideFooter
                disableColumnMenu
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleAddSelected} data-testid="add-selected-btn">
              Add selected
            </Button>
          </DialogActions>
        </Dialog>

        <div
          style={{ display: 'none' }}
          data-testid="committed-selection"
          data-selected-row-ids={JSON.stringify(committedSelection)}
        />
      </CardContent>
    </Card>
  );
}
