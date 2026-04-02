'use client';

/**
 * tree_select-mui-v2-T11: Lazy-loaded geography popover with deferred children
 *
 * Modal "Choose region" with TextField + Popover + SimpleTreeView. Top levels load immediately;
 * Canada children load async after expanding Americas > Canada. Select
 * Geography/Americas/Canada/Vancouver and click "Apply region".
 *
 * Success: value = geography-americas-canada-vancouver, Apply region clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Popover, Dialog, DialogTitle,
  DialogContent, DialogActions, Card, CardContent, Chip,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../../types';

const CANADA_CHILDREN = [
  { id: 'geography-americas-canada-toronto', label: 'Toronto' },
  { id: 'geography-americas-canada-montreal', label: 'Montreal' },
  { id: 'geography-americas-canada-vancouver', label: 'Vancouver' },
  { id: 'geography-americas-canada-ottawa', label: 'Ottawa' },
];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const [canadaLoaded, setCanadaLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && value === 'geography-americas-canada-vancouver') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, value, onSuccess]);

  const handleExpandChange = useCallback((_e: React.SyntheticEvent, itemIds: string[]) => {
    if (itemIds.includes('geography-americas-canada') && !canadaLoaded && !loading) {
      setLoading(true);
      setTimeout(() => {
        setCanadaLoaded(true);
        setLoading(false);
      }, 600);
    }
  }, [canadaLoaded, loading]);

  const handleSelect = useCallback((_e: React.SyntheticEvent, itemId: string) => {
    const depth = itemId.split('-').length;
    if (depth >= 4) {
      setValue(itemId);
      setAnchorEl(null);
      setCommitted(false);
    }
  }, []);

  const handleApply = () => {
    setCommitted(true);
    setDialogOpen(false);
  };

  const display = value ? value.split('-').pop() : '';

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Region Settings</Typography>
      <Card sx={{ maxWidth: 400, mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" mb={1}>Configure your deployment region.</Typography>
          <Chip label="Current: unset" size="small" sx={{ mb: 1 }} />
          <Box><Button variant="contained" onClick={() => setDialogOpen(true)}>Choose region</Button></Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Choose Region</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>Region</Typography>
          <TextField
            size="small"
            fullWidth
            value={display}
            placeholder="Click to select"
            onClick={(e) => setAnchorEl(e.currentTarget as HTMLElement)}
            InputProps={{ readOnly: true }}
          />
          <Popover
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box sx={{ maxHeight: 300, overflow: 'auto', p: 1, minWidth: 260 }}>
              <SimpleTreeView onItemClick={handleSelect} onExpandedItemsChange={handleExpandChange}>
                <TreeItem itemId="geography" label="Geography">
                  <TreeItem itemId="geography-americas" label="Americas">
                    <TreeItem itemId="geography-americas-usa" label="USA" />
                    <TreeItem itemId="geography-americas-canada" label={loading ? 'Canada (loading...)' : 'Canada'}>
                      {canadaLoaded
                        ? CANADA_CHILDREN.map((c) => <TreeItem key={c.id} itemId={c.id} label={c.label} />)
                        : <TreeItem itemId="canada-placeholder" label="..." disabled />
                      }
                    </TreeItem>
                    <TreeItem itemId="geography-americas-brazil" label="Brazil" />
                  </TreeItem>
                  <TreeItem itemId="geography-europe" label="Europe">
                    <TreeItem itemId="geography-europe-uk" label="UK" />
                    <TreeItem itemId="geography-europe-germany" label="Germany" />
                  </TreeItem>
                  <TreeItem itemId="geography-asia" label="Asia">
                    <TreeItem itemId="geography-asia-japan" label="Japan" />
                    <TreeItem itemId="geography-asia-singapore" label="Singapore" />
                  </TreeItem>
                </TreeItem>
              </SimpleTreeView>
            </Box>
          </Popover>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>Apply region</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
