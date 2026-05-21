'use client';

/**
 * tree_select-mui-v2-T14: Drawer reference match among three escalation routes
 *
 * Drawer with three composite tree-selects: Primary, Secondary, Fallback route.
 * Reference card highlights "Ops / Platform / Database". Only Fallback changes.
 * Primary = Ops/Platform/API, Secondary = Ops/Support/Identity.
 *
 * Success: Fallback = ops-platform-database, others unchanged, "Save routes" clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Popover, Drawer, Divider, Chip, Card, CardContent,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../../types';

const LEAF_IDS = [
  'ops-platform-api', 'ops-platform-database', 'ops-platform-cache',
  'ops-support-identity', 'ops-support-billing',
  'ops-infra-networking', 'ops-infra-storage',
];

function RouteTreeSelect({
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
        placeholder="Select route"
      />
      <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ maxHeight: 300, overflow: 'auto', p: 1, minWidth: 240 }}>
          <SimpleTreeView onItemClick={handleSelect}>
            <TreeItem itemId="ops" label="Ops">
              <TreeItem itemId="ops-platform" label="Platform">
                <TreeItem itemId="ops-platform-api" label="API" />
                <TreeItem itemId="ops-platform-database" label="Database" />
                <TreeItem itemId="ops-platform-cache" label="Cache" />
              </TreeItem>
              <TreeItem itemId="ops-support" label="Support">
                <TreeItem itemId="ops-support-identity" label="Identity" />
                <TreeItem itemId="ops-support-billing" label="Billing" />
              </TreeItem>
              <TreeItem itemId="ops-infra" label="Infra">
                <TreeItem itemId="ops-infra-networking" label="Networking" />
                <TreeItem itemId="ops-infra-storage" label="Storage" />
              </TreeItem>
            </TreeItem>
          </SimpleTreeView>
        </Box>
      </Popover>
    </>
  );
}

export default function T14({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [primary] = useState('ops-platform-api');
  const [secondary] = useState('ops-support-identity');
  const [fallback, setFallback] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      fallback === 'ops-platform-database' &&
      primary === 'ops-platform-api' &&
      secondary === 'ops-support-identity'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, fallback, primary, secondary, onSuccess]);

  const handleSave = () => {
    setCommitted(true);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Escalation Setup</Typography>
      <Card sx={{ maxWidth: 400, mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Configure escalation routes for incident response.
          </Typography>
          <Chip label="Ref: Ops / Platform / Database" color="info" size="small" sx={{ mb: 1 }} />
          <Box><Button variant="contained" onClick={() => setDrawerOpen(true)}>Edit escalation routes</Button></Box>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 380, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" gutterBottom>Escalation Routes</Typography>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <RouteTreeSelect label="Primary route" value={primary} onChange={() => {}} disabled />
            <RouteTreeSelect label="Secondary route" value={secondary} onChange={() => {}} disabled />
            <RouteTreeSelect label="Fallback route" value={fallback} onChange={(v) => { setFallback(v); setCommitted(false); }} />
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save routes</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
