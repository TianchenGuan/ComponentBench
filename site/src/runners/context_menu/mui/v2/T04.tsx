'use client';

/**
 * context_menu-mui-v2-T04: Gamma row — Columns toggles exact set
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, ListItemIcon, Divider } from '@mui/material';
import { Check as CheckIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

type ColKey = 'Owner' | 'Status' | 'Due date' | 'Tags';

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

const initial = (name: string): ColumnState =>
  name === 'Gamma'
    ? { Owner: false, Status: true, 'Due date': false, Tags: true }
    : { Owner: false, Status: true, 'Due date': false, Tags: true };

export default function T04({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowData[]>([
    { name: 'Alpha', columns: initial('Alpha') },
    { name: 'Beta', columns: initial('Beta') },
    { name: 'Gamma', columns: initial('Gamma') },
    { name: 'Delta', columns: initial('Delta') },
  ]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [subMenuAnchor, setSubMenuAnchor] = useState<HTMLElement | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const gamma = rows.find((r) => r.name === 'Gamma');

  useEffect(() => {
    if (
      gamma &&
      gamma.columns.Owner === true &&
      gamma.columns.Status === false &&
      gamma.columns['Due date'] === true &&
      gamma.columns.Tags === false &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [gamma, successTriggered, onSuccess]);

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

  const handleColumnToggle = (column: ColKey) => {
    if (!activeRow) return;
    setRows((prev) =>
      prev.map((row) =>
        row.name === activeRow
          ? { ...row, columns: { ...row.columns, [column]: !row.columns[column] } }
          : row
      )
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 1.5, width: 420 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontSize: 13 }}>
        Tasks
      </Typography>
      {rows.map((row) => (
        <Box
          key={row.name}
          onContextMenu={(e) => handleContextMenu(e, row.name)}
          sx={{
            p: 1,
            mb: 0.5,
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
          data-instance-label={row.name}
          data-columns={JSON.stringify(row.columns)}
        >
          <Typography variant="caption" fontWeight={600}>
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
            {Object.entries(row.columns)
              .filter(([, v]) => v)
              .map(([k]) => k)
              .join(', ') || '—'}
          </Typography>
        </Box>
      ))}

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem dense onClick={handleClose}>
          View details
        </MenuItem>
        <MenuItem dense onMouseEnter={(e) => setSubMenuAnchor(e.currentTarget)} data-testid="columns-menu-item">
          <Typography sx={{ flex: 1, fontSize: 12 }}>Columns</Typography>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem dense onClick={handleClose}>
          Export row
        </MenuItem>
      </Menu>

      <Menu
        open={Boolean(subMenuAnchor)}
        anchorEl={subMenuAnchor}
        onClose={() => setSubMenuAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        data-testid="columns-submenu"
      >
        {activeRow &&
          (['Owner', 'Status', 'Due date', 'Tags'] as const).map((col) => {
            const row = rows.find((r) => r.name === activeRow);
            const checked = row?.columns[col] ?? false;
            return (
              <MenuItem key={col} dense onClick={() => handleColumnToggle(col)} sx={{ fontSize: 12 }}>
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
    </Paper>
  );
}
