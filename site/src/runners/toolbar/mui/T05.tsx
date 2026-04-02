'use client';

/**
 * toolbar-mui-T05: Set Filter and Group toggles in the Table toolbar
 *
 * The page is arranged as a table_cell scene: a data table is centered on the page 
 * with a header row. Inside the table header there is a compact MUI Toolbar labeled 
 * "Table toolbar" (target).
 * The Table toolbar contains a multiple-selection ToggleButtonGroup with three labeled 
 * ToggleButtons: "Filter", "Sort", and "Group".
 * Above the table, there is a larger "Page toolbar" (distractor) that also contains 
 * toggle buttons with similar styling.
 * Initial state in the Table toolbar: Sort is On, Filter is Off, Group is Off.
 */

import React, { useState } from 'react';
import {
  Paper,
  Toolbar,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [pageToggles, setPageToggles] = useState<string[]>(['export']);
  const [tableToggles, setTableToggles] = useState<string[]>(['sort']);

  const handlePageToggles = (
    event: React.MouseEvent<HTMLElement>,
    newToggles: string[]
  ) => {
    setPageToggles(newToggles);
  };

  const handleTableToggles = (
    event: React.MouseEvent<HTMLElement>,
    newToggles: string[]
  ) => {
    setTableToggles(newToggles);
    // Success: filter=true, group=true, sort=false
    const hasFilter = newToggles.includes('filter');
    const hasGroup = newToggles.includes('group');
    const hasSort = newToggles.includes('sort');
    if (hasFilter && hasGroup && !hasSort) {
      onSuccess();
    }
  };

  return (
    <Box sx={{ width: 550 }}>
      {/* Page toolbar (distractor) */}
      <Paper elevation={1} sx={{ mb: 2, p: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Page toolbar
        </Typography>
        <ToggleButtonGroup
          value={pageToggles}
          onChange={handlePageToggles}
          size="small"
          data-testid="mui-toolbar-page"
        >
          <ToggleButton value="filter">
            <FilterListIcon sx={{ mr: 0.5 }} fontSize="small" />
            Filter
          </ToggleButton>
          <ToggleButton value="sort">
            <SortIcon sx={{ mr: 0.5 }} fontSize="small" />
            Sort
          </ToggleButton>
          <ToggleButton value="export">
            Export
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* Table with Table toolbar (target) */}
      <Paper elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3}>
                <Toolbar
                  variant="dense"
                  sx={{ minHeight: 48, pl: 0, pr: 0 }}
                  data-testid="mui-toolbar-table"
                >
                  <Typography variant="subtitle2" sx={{ mr: 2 }}>
                    Table toolbar
                  </Typography>
                  <ToggleButtonGroup
                    value={tableToggles}
                    onChange={handleTableToggles}
                    size="small"
                    aria-label="table options"
                  >
                    <ToggleButton
                      value="filter"
                      aria-pressed={tableToggles.includes('filter')}
                      data-testid="mui-toolbar-table-filter"
                    >
                      <FilterListIcon sx={{ mr: 0.5 }} fontSize="small" />
                      Filter
                    </ToggleButton>
                    <ToggleButton
                      value="sort"
                      aria-pressed={tableToggles.includes('sort')}
                      data-testid="mui-toolbar-table-sort"
                    >
                      <SortIcon sx={{ mr: 0.5 }} fontSize="small" />
                      Sort
                    </ToggleButton>
                    <ToggleButton
                      value="group"
                      aria-pressed={tableToggles.includes('group')}
                      data-testid="mui-toolbar-table-group"
                    >
                      <GroupWorkIcon sx={{ mr: 0.5 }} fontSize="small" />
                      Group
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Toolbar>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Item A</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>2024-01-15</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Item B</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>2024-01-16</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Box sx={{ p: 1, bgcolor: 'grey.50' }}>
          <Typography variant="caption" color="text.secondary">
            Enabled: {tableToggles.length > 0 ? tableToggles.join(', ') : 'none'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
