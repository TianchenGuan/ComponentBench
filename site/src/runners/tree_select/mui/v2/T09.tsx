'use client';

/**
 * tree_select-mui-v2-T09: Compact table cell activation — set PagerDuty and apply row
 *
 * Table with two editable rows: "Password reset" (target) and "Invoice failure" (non-target).
 * Each row has an "Integration" tree selector (TextField + Popover + SimpleTreeView) and
 * a row-local "Apply row" button. Scrollable popover tree.
 *
 * Success: Password reset = integrations-monitoring-pagerduty, Invoice failure unchanged, Apply row clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Popover, Chip, Paper,
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../../types';

const INITIAL_INVOICE = 'integrations-billing-stripe';

function TreeSelectField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string | null;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSelect = useCallback((_e: React.SyntheticEvent, itemId: string) => {
    if (itemId.split('-').length >= 3) {
      onChange(itemId);
      setAnchorEl(null);
    }
  }, [onChange]);

  const displayLabel = value ? value.split('-').pop() : '';

  return (
    <>
      <TextField
        size="small"
        label={label}
        value={displayLabel}
        onClick={(e) => !disabled && setAnchorEl(e.currentTarget as HTMLElement)}
        InputProps={{ readOnly: true }}
        disabled={disabled}
        sx={{ minWidth: 200 }}
      />
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ maxHeight: 360, overflow: 'auto', p: 1, minWidth: 240 }}>
          <SimpleTreeView onItemClick={handleSelect}>
            <TreeItem itemId="integrations" label="Integrations">
              <TreeItem itemId="integrations-monitoring" label="Monitoring">
                <TreeItem itemId="integrations-monitoring-datadog" label="Datadog" />
                <TreeItem itemId="integrations-monitoring-newrelic" label="New Relic" />
                <TreeItem itemId="integrations-monitoring-grafana" label="Grafana" />
                <TreeItem itemId="integrations-monitoring-prometheus" label="Prometheus" />
                <TreeItem itemId="integrations-monitoring-splunk" label="Splunk" />
                <TreeItem itemId="integrations-monitoring-pagerduty" label="PagerDuty" />
              </TreeItem>
              <TreeItem itemId="integrations-billing" label="Billing">
                <TreeItem itemId="integrations-billing-stripe" label="Stripe" />
                <TreeItem itemId="integrations-billing-braintree" label="Braintree" />
              </TreeItem>
              <TreeItem itemId="integrations-auth" label="Auth">
                <TreeItem itemId="integrations-auth-okta" label="Okta" />
                <TreeItem itemId="integrations-auth-auth0" label="Auth0" />
              </TreeItem>
            </TreeItem>
          </SimpleTreeView>
        </Box>
      </Popover>
    </>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [pwResetVal, setPwResetVal] = useState<string | null>(null);
  const [invoiceVal] = useState<string>(INITIAL_INVOICE);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && pwResetVal === 'integrations-monitoring-pagerduty' && invoiceVal === INITIAL_INVOICE) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, pwResetVal, invoiceVal, onSuccess]);

  return (
    <Box sx={{ p: 2, position: 'absolute', bottom: 120, right: 24, maxWidth: 700 }}>
      <Typography variant="subtitle1" gutterBottom fontWeight={600}>Alert Rules</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Chip label="Active" size="small" color="success" variant="outlined" />
        <Chip label="Filters: 3" size="small" variant="outlined" />
      </Box>
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rule</TableCell>
              <TableCell>Integration</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><Typography variant="body2" fontWeight={600}>Password reset</Typography></TableCell>
              <TableCell>
                <TreeSelectField label="Integration" value={pwResetVal} onChange={(v) => { setPwResetVal(v); setCommitted(false); }} />
              </TableCell>
              <TableCell>
                <Button size="small" variant="contained" onClick={() => setCommitted(true)}>Apply row</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography variant="body2" fontWeight={600}>Invoice failure</Typography></TableCell>
              <TableCell>
                <TreeSelectField label="Integration" value={invoiceVal} onChange={() => {}} disabled />
              </TableCell>
              <TableCell>
                <Button size="small" disabled>Apply row</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
