'use client';

/**
 * tree_grid-mui-T09: Edit Quota to 1,024 (dark, small)
 *
 * Layout: isolated card centered.
 * Theme & scale: dark theme; small scale.
 * Component: MUI composite tree table. The "Quota" column is editable (numeric).
 * Initial state: all nodes collapsed; no filters; no selection. API Gateway currently shows Quota "512".
 * Interaction: expand Platform, click the API Gateway row's Quota cell to edit,
 * type the new value, and press Enter to commit.
 * Formatting requirement: "Use comma grouping for thousands (e.g., 1,024)".
 * Feedback: after commit, the cell exits edit mode and shows the formatted number.
 *
 * Success: The Quota cell for Platform → API Gateway equals display value "1,024" (canonical integer 1024).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, TextField,
  ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { formatGroupedNumber } from '../types';

const darkTheme = createTheme({
  palette: { mode: 'dark' },
});

interface QuotaRow {
  key: string;
  name: string;
  owner: string;
  quota: number;
  children?: QuotaRow[];
}

function generateQuotaData(): QuotaRow[] {
  return [
    {
      key: 'platform',
      name: 'Platform',
      owner: 'Alice Chen',
      quota: 10000,
      children: [
        { key: 'platform/api-gateway', name: 'API Gateway', owner: 'Bob Smith', quota: 512 },
        { key: 'platform/auth-service', name: 'Auth Service', owner: 'Carol Davis', quota: 256 },
      ],
    },
    {
      key: 'finance',
      name: 'Finance',
      owner: 'Eve Wilson',
      quota: 5000,
      children: [
        { key: 'finance/billing', name: 'Billing', owner: 'Frank Brown', quota: 2048 },
      ],
    },
  ];
}

const TARGET_ID = 'platform/api-gateway';
const TARGET_VALUE = 1024;

interface TreeTableRowProps {
  row: QuotaRow;
  depth: number;
  expandedKeys: Set<string>;
  editingKey: string | null;
  editingValue: string;
  onToggleExpand: (key: string) => void;
  onStartEdit: (key: string, value: number) => void;
  onChangeEdit: (value: string) => void;
  onSave: (key: string) => void;
}

function TreeTableRowComponent({
  row, depth, expandedKeys, editingKey, editingValue,
  onToggleExpand, onStartEdit, onChangeEdit, onSave
}: TreeTableRowProps) {
  const isExpanded = expandedKeys.has(row.key);
  const isEditing = editingKey === row.key;
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <TableRow hover sx={{ '& td': { py: 0.5 } }}>
        <TableCell sx={{ pl: depth * 2 + 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            {hasChildren ? (
              <IconButton size="small" sx={{ p: 0.25, color: 'inherit' }} onClick={() => onToggleExpand(row.key)}>
                {isExpanded ? <KeyboardArrowDown sx={{ fontSize: 16 }} /> : <KeyboardArrowRight sx={{ fontSize: 16 }} />}
              </IconButton>
            ) : (
              <Box sx={{ width: 20 }} />
            )}
            <Typography variant="caption">{row.name}</Typography>
          </Box>
        </TableCell>
        <TableCell><Typography variant="caption">{row.owner}</Typography></TableCell>
        <TableCell>
          {isEditing ? (
            <TextField
              size="small"
              value={editingValue}
              onChange={(e) => onChangeEdit(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSave(row.key); }}
              onBlur={() => onSave(row.key)}
              autoFocus
              sx={{ width: 80, '& input': { py: 0.25, fontSize: 12 } }}
            />
          ) : (
            <Typography
              variant="caption"
              sx={{ cursor: 'pointer' }}
              onClick={() => onStartEdit(row.key, row.quota)}
            >
              {formatGroupedNumber(row.quota)}
            </Typography>
          )}
        </TableCell>
      </TableRow>
      {hasChildren && isExpanded && row.children!.map(child => (
        <TreeTableRowComponent
          key={child.key}
          row={child}
          depth={depth + 1}
          expandedKeys={expandedKeys}
          editingKey={editingKey}
          editingValue={editingValue}
          onToggleExpand={onToggleExpand}
          onStartEdit={onStartEdit}
          onChangeEdit={onChangeEdit}
          onSave={onSave}
        />
      ))}
    </>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<QuotaRow[]>(generateQuotaData);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const successFired = useRef(false);

  const findQuota = (rows: QuotaRow[], key: string): number | null => {
    for (const row of rows) {
      if (row.key === key) return row.quota;
      if (row.children) {
        const found = findQuota(row.children, key);
        if (found !== null) return found;
      }
    }
    return null;
  };

  const currentTargetValue = findQuota(data, TARGET_ID);

  useEffect(() => {
    if (!successFired.current && currentTargetValue === TARGET_VALUE && editingKey !== TARGET_ID) {
      successFired.current = true;
      onSuccess();
    }
  }, [currentTargetValue, editingKey, onSuccess]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const updateQuota = (rows: QuotaRow[], key: string, newQuota: number): QuotaRow[] => {
    return rows.map(row => {
      if (row.key === key) return { ...row, quota: newQuota };
      if (row.children) return { ...row, children: updateQuota(row.children, key, newQuota) };
      return row;
    });
  };

  const handleSave = (key: string) => {
    const cleaned = editingValue.replace(/,/g, '');
    const parsed = parseInt(cleaned, 10);
    if (!isNaN(parsed)) {
      setData(prev => updateQuota(prev, key, parsed));
    }
    setEditingKey(null);
    setEditingValue('');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Card sx={{ width: 420, bgcolor: 'background.paper' }} data-testid="tree-grid-card">
        <CardContent sx={{ p: 1.5 }}>
          <Typography variant="subtitle1" gutterBottom>Service Catalog</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Set Platform → API Gateway Quota to 1,024.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Use comma grouping for thousands (e.g., 1,024)
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 280 }}>
            <Table size="small" stickyHeader data-testid="tree-grid">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 0.5 }}>Name</TableCell>
                  <TableCell sx={{ py: 0.5 }}>Owner</TableCell>
                  <TableCell sx={{ py: 0.5 }}>Quota</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(row => (
                  <TreeTableRowComponent
                    key={row.key}
                    row={row}
                    depth={0}
                    expandedKeys={expandedKeys}
                    editingKey={editingKey}
                    editingValue={editingValue}
                    onToggleExpand={toggleExpand}
                    onStartEdit={(key, value) => {
                      setEditingKey(key);
                      setEditingValue(formatGroupedNumber(value));
                    }}
                    onChangeEdit={setEditingValue}
                    onSave={handleSave}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
