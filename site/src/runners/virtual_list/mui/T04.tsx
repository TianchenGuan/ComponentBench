'use client';

/**
 * virtual_list-mui-T04: Select multiple rows with checkboxes
 *
 * Layout: isolated_card centered titled "Invoices".
 * Target component: virtualized list (react-window) with ~1,000 invoice rows; each row includes a Checkbox.
 * Row content: Checkbox · "INV-####" · small secondary text (amount).
 * Initial state: no invoices checked; list starts at the top showing INV-0100… around the initial viewport.
 *
 * Success: Exactly invoices 0102, 0105, 0110 are checked
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, ListItem, ListItemButton, ListItemText, Checkbox, Toolbar } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../types';
import { selectionSetEquals } from '../types';

interface InvoiceItem {
  key: string;
  id: string;
  amount: number;
}

// Generate 1000 invoices starting from 0100
const generateInvoices = (): InvoiceItem[] => {
  return Array.from({ length: 1000 }, (_, i) => {
    const num = i + 100; // Start from 0100
    return {
      key: `inv-${String(num).padStart(4, '0')}`,
      id: `INV-${String(num).padStart(4, '0')}`,
      amount: Math.floor(Math.random() * 10000) + 100,
    };
  });
};

const invoices = generateInvoices();
const TARGET_KEYS = ['inv-0102', 'inv-0105', 'inv-0110'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());

  const handleToggleCheck = (key: string) => {
    setCheckedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Check success condition
  useEffect(() => {
    if (selectionSetEquals(checkedKeys, TARGET_KEYS)) {
      onSuccess();
    }
  }, [checkedKeys, onSuccess]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = invoices[index];
    const isChecked = checkedKeys.has(item.key);
    return (
      <ListItem
        style={style}
        disablePadding
        data-item-key={item.key}
        aria-checked={isChecked}
      >
        <ListItemButton onClick={() => handleToggleCheck(item.key)}>
          <Checkbox
            edge="start"
            checked={isChecked}
            disableRipple
          />
          <ListItemText 
            primary={item.id}
            secondary={`$${item.amount.toLocaleString()}`}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Paper elevation={2} sx={{ width: 400, p: 2 }} data-testid="vl-primary">
      <Typography variant="h6" gutterBottom>
        Invoices
      </Typography>
      <Toolbar variant="dense" sx={{ bgcolor: 'grey.100', borderRadius: 1, mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Selected: {checkedKeys.size}
        </Typography>
      </Toolbar>
      <Paper variant="outlined">
        <FixedSizeList
          height={400}
          width="100%"
          itemSize={56}
          itemCount={invoices.length}
          overscanCount={5}
        >
          {Row}
        </FixedSizeList>
      </Paper>
    </Paper>
  );
}
