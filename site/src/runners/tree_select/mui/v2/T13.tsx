'use client';

/**
 * tree_select-mui-v2-T13: Prefilled-neighbor billing taxonomy in compact settings panel
 *
 * Settings panel with two composite tree-selects: "Shipping category" prefilled with
 * Finance/Payroll/Benefits, "Billing category" empty. SimpleTreeView in Popover, no search.
 * Select Finance/Payroll/Taxes and click "Save section".
 *
 * Success: Billing = finance-payroll-taxes, Shipping unchanged, Save section clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Popover, Card, CardContent,
  Chip, Switch, FormControlLabel, Divider,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../../types';

const LEAF_IDS = [
  'finance-payroll-taxes', 'finance-payroll-benefits', 'finance-payroll-bonuses',
  'finance-accounting-ar', 'finance-accounting-ap', 'finance-treasury-cash',
];

function CompactTreeSelect({
  label, value, onChange, disabled,
}: {
  label: string; value: string | null; onChange: (v: string) => void; disabled?: boolean;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSelect = useCallback((_e: React.SyntheticEvent, itemId: string) => {
    if (LEAF_IDS.includes(itemId)) {
      onChange(itemId);
      setAnchorEl(null);
    }
  }, [onChange]);

  const display = value ? value.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' / ') : '';

  return (
    <>
      <TextField
        size="small" fullWidth label={label} value={display}
        onClick={(e) => !disabled && setAnchorEl(e.currentTarget as HTMLElement)}
        InputProps={{ readOnly: true }} disabled={disabled}
      />
      <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ maxHeight: 300, overflow: 'auto', p: 1, minWidth: 240 }}>
          <SimpleTreeView onItemClick={handleSelect}>
            <TreeItem itemId="finance" label="Finance">
              <TreeItem itemId="finance-payroll" label="Payroll">
                <TreeItem itemId="finance-payroll-taxes" label="Taxes" />
                <TreeItem itemId="finance-payroll-benefits" label="Benefits" />
                <TreeItem itemId="finance-payroll-bonuses" label="Bonuses" />
              </TreeItem>
              <TreeItem itemId="finance-accounting" label="Accounting">
                <TreeItem itemId="finance-accounting-ar" label="AR" />
                <TreeItem itemId="finance-accounting-ap" label="AP" />
              </TreeItem>
              <TreeItem itemId="finance-treasury" label="Treasury">
                <TreeItem itemId="finance-treasury-cash" label="Cash" />
              </TreeItem>
            </TreeItem>
          </SimpleTreeView>
        </Box>
      </Popover>
    </>
  );
}

const SHIPPING_INIT = 'finance-payroll-benefits';

export default function T13({ onSuccess }: TaskComponentProps) {
  const [billing, setBilling] = useState<string | null>(null);
  const [shipping] = useState<string>(SHIPPING_INIT);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && billing === 'finance-payroll-taxes' && shipping === SHIPPING_INIT) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, billing, shipping, onSuccess]);

  return (
    <Box sx={{ p: 2, maxWidth: 480, ml: 8 }}>
      <Typography variant="h6" gutterBottom>Category Settings</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <Chip label="Org: Acme" size="small" />
        <Chip label="Region: US" size="small" variant="outlined" />
        <FormControlLabel control={<Switch defaultChecked size="small" />} label="Auto-classify" />
      </Box>
      <Typography variant="caption" color="text.secondary" paragraph>
        Set billing and shipping categories for this section. Tooltips explain each branch.
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CompactTreeSelect label="Shipping category" value={shipping} onChange={() => {}} disabled />
            <CompactTreeSelect label="Billing category" value={billing} onChange={(v) => { setBilling(v); setCommitted(false); }} />
            <Divider />
            <Button variant="contained" size="small" onClick={() => setCommitted(true)}>Save section</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
