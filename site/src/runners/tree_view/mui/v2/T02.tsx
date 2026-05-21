'use client';

/**
 * tree_view-mui-v2-T02: Rename only the right Draft node and save label changes
 *
 * Settings panel, dark theme, two side-by-side trees.
 * Left: "Feature branches" — Main, Draft, Sandbox. Right: "Release branches" — Stable, Draft[target], Candidate.
 * Label editing enabled. "Save labels" commits both trees.
 * Success: release/draft label = "Draft (archived)", feature/draft label still "Draft", "Save labels" clicked.
 *
 * Note: RichTreeViewPro isItemEditable requires MUI X Pro. We simulate with inline editable text.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box, Stack, TextField } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../../types';

interface BranchNode { id: string; label: string; }

const featureBranches: BranchNode[] = [
  { id: 'feature/main', label: 'Main' },
  { id: 'feature/draft', label: 'Draft' },
  { id: 'feature/sandbox', label: 'Sandbox' },
];

const initialReleaseBranches: BranchNode[] = [
  { id: 'release/stable', label: 'Stable' },
  { id: 'release/draft', label: 'Draft' },
  { id: 'release/candidate', label: 'Candidate' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [releaseLabels, setReleaseLabels] = useState<Record<string, string>>(
    Object.fromEntries(initialReleaseBranches.map((b) => [b.id, b.label])),
  );
  const [featureLabels] = useState<Record<string, string>>(
    Object.fromEntries(featureBranches.map((b) => [b.id, b.label])),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      releaseLabels['release/draft'] === 'Draft (archived)' &&
      featureLabels['feature/draft'] === 'Draft'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, releaseLabels, featureLabels, onSuccess]);

  const startEdit = (id: string, currentLabel: string) => {
    setEditingId(id);
    setEditValue(currentLabel);
  };

  const commitEdit = () => {
    if (editingId) {
      setReleaseLabels((prev) => ({ ...prev, [editingId]: editValue }));
      setEditingId(null);
      setCommitted(false);
    }
  };

  const renderLabel = (id: string, label: string, editable: boolean) => {
    if (editable && editingId === id) {
      return (
        <TextField
          size="small"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') commitEdit(); }}
          onKeyUp={(e) => e.stopPropagation()}
          autoFocus
          variant="standard"
          sx={{ fontSize: 14 }}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
        />
      );
    }
    return (
      <span onDoubleClick={editable ? (e) => { e.stopPropagation(); startEdit(id, label); } : undefined}>
        {label}
      </span>
    );
  };

  return (
    <Box sx={{ p: 2, maxWidth: 640 }}>
      <Typography variant="h5" gutterBottom>Branch Settings</Typography>

      <Stack direction="row" spacing={2}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Feature branches</Typography>
            <SimpleTreeView>
              {featureBranches.map((b) => (
                <TreeItem key={b.id} itemId={b.id}
                  label={renderLabel(b.id, featureLabels[b.id], false)}
                />
              ))}
            </SimpleTreeView>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Release branches</Typography>
            <SimpleTreeView data-testid="tree-root">
              {initialReleaseBranches.map((b) => (
                <TreeItem key={b.id} itemId={b.id}
                  label={renderLabel(b.id, releaseLabels[b.id], true)}
                />
              ))}
            </SimpleTreeView>
          </CardContent>
        </Card>
      </Stack>

      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Button variant="contained" size="small" onClick={() => setCommitted(true)}>
          Save labels
        </Button>
      </Box>
    </Box>
  );
}
