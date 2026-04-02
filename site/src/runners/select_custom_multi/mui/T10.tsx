'use client';

/**
 * select_custom_multi-mui-T10: Edit tags in the Customer C table row
 *
 * Scene context: theme=light, spacing=comfortable, layout=table_cell, placement=center, scale=default, instances=1, guidance=text, clutter=high.
 * Layout: table cell editor with high clutter. The page shows a table titled "Customer tags" with multiple rows (Customer A, Customer B, Customer C).
 * Only the Customer C row has an editable Tags cell using a MUI Autocomplete (multiple) rendered inside the table cell.
 * Other rows display read-only text tags (not editable Autocomplete fields).
 * To edit Customer C Tags, click inside the cell; the input appears with existing chips and a dropdown popper anchored to the cell.
 * Options (14): Active, Trial, Churn-risk, Enterprise, SMB, Onboarding, Needs-review, VIP, Blocked, Billing-hold, Security-review, EU, US, APAC.
 * Initial state (Customer C Tags): Active, US, Needs-review are preselected.
 * No explicit Save; edits apply immediately.
 *
 * Success: The selected values in the Customer C Tags multi-select are exactly: VIP, Enterprise, EU (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Autocomplete, TextField, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const tagOptions = [
  'Active', 'Trial', 'Churn-risk', 'Enterprise', 'SMB', 'Onboarding',
  'Needs-review', 'VIP', 'Blocked', 'Billing-hold', 'Security-review',
  'EU', 'US', 'APAC'
];

interface CustomerRow {
  id: string;
  name: string;
  tags: string[];
  editable: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [customerCTags, setCustomerCTags] = useState<string[]>(['Active', 'US', 'Needs-review']);

  useEffect(() => {
    const targetSet = new Set(['VIP', 'Enterprise', 'EU']);
    const currentSet = new Set(customerCTags);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [customerCTags, onSuccess]);

  const rows: CustomerRow[] = [
    { id: 'A', name: 'Customer A', tags: ['Active', 'Enterprise', 'US'], editable: false },
    { id: 'B', name: 'Customer B', tags: ['Trial', 'SMB', 'EU'], editable: false },
    { id: 'C', name: 'Customer C', tags: customerCTags, editable: true },
  ];

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Customer tags</Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Tags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ width: 120 }}>{row.name}</TableCell>
                  <TableCell>
                    {row.editable ? (
                      <Autocomplete
                        multiple
                        size="small"
                        data-testid="customer-c-tags-select"
                        options={tagOptions}
                        value={customerCTags}
                        onChange={(_, newValue) => setCustomerCTags(newValue)}
                        limitTags={2}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip label={option} size="small" {...getTagProps({ index })} key={option} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Select tags" size="small" />
                        )}
                        sx={{ minWidth: 300 }}
                      />
                    ) : (
                      <Typography variant="body2">{row.tags.join(', ')}</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
