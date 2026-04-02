'use client';

/**
 * tree_select-mui-T10: Table cell: set escalation path and Apply
 *
 * Layout: a small dashboard table (layout=table_cell). The first row has an editable cell labeled "Escalation path".
 * Target component: the cell contains a composite TreeSelect:
 *   - When the cell is focused, it shows a compact MUI TextField as the editor.
 *   - Clicking the editor opens a MUI Popover with a RichTreeView.
 *   - The bottom of the popover has two buttons: "Apply" and "Cancel". Selection is only committed when "Apply" is clicked.
 * Tree data:
 *   - On-call → Platform → (Database, Networking, Observability), Product → (Payments, Checkout)
 *   - Support
 * Initial state: the cell currently shows "On-call / Platform / Observability".
 * Clutter (medium): the table has 4 columns and other editable cells.
 *
 * Success: The Escalation path editor's committed value equals leaf path [On-call, Platform, Database]
 * with value 'route_oncall_platform_database'. The "Apply" action has been executed.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Popover, InputAdornment, IconButton, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

const valueLabels: Record<string, string> = {
  route_oncall_platform_database: 'On-call / Platform / Database',
  route_oncall_platform_networking: 'On-call / Platform / Networking',
  route_oncall_platform_observability: 'On-call / Platform / Observability',
  route_oncall_product_payments: 'On-call / Product / Payments',
  route_oncall_product_checkout: 'On-call / Product / Checkout',
  route_support: 'Support',
};

const leafIds = new Set(Object.keys(valueLabels));

// Sample table data
const tableData = [
  { id: 1, name: 'Database latency', severity: 'High', escalation: 'route_oncall_platform_observability', owner: 'Platform Team' },
  { id: 2, name: 'Payment timeout', severity: 'Critical', escalation: 'route_oncall_product_payments', owner: 'Payments Team' },
  { id: 3, name: 'Login issues', severity: 'Medium', escalation: 'route_support', owner: 'Support Team' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [committedValue, setCommittedValue] = useState<string>('route_oncall_platform_observability');
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const successFired = useRef(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setPendingValue(committedValue);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPendingValue(null);
  };

  const handleSelect = (_event: React.SyntheticEvent, itemId: string | null) => {
    if (itemId && leafIds.has(itemId)) {
      setPendingValue(itemId);
    }
  };

  const handleApply = () => {
    if (pendingValue) {
      setCommittedValue(pendingValue);
    }
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!successFired.current && committedValue === 'route_oncall_platform_database') {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  return (
    <Card sx={{ width: 700 }} data-testid="tree-select-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Incident Escalations</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Incident</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Escalation path</TableCell>
                <TableCell>Owner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.severity}</TableCell>
                  <TableCell>
                    {index === 0 ? (
                      // Editable cell for first row - this is the target
                      <TextField
                        size="small"
                        value={valueLabels[committedValue] || committedValue}
                        onClick={handleClick}
                        InputProps={{
                          readOnly: true,
                          sx: { fontSize: 13 },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" onClick={handleClick}>
                                <ArrowDropDownIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ minWidth: 200 }}
                        data-testid="tree-select-escalation"
                        data-committed-value={committedValue}
                      />
                    ) : (
                      // Static display for other rows
                      <Typography variant="body2">{valueLabels[row.escalation] || row.escalation}</Typography>
                    )}
                  </TableCell>
                  <TableCell>{row.owner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 320, overflow: 'hidden' } } }}
      >
        <Box sx={{ maxHeight: 250, overflow: 'auto', p: 1 }}>
          <SimpleTreeView
            selectedItems={pendingValue || undefined}
            onSelectedItemsChange={handleSelect}
            data-testid="tree-view"
          >
            <TreeItem itemId="oncall" label="On-call">
              <TreeItem itemId="oncall_platform" label="Platform">
                <TreeItem itemId="route_oncall_platform_database" label="Database" />
                <TreeItem itemId="route_oncall_platform_networking" label="Networking" />
                <TreeItem itemId="route_oncall_platform_observability" label="Observability" />
              </TreeItem>
              <TreeItem itemId="oncall_product" label="Product">
                <TreeItem itemId="route_oncall_product_payments" label="Payments" />
                <TreeItem itemId="route_oncall_product_checkout" label="Checkout" />
              </TreeItem>
            </TreeItem>
            <TreeItem itemId="route_support" label="Support" />
          </SimpleTreeView>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1, borderTop: '1px solid #e0e0e0' }}>
          <Button size="small" onClick={handleCancel}>Cancel</Button>
          <Button size="small" variant="contained" onClick={handleApply}>Apply</Button>
        </Box>
      </Popover>
    </Card>
  );
}
