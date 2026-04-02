'use client';

/**
 * inline_editable_text-mui-T10: Edit table status cell (compact, top-right)
 * 
 * A compact table card is positioned near the top-right of the viewport.
 * The card title is "Inventory". The table has three rows (Widget A, Widget B, Widget C)
 * and columns: Item, Status, Qty.
 * 
 * Only one cell is inline-editable: the Status cell in the Widget B row. It shows "Backorder"
 * as Typography and reveals a small pencil IconButton when hovered.
 * 
 * Success: The committed (display) value in Widget B/Status cell equals 'In Stock' exactly,
 * and the cell is not in editing mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  IconButton,
  Button,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { TaskComponentProps } from '../types';

interface InventoryRow {
  id: string;
  item: string;
  status: string;
  qty: number;
  editable: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [widgetBStatus, setWidgetBStatus] = useState('Backorder');
  const [editingValue, setEditingValue] = useState('Backorder');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && widgetBStatus === 'In Stock' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [widgetBStatus, isEditing, onSuccess]);

  const handleEdit = () => {
    setEditingValue(widgetBStatus);
    setIsEditing(true);
  };

  const handleSave = () => {
    setWidgetBStatus(editingValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingValue(widgetBStatus);
    setIsEditing(false);
  };

  const data: InventoryRow[] = [
    { id: 'widget-a', item: 'Widget A', status: 'In Stock', qty: 150, editable: false },
    { id: 'widget-b', item: 'Widget B', status: widgetBStatus, qty: 0, editable: true },
    { id: 'widget-c', item: 'Widget C', status: 'Limited', qty: 25, editable: false },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'In Stock') return 'success';
    if (status === 'Backorder') return 'warning';
    return 'default';
  };

  return (
    <Card sx={{ width: 450 }} data-testid="inventory-card">
      <CardHeader title="Inventory" sx={{ pb: 1 }} />
      <CardContent sx={{ pt: 0 }}>
        <TableContainer>
          <Table size="small" data-testid="inventory-table">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Qty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.item}</TableCell>
                  <TableCell>
                    {row.editable ? (
                      <Box
                        data-testid="editable-cell-widget-b-status"
                        data-mode={isEditing ? 'editing' : 'display'}
                        data-value={widgetBStatus}
                      >
                        {isEditing ? (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <TextField
                              inputRef={inputRef}
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              size="small"
                              sx={{ width: 100 }}
                              data-testid="editable-input"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') handleCancel();
                              }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleSave}
                              data-testid="save-button"
                              aria-label="Save"
                              sx={{ minWidth: 'auto', px: 0.5, fontSize: 12 }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={handleCancel}
                              data-testid="cancel-button"
                              aria-label="Cancel"
                              sx={{ minWidth: 'auto', px: 0.5, fontSize: 12 }}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              cursor: 'pointer',
                              '&:hover .edit-icon': { opacity: 1 },
                            }}
                            onClick={handleEdit}
                            data-testid="display-text"
                          >
                            <Chip
                              label={row.status}
                              size="small"
                              color={getStatusColor(row.status) as any}
                            />
                            <IconButton
                              size="small"
                              className="edit-icon"
                              sx={{ opacity: 0, transition: 'opacity 0.2s' }}
                            >
                              <EditIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Chip
                        label={row.status}
                        size="small"
                        color={getStatusColor(row.status) as any}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">{row.qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
