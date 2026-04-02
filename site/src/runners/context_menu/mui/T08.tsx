'use client';

/**
 * context_menu-mui-T08: Gamma row: set Columns toggles
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=3.
 *
 * Instances: THREE simple rows are listed inside the card, each opens a context menu on right-click:
 * - Alpha
 * - Beta
 * - Gamma
 *
 * Target instance: Gamma.
 *
 * Context menu implementation: each row has an onContextMenu handler that opens a MUI Menu.
 * The menu includes a nested submenu "Columns" that opens to the right.
 *
 * Menu structure:
 * - View details
 * - Columns ▸
 *     - Owner (checkable)
 *     - Status (checkable)
 *     - Due date (checkable)
 *     - Tags (checkable)
 * - Export row
 *
 * Initial checked state inside Columns for Gamma:
 * - Owner: OFF
 * - Status: ON
 * - Due date: OFF
 * - Tags: ON (irrelevant)
 *
 * Success: For context menu instance 'Gamma', Columns checked states match: Owner=true, Status=false, Due date=true.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, ListItemIcon, Divider } from '@mui/material';
import { Check as CheckIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

interface ColumnState {
  Owner: boolean;
  Status: boolean;
  'Due date': boolean;
  Tags: boolean;
}

interface RowData {
  name: string;
  columns: ColumnState;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowData[]>([
    { name: 'Alpha', columns: { Owner: false, Status: true, 'Due date': false, Tags: true } },
    { name: 'Beta', columns: { Owner: false, Status: true, 'Due date': false, Tags: true } },
    { name: 'Gamma', columns: { Owner: false, Status: true, 'Due date': false, Tags: true } },
  ]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [subMenuAnchor, setSubMenuAnchor] = useState<HTMLElement | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const gammaRow = rows.find((r) => r.name === 'Gamma');

  useEffect(() => {
    if (
      gammaRow &&
      gammaRow.columns.Owner === true &&
      gammaRow.columns.Status === false &&
      gammaRow.columns['Due date'] === true &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [gammaRow, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent, rowName: string) => {
    event.preventDefault();
    setActiveRow(rowName);
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setSubMenuAnchor(null);
    setAnchorPosition(null);
    setActiveRow(null);
  };

  const handleColumnsHover = (event: React.MouseEvent<HTMLElement>) => {
    setSubMenuAnchor(event.currentTarget);
  };

  const handleSubMenuClose = () => {
    setSubMenuAnchor(null);
  };

  const handleColumnToggle = (column: keyof ColumnState) => {
    if (!activeRow) return;
    setRows((prev) =>
      prev.map((row) =>
        row.name === activeRow
          ? { ...row, columns: { ...row.columns, [column]: !row.columns[column] } }
          : row
      )
    );
    // Keep submenu open
  };

  return (
    <Paper elevation={2} sx={{ p: 2, width: 400 }}>
      <Typography variant="h6" gutterBottom>
        Table Rows
      </Typography>

      {rows.map((row) => (
        <Box
          key={row.name}
          onContextMenu={(e) => handleContextMenu(e, row.name)}
          sx={{
            p: 1.5,
            mb: 1,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200',
            cursor: 'context-menu',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          data-testid={`row-${row.name.toLowerCase()}`}
          data-columns={JSON.stringify(row.columns)}
        >
          <Typography variant="body2" fontWeight={500}>{row.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {Object.entries(row.columns).filter(([, v]) => v).map(([k]) => k).join(', ')}
          </Typography>
        </Box>
      ))}

      {/* Main context menu */}
      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem onClick={handleClose}>View details</MenuItem>
        <MenuItem
          onMouseEnter={handleColumnsHover}
          data-testid="columns-menu-item"
        >
          <Typography sx={{ flex: 1 }}>Columns</Typography>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Export row</MenuItem>
      </Menu>

      {/* Columns submenu */}
      <Menu
        open={Boolean(subMenuAnchor)}
        anchorEl={subMenuAnchor}
        onClose={handleSubMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        data-testid="columns-submenu"
      >
        {activeRow &&
          (['Owner', 'Status', 'Due date', 'Tags'] as const).map((col) => {
            const row = rows.find((r) => r.name === activeRow);
            const checked = row?.columns[col] ?? false;
            return (
              <MenuItem
                key={col}
                onClick={() => handleColumnToggle(col)}
                data-testid={`column-${col.toLowerCase().replace(' ', '-')}`}
              >
                {checked && (
                  <ListItemIcon>
                    <CheckIcon fontSize="small" />
                  </ListItemIcon>
                )}
                <Typography sx={{ pl: checked ? 0 : 4 }}>{col}</Typography>
              </MenuItem>
            );
          })}
      </Menu>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Gamma columns: Owner={gammaRow?.columns.Owner ? 'ON' : 'OFF'}, Status={gammaRow?.columns.Status ? 'ON' : 'OFF'}, Due date={gammaRow?.columns['Due date'] ? 'ON' : 'OFF'}
      </Typography>
    </Paper>
  );
}
