'use client';

/**
 * tree_select-mui-v2-T15: Scrollable final leaf in nested-scroll service selector
 *
 * Nested-scroll layout. TextField + Popover + SimpleTreeView with scrollable tree.
 * Services/Compute/Jobs has many siblings; "Retry Queue" is near the bottom.
 * Click "Apply service" to commit.
 *
 * Success: value = services-compute-jobs-retry-queue, Apply service clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Popover, Card, CardContent, Chip,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../../types';

const LEAF_IDS = [
  'services-compute-jobs-scheduler', 'services-compute-jobs-worker',
  'services-compute-jobs-dispatcher', 'services-compute-jobs-monitor',
  'services-compute-jobs-dead-letter', 'services-compute-jobs-retry-queue',
  'services-compute-jobs-archiver', 'services-compute-jobs-priority-queue',
  'services-compute-functions-lambda', 'services-compute-functions-edge',
  'services-storage-s3', 'services-storage-gcs',
];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && value === 'services-compute-jobs-retry-queue') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, value, onSuccess]);

  const handleSelect = useCallback((_e: React.SyntheticEvent, itemId: string) => {
    if (LEAF_IDS.includes(itemId)) {
      setValue(itemId);
      setAnchorEl(null);
      setCommitted(false);
    }
  }, []);

  const display = value ? value.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' / ') : '';

  return (
    <div style={{ height: '150vh', padding: 16 }}>
      <Box sx={{ maxWidth: 420, position: 'absolute', bottom: 60, left: 40 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Service Settings</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip label="Env: prod" size="small" />
          <Chip label="Region: us-east" size="small" variant="outlined" />
        </Box>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>Service</Typography>
            <TextField
              size="small" fullWidth value={display} placeholder="Click to select"
              onClick={(e) => setAnchorEl(e.currentTarget as HTMLElement)}
              InputProps={{ readOnly: true }} sx={{ mb: 2 }}
            />
            <Popover
              open={!!anchorEl} anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <Box sx={{ maxHeight: 240, overflow: 'auto', p: 1, minWidth: 280 }}>
                <SimpleTreeView onItemClick={handleSelect}>
                  <TreeItem itemId="services" label="Services">
                    <TreeItem itemId="services-compute" label="Compute">
                      <TreeItem itemId="services-compute-jobs" label="Jobs">
                        <TreeItem itemId="services-compute-jobs-scheduler" label="Scheduler" />
                        <TreeItem itemId="services-compute-jobs-worker" label="Worker" />
                        <TreeItem itemId="services-compute-jobs-dispatcher" label="Dispatcher" />
                        <TreeItem itemId="services-compute-jobs-monitor" label="Monitor" />
                        <TreeItem itemId="services-compute-jobs-dead-letter" label="Dead Letter" />
                        <TreeItem itemId="services-compute-jobs-retry-queue" label="Retry Queue" />
                        <TreeItem itemId="services-compute-jobs-archiver" label="Archiver" />
                        <TreeItem itemId="services-compute-jobs-priority-queue" label="Priority Queue" />
                      </TreeItem>
                      <TreeItem itemId="services-compute-functions" label="Functions">
                        <TreeItem itemId="services-compute-functions-lambda" label="Lambda" />
                        <TreeItem itemId="services-compute-functions-edge" label="Edge" />
                      </TreeItem>
                    </TreeItem>
                    <TreeItem itemId="services-storage" label="Storage">
                      <TreeItem itemId="services-storage-s3" label="S3" />
                      <TreeItem itemId="services-storage-gcs" label="GCS" />
                    </TreeItem>
                  </TreeItem>
                </SimpleTreeView>
              </Box>
            </Popover>
            <Button variant="contained" size="small" onClick={() => setCommitted(true)}>Apply service</Button>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
