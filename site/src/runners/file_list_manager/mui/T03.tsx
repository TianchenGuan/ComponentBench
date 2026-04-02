'use client';

/**
 * file_list_manager-mui-T03: Select a spreadsheet file
 *
 * setup_description: The Attachments manager is rendered as a compact MUI Table with a leading checkbox column
 * and 7 rows. No rows are selected initially. Selecting a row checks its checkbox and updates a small caption
 * "1 selected" under the table. Other action icons exist but do not affect selection.
 *
 * Success: Exactly one file is selected: "budget.xlsx".
 */

import React, { useState, useEffect } from 'react';
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
  Checkbox,
  Typography,
} from '@mui/material';
import type { TaskComponentProps, FileItem } from '../types';
import { formatFileSize } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'contract.pdf', type: 'PDF', size: 245000 },
  { id: 'f2', name: 'budget.xlsx', type: 'XLSX', size: 312000 },
  { id: 'f3', name: 'proposal.docx', type: 'DOCX', size: 128000 },
  { id: 'f4', name: 'receipt.png', type: 'PNG', size: 89000 },
  { id: 'f5', name: 'invoice.pdf', type: 'PDF', size: 156000 },
  { id: 'f6', name: 'notes.txt', type: 'TXT', size: 4500 },
  { id: 'f7', name: 'summary.pdf', type: 'PDF', size: 198000 },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    if (selected.length === 1 && selected[0] === 'f2') {
      setCompleted(true);
      onSuccess();
    }
  }, [selected, completed, onSuccess]);

  const handleSelect = (fileId: string) => {
    setSelected((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <Card sx={{ width: 500 }} data-testid="flm-root">
      <CardHeader title="Attachments" />
      <CardContent data-testid="flm-Attachments">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>File name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {initialFiles.map((file) => (
                <TableRow
                  key={file.id}
                  hover
                  selected={selected.includes(file.id)}
                  data-testid={`flm-row-${file.id}`}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(file.id)}
                      onChange={() => handleSelect(file.id)}
                      inputProps={{ 'aria-label': `Select ${file.name}` }}
                      data-testid={`flm-select-${file.id}`}
                    />
                  </TableCell>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          {selected.length} selected
        </Typography>
      </CardContent>
    </Card>
  );
}
