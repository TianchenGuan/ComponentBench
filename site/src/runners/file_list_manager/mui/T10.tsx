'use client';

/**
 * file_list_manager-mui-T10: Sort a dense attachment table in small scale
 *
 * setup_description: A single Attachments manager is shown in a centered card, but rendered in small scale:
 * reduced font size and tighter row height. The manager is a MUI Table with sortable headers (Name, Size, Type).
 * There are 25 files spanning many sizes. Initially the table is unsorted. Clicking the Size header cycles
 * through ascending and descending sort; an arrow indicator shows direction.
 *
 * Success: The Attachments table is sorted by Size in descending order (largest first).
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import type { TaskComponentProps, FileItem, SortConfig } from '../types';
import { formatFileSize } from '../types';

const initialFiles: FileItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `f${i + 1}`,
  name: `file-${String(i + 1).padStart(2, '0')}.${['pdf', 'docx', 'xlsx', 'txt', 'png'][i % 5]}`,
  type: ['PDF', 'DOCX', 'XLSX', 'TXT', 'PNG'][i % 5],
  size: Math.floor(10000 + Math.random() * 900000),
}));

// Fix sizes for determinism
initialFiles[0].size = 950000;
initialFiles[1].size = 50000;
initialFiles[2].size = 500000;
initialFiles[3].size = 750000;
initialFiles[4].size = 125000;

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    if (sortConfig.key === 'size' && sortConfig.direction === 'desc') {
      setCompleted(true);
      onSuccess();
    }
  }, [sortConfig, completed, onSuccess]);

  const handleSort = (key: 'name' | 'size' | 'type') => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key: null, direction: null };
    });
  };

  const sortedFiles = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return initialFiles;
    
    return [...initialFiles].sort((a, b) => {
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.key === 'size') {
        return (a.size - b.size) * multiplier;
      }
      if (sortConfig.key === 'name') {
        return a.name.localeCompare(b.name) * multiplier;
      }
      if (sortConfig.key === 'type') {
        return a.type.localeCompare(b.type) * multiplier;
      }
      return 0;
    });
  }, [sortConfig]);

  return (
    <Card sx={{ width: 500 }} data-testid="flm-root">
      <CardHeader title="Attachments" titleTypographyProps={{ variant: 'subtitle1' }} />
      <CardContent data-testid="flm-Attachments">
        <TableContainer sx={{ maxHeight: 350 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 11, py: 0.5 }}>
                  <TableSortLabel
                    active={sortConfig.key === 'name'}
                    direction={sortConfig.key === 'name' ? (sortConfig.direction || undefined) : undefined}
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontSize: 11, py: 0.5 }}>
                  <TableSortLabel
                    active={sortConfig.key === 'size'}
                    direction={sortConfig.key === 'size' ? (sortConfig.direction || undefined) : undefined}
                    onClick={() => handleSort('size')}
                    data-testid="flm-sort-size"
                  >
                    Size
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontSize: 11, py: 0.5 }}>
                  <TableSortLabel
                    active={sortConfig.key === 'type'}
                    direction={sortConfig.key === 'type' ? (sortConfig.direction || undefined) : undefined}
                    onClick={() => handleSort('type')}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedFiles.map((file) => (
                <TableRow key={file.id} hover data-testid={`flm-row-${file.id}`}>
                  <TableCell sx={{ fontSize: 11, py: 0.25 }}>{file.name}</TableCell>
                  <TableCell sx={{ fontSize: 11, py: 0.25 }}>{formatFileSize(file.size)}</TableCell>
                  <TableCell sx={{ fontSize: 11, py: 0.25 }}>{file.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
