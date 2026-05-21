'use client';

/**
 * select_custom_single-mui-v2-T09: Advanced filters dialog — set Record status to Archived and apply
 *
 * Data-management page with "Advanced filters" button. Dialog with two MUI Select controls:
 * "Record status" (Active → Archived) and "Source" (API, must stay).
 * Dialog footer: "Cancel" / "Apply filters". Read-only chips add clutter.
 *
 * Success: Record status = "Archived", Source still "API", "Apply filters" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Select, MenuItem,
  FormControl, InputLabel, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip, Divider,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import type { TaskComponentProps } from '../../types';

const statusOptions = ['Active', 'Archived', 'Pending review', 'Deleted'];
const sourceOptions = ['API', 'Manual', 'Import', 'Webhook'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recordStatus, setRecordStatus] = useState('Active');
  const [source, setSource] = useState('API');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && recordStatus === 'Archived' && source === 'API') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, recordStatus, source, onSuccess]);

  const handleApply = () => {
    setApplied(true);
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Data Management</Typography>

      <Card sx={{ maxWidth: 500, mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage and filter your data records. Use advanced filters to narrow results.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label="Total: 2,847" size="small" />
            <Chip label="Active: 1,923" size="small" variant="outlined" />
            <Chip label="Sync: OK" size="small" color="success" variant="outlined" />
          </Box>
          <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setDialogOpen(true)}>
            Advanced filters
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Record status</InputLabel>
              <Select
                value={recordStatus}
                label="Record status"
                onChange={(e) => { setRecordStatus(e.target.value); setApplied(false); }}
              >
                {statusOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Source</InputLabel>
              <Select
                value={source}
                label="Source"
                onChange={(e) => { setSource(e.target.value); setApplied(false); }}
              >
                {sourceOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>

            <Divider />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Date range: All time" size="small" variant="outlined" />
              <Chip label="Owner: Any" size="small" variant="outlined" />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>Apply filters</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
