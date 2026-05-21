'use client';

/**
 * context_menu-mui-v2-T11: Delta / Net cell — scroll to Export as JSON
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Divider, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import type { TaskComponentProps } from '../../types';

const ROWS = ['Alpha', 'Beta', 'Gamma', 'Delta'] as const;
const COLS = ['Account', 'Net', 'Gross'] as const;

const menuItems = [
  'Copy value',
  'Copy row',
  'Copy as CSV',
  'Pin column',
  'divider',
  'Sort ascending',
  'Sort descending',
  'divider',
  'Format as currency',
  'Format as percent',
  'divider',
  'Export row',
  'Export as CSV',
  'Export as JSON',
];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [lastItem, setLastItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastItem === 'Export as JSON' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastItem, successTriggered, onSuccess]);

  const handleNetDeltaContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorPosition(null);
  };

  return (
    <Paper elevation={2} sx={{ p: 1.5, width: 440 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontSize: 13 }}>
        Revenue
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: 11, py: 0.5 }}>Row</TableCell>
            {COLS.map((c) => (
              <TableCell key={c} align="right" sx={{ fontSize: 11, py: 0.5 }}>
                {c}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row}>
              <TableCell sx={{ fontSize: 11, py: 0.5 }}>{row}</TableCell>
              {COLS.map((col) => {
                const isTarget = row === 'Delta' && col === 'Net';
                return (
                  <TableCell
                    key={col}
                    align="right"
                    onContextMenu={isTarget ? handleNetDeltaContextMenu : undefined}
                    sx={{
                      fontSize: 11,
                      py: 0.5,
                      cursor: isTarget ? 'context-menu' : 'default',
                    }}
                    data-testid={isTarget ? 'cell-delta-net' : `cell-${row}-${col}`}
                    data-instance-label={isTarget ? 'Delta__Net' : undefined}
                    data-last-activated={isTarget ? lastItem : undefined}
                  >
                    {row === 'Delta' && col === 'Net' ? '42.1k' : '—'}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        slotProps={{ paper: { style: { maxHeight: 200 } } }}
        data-testid="context-menu-overlay"
      >
        {menuItems.map((item, i) =>
          item === 'divider' ? (
            <Divider key={`d-${i}`} />
          ) : (
            <MenuItem
              key={item}
              dense
              sx={{ fontSize: 11, minHeight: 28 }}
              onClick={() => {
                setLastItem(item);
                handleClose();
              }}
            >
              {item}
            </MenuItem>
          )
        )}
      </Menu>
    </Paper>
  );
}
