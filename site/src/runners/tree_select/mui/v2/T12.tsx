'use client';

/**
 * tree_select-mui-v2-T12: Search ambiguous Archive result and preserve sibling selector
 *
 * Dark dashboard panel. Two composite tree-selects: "Destination" (empty, target) and
 * "Fallback destination" (prefilled Templates/Archive). Popover has search input + SimpleTreeView.
 * Multiple "Archive" leaves exist. Select Projects/Alpha/Archive, click "Apply move".
 *
 * Success: Destination = projects-alpha-archive, Fallback unchanged, Apply move clicked.
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Popover, Card, CardContent,
  Chip, ThemeProvider, createTheme,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface TreeNode { id: string; label: string; children?: TreeNode[] }

const fullTree: TreeNode[] = [
  {
    id: 'projects', label: 'Projects', children: [
      { id: 'projects-alpha', label: 'Alpha', children: [
        { id: 'projects-alpha-archive', label: 'Archive' },
        { id: 'projects-alpha-active', label: 'Active' },
      ]},
      { id: 'projects-beta', label: 'Beta', children: [
        { id: 'projects-beta-archive', label: 'Archive' },
        { id: 'projects-beta-active', label: 'Active' },
      ]},
      { id: 'projects-gamma', label: 'Gamma', children: [
        { id: 'projects-gamma-archive', label: 'Archive' },
      ]},
    ],
  },
  {
    id: 'templates', label: 'Templates', children: [
      { id: 'templates-archive', label: 'Archive' },
      { id: 'templates-drafts', label: 'Drafts' },
    ],
  },
];

const LEAF_IDS = [
  'projects-alpha-archive', 'projects-alpha-active', 'projects-beta-archive',
  'projects-beta-active', 'projects-gamma-archive', 'templates-archive', 'templates-drafts',
];

function matchesFilter(node: TreeNode, q: string): boolean {
  if (node.label.toLowerCase().includes(q)) return true;
  return !!node.children?.some((c) => matchesFilter(c, q));
}

function filterTree(nodes: TreeNode[], q: string): TreeNode[] {
  if (!q) return nodes;
  return nodes.reduce<TreeNode[]>((acc, node) => {
    if (matchesFilter(node, q)) {
      acc.push({ ...node, children: node.children ? filterTree(node.children, q) : undefined });
    }
    return acc;
  }, []);
}

function renderTree(nodes: TreeNode[]) {
  return nodes.map((n) => (
    <TreeItem key={n.id} itemId={n.id} label={n.label}>
      {n.children ? renderTree(n.children) : null}
    </TreeItem>
  ));
}

function SearchableTreeSelect({
  label, value, onChange, disabled,
}: {
  label: string; value: string | null; onChange: (v: string) => void; disabled?: boolean;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => filterTree(fullTree, query.toLowerCase()), [query]);

  const handleSelect = useCallback((_e: React.SyntheticEvent, itemId: string) => {
    if (LEAF_IDS.includes(itemId)) {
      onChange(itemId);
      setAnchorEl(null);
      setQuery('');
    }
  }, [onChange]);

  const display = value ? value.split('-').slice(0, -1).map((s) => s[0].toUpperCase() + s.slice(1)).join(' / ') + ' / ' + value.split('-').pop()!.charAt(0).toUpperCase() + value.split('-').pop()!.slice(1) : '';

  return (
    <>
      <TextField
        size="small" fullWidth label={label} value={display}
        onClick={(e) => !disabled && setAnchorEl(e.currentTarget as HTMLElement)}
        InputProps={{ readOnly: true }} disabled={disabled}
      />
      <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={() => { setAnchorEl(null); setQuery(''); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ p: 1, minWidth: 280 }}>
          <TextField size="small" fullWidth placeholder="Search..." value={query}
            onChange={(e) => setQuery(e.target.value)} autoFocus sx={{ mb: 1 }} />
          <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
            <SimpleTreeView onItemClick={handleSelect} defaultExpandedItems={query ? filtered.map((n) => n.id) : []}>
              {renderTree(filtered)}
            </SimpleTreeView>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

const FALLBACK_INIT = 'templates-archive';

export default function T12({ onSuccess }: TaskComponentProps) {
  const [destination, setDestination] = useState<string | null>(null);
  const [fallback] = useState<string>(FALLBACK_INIT);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && destination === 'projects-alpha-archive' && fallback === FALLBACK_INIT) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, destination, fallback, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 2, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Typography variant="h6" gutterBottom color="text.primary">Content Manager</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label="Items: 847" size="small" />
          <Chip label="Sync: OK" size="small" color="success" variant="outlined" />
        </Box>
        <Card sx={{ maxWidth: 460, ml: 0 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>Move Content</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <SearchableTreeSelect label="Destination" value={destination} onChange={(v) => { setDestination(v); setCommitted(false); }} />
              <SearchableTreeSelect label="Fallback destination" value={fallback} onChange={() => {}} disabled />
              <Button variant="contained" onClick={() => setCommitted(true)}>Apply move</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
