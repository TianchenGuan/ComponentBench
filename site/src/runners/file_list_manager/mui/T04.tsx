'use client';

/**
 * file_list_manager-mui-T04: Select three invoices in the correct manager
 *
 * setup_description: The page contains two file list managers (instances=2) in a single centered card:
 * "Billing attachments" (left) and "Support tickets" (right). Both are MUI Tables with a checkbox selection
 * column. The Billing list contains several invoices and receipts, including the three target invoice PDFs.
 * The Support tickets list also contains PDFs with similar names as distractors.
 *
 * Success: In "Billing attachments", the selected set is exactly: invoice-jan.pdf, invoice-feb.pdf, invoice-mar.pdf.
 * No files are selected in "Support tickets".
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import type { TaskComponentProps, FileItem } from '../types';

const billingFiles: FileItem[] = [
  { id: 'b1', name: 'invoice-jan.pdf', type: 'PDF', size: 145000 },
  { id: 'b2', name: 'invoice-feb.pdf', type: 'PDF', size: 156000 },
  { id: 'b3', name: 'invoice-mar.pdf', type: 'PDF', size: 167000 },
  { id: 'b4', name: 'receipt-001.pdf', type: 'PDF', size: 45000 },
  { id: 'b5', name: 'receipt-002.pdf', type: 'PDF', size: 52000 },
  { id: 'b6', name: 'statement.pdf', type: 'PDF', size: 234000 },
];

const supportFiles: FileItem[] = [
  { id: 's1', name: 'invoice-help.pdf', type: 'PDF', size: 89000 },
  { id: 's2', name: 'ticket-001.pdf', type: 'PDF', size: 67000 },
  { id: 's3', name: 'ticket-002.pdf', type: 'PDF', size: 78000 },
  { id: 's4', name: 'resolution.pdf', type: 'PDF', size: 123000 },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [billingSelected, setBillingSelected] = useState<string[]>([]);
  const [supportSelected, setSupportSelected] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const correctBilling =
      billingSelected.length === 3 &&
      billingSelected.includes('b1') &&
      billingSelected.includes('b2') &&
      billingSelected.includes('b3');
    const noSupport = supportSelected.length === 0;

    if (correctBilling && noSupport) {
      setCompleted(true);
      onSuccess();
    }
  }, [billingSelected, supportSelected, completed, onSuccess]);

  const handleBillingSelect = (fileId: string) => {
    setBillingSelected((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSupportSelect = (fileId: string) => {
    setSupportSelected((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const renderTable = (
    files: FileItem[],
    selected: string[],
    onSelect: (id: string) => void,
    testId: string
  ) => (
    <TableContainer data-testid={testId}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell>File name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.id}
              hover
              selected={selected.includes(file.id)}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.includes(file.id)}
                  onChange={() => onSelect(file.id)}
                  data-testid={`flm-select-${file.id}`}
                />
              </TableCell>
              <TableCell>{file.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Card sx={{ width: 700 }} data-testid="flm-root">
      <CardContent>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom data-testid="flm-Billing-header">
              Billing attachments
            </Typography>
            {renderTable(billingFiles, billingSelected, handleBillingSelect, 'flm-Billing attachments')}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom data-testid="flm-Support-header">
              Support tickets
            </Typography>
            {renderTable(supportFiles, supportSelected, handleSupportSelect, 'flm-Support tickets')}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
