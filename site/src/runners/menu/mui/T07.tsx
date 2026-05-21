'use client';

/**
 * menu-mui-T07: Scroll within a constrained table-cell menu to select South America
 * 
 * Scene: theme=light, spacing=comfortable, layout=table_cell, placement=center, scale=default, instances=1.
 *
 * A small data table is shown inside a centered card. In the table's first row, the "Region" column
 * contains an embedded vertical menu (MUI MenuList) inside a constrained-height cell.
 * Because the cell is short, the menu list itself scrolls (not the whole page).
 *
 * Menu items (alphabetical regions/continents):
 * - Africa, Asia, Europe, North America, Oceania, South America ← target (positioned below the fold)
 * - Plus additional items like "Antarctica", "Middle East", etc., to force scrolling
 *
 * Initial state:
 * - "Europe" is selected initially.
 *
 * Success: The Region menu selection is "South America".
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuList,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const regionItems = [
  'Africa',
  'Antarctica',
  'Asia',
  'Caribbean',
  'Central America',
  'Europe',
  'Middle East',
  'North America',
  'Oceania',
  'South America',
  'Southeast Asia',
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('Europe');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedRegion === 'South America' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedRegion, successTriggered, onSuccess]);

  return (
    <Paper elevation={2} sx={{ p: 2, width: 500 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Data Overview</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Region Filter</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Sales</TableCell>
              <TableCell sx={{ p: 0, verticalAlign: 'top' }}>
                <Box
                  sx={{ maxHeight: 150, overflowY: 'auto' }}
                  data-testid="region-menu-scroll"
                >
                  <MenuList dense data-testid="menu-region">
                    {regionItems.map((region) => (
                      <MenuItem
                        key={region}
                        selected={selectedRegion === region}
                        onClick={() => setSelectedRegion(region)}
                        sx={{ fontSize: '0.8rem' }}
                      >
                        {region}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Box>
              </TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Region filter: <strong data-testid="region-filter">{selectedRegion}</strong>
        </Typography>
      </Box>
    </Paper>
  );
}
