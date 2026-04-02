'use client';

/**
 * tree_view-mui-v2-T06: Audit tree — scroll to offscreen archive leaf and apply
 *
 * Nested scroll, dark, high clutter. Split panel: "Active branches" (left, distractor),
 * "Archive branches" (right, target in scroll container). Right tree: Archived releases (expanded),
 * Release 01..60. Release 01 selected by default. Release 52 offscreen.
 * Success: selected = archive/release_52 in target tree, Active branches unchanged,
 *          "Apply branch" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Typography, Button, Box, Stack, Card, CardContent, Paper,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../../types';

function pad(n: number): string { return String(n).padStart(2, '0'); }

export default function T06({ onSuccess }: TaskComponentProps) {
  const [activeSelected, setActiveSelected] = useState<string | null>('active/main');
  const [archiveSelected, setArchiveSelected] = useState<string | null>('archive/release_01');
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && archiveSelected === 'archive/release_52') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, archiveSelected, onSuccess]);

  return (
    <Box sx={{ p: 2, maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>Branch Manager</Typography>

      <Paper variant="outlined" sx={{ p: 1.5, mb: 2, textAlign: 'center' }}>
        <Typography color="text.secondary" variant="body2">Activity chart placeholder</Typography>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Active branches</Typography>
            <SimpleTreeView
              selectedItems={activeSelected}
              onSelectedItemsChange={(_e, id) => setActiveSelected(id)}
              defaultExpandedItems={['active']}
            >
              <TreeItem itemId="active" label="Active">
                <TreeItem itemId="active/main" label="main" />
                <TreeItem itemId="active/develop" label="develop" />
                <TreeItem itemId="active/staging" label="staging" />
              </TreeItem>
            </SimpleTreeView>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Archive branches</Typography>
            <Box sx={{ maxHeight: 280, overflow: 'auto' }} data-testid="tree-scroll">
              <SimpleTreeView
                selectedItems={archiveSelected}
                onSelectedItemsChange={(_e, id) => { setArchiveSelected(id); setCommitted(false); }}
                defaultExpandedItems={['archive']}
                data-testid="tree-root"
              >
                <TreeItem itemId="archive" label="Archived releases">
                  {Array.from({ length: 60 }, (_, i) => {
                    const num = pad(i + 1);
                    return <TreeItem key={num} itemId={`archive/release_${num}`} label={`Release ${num}`} />;
                  })}
                </TreeItem>
              </SimpleTreeView>
            </Box>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button variant="contained" size="small" onClick={() => setCommitted(true)}>
                Apply branch
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
