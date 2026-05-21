'use client';

/**
 * table_static-mui-T07: Expand a row's details (disclosure)
 *
 * A centered isolated card shows a read-only Builds table using MUI Table components. Each row begins
 * with a small disclosure control (chevron icon) that expands an inline details row beneath it (implemented with MUI Collapse).
 * Columns include Build, Branch, and Status; the expanded area shows additional read-only metadata (commit hash, duration).
 * Initial state: all rows are collapsed (no details shown). The disclosure icons are small targets and there are multiple
 * similar build IDs.
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Collapse,
  Chip,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import type { TaskComponentProps } from '../types';

interface BuildData {
  key: string;
  build: string;
  branch: string;
  status: 'Success' | 'Failed' | 'Running';
  commitHash: string;
  duration: string;
}

const buildsData: BuildData[] = [
  { key: 'build-243', build: 'build-243', branch: 'main', status: 'Success', commitHash: 'a1b2c3d', duration: '4m 32s' },
  { key: 'build-244', build: 'build-244', branch: 'feature/auth', status: 'Failed', commitHash: 'e4f5g6h', duration: '2m 15s' },
  { key: 'build-245', build: 'build-245', branch: 'main', status: 'Success', commitHash: 'i7j8k9l', duration: '5m 01s' },
  { key: 'build-246', build: 'build-246', branch: 'hotfix/login', status: 'Running', commitHash: 'm0n1o2p', duration: '1m 45s' },
  { key: 'build-247', build: 'build-247', branch: 'develop', status: 'Success', commitHash: 'q3r4s5t', duration: '3m 58s' },
  { key: 'build-254', build: 'build-254', branch: 'main', status: 'Success', commitHash: 'u6v7w8x', duration: '4m 12s' },
];

const getStatusColor = (status: string): 'success' | 'error' | 'info' => {
  switch (status) {
    case 'Success': return 'success';
    case 'Failed': return 'error';
    case 'Running': return 'info';
    default: return 'info';
  }
};

export default function T07({ onSuccess }: TaskComponentProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const successFiredRef = React.useRef(false);

  const handleToggleExpand = (key: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
        // Check for success condition
        if (key === 'build-245' && !successFiredRef.current) {
          successFiredRef.current = true;
          onSuccess();
        }
      }
      return newSet;
    });
  };

  return (
    <Card sx={{ width: 600 }} data-cb-expanded-rows={Array.from(expandedRows).join(',')}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Builds
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 40 }} />
                <TableCell>Build</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buildsData.map((row) => (
                <React.Fragment key={row.key}>
                  <TableRow data-row-key={row.key} data-expanded={expandedRows.has(row.key)}>
                    <TableCell sx={{ p: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleExpand(row.key)}
                        aria-label={expandedRows.has(row.key) ? 'Collapse' : 'Expand'}
                        data-testid={`expand-${row.key}`}
                      >
                        {expandedRows.has(row.key) ? (
                          <KeyboardArrowDownIcon fontSize="small" />
                        ) : (
                          <KeyboardArrowRightIcon fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.build}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ p: 0 }} colSpan={4}>
                      <Collapse in={expandedRows.has(row.key)} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Commit:</strong> {row.commitHash}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Duration:</strong> {row.duration}
                          </Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
