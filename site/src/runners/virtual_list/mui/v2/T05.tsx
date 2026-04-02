'use client';

/**
 * virtual_list-mui-v2-T05
 * Case review pane: find the row inside nested scroll and enable Review
 *
 * Nested scroll layout. Page scrolls; the inner "Cases awaiting review" list has
 * its own viewport with per-row Review switches. Agent must toggle CASE-318 on
 * and click "Save review flags".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardHeader, CardContent, Typography, Button, Box, Switch, Stack,
  ListItem, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../../types';

interface CaseItem { key: string; code: string; label: string; }

const caseLabels = [
  'Session replay', 'API timeout', 'Login loop', 'Data mismatch', 'Payment failure',
  'Export hang', 'Search drift', 'Cache miss', 'Rate spike', 'Schema conflict',
];

function buildCases(): CaseItem[] {
  return Array.from({ length: 500 }, (_, i) => ({
    key: `case-${i}`,
    code: `CASE-${i}`,
    label: caseLabels[i % caseLabels.length],
  }));
}

const cases = buildCases();

export default function T05({ onSuccess }: TaskComponentProps) {
  const [reviews, setReviews] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (saved && reviews.has('case-318')) { successRef.current = true; onSuccess(); }
  }, [saved, reviews, onSuccess]);

  const toggleReview = (key: string) => {
    setReviews(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setSaved(false);
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = cases[index];
    return (
      <ListItem style={style} secondaryAction={
        <Switch edge="end" size="small" checked={reviews.has(item.key)} onChange={() => toggleReview(item.key)} />
      } data-item-key={item.key}>
        <ListItemText primary={`${item.code} — ${item.label}`} primaryTypographyProps={{ fontSize: 13 }} />
      </ListItem>
    );
  };

  return (
    <Box sx={{ height: 600, overflow: 'auto', p: 2 }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2">Summary</Typography>
        <Typography variant="body2" color="text.secondary">
          500 cases pending triage across 12 teams. Last updated 3 min ago.
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Notes: Review escalation policy updated for Q3. All critical cases auto-flagged.
        </Typography>
      </Paper>

      <Card data-testid="cases-card">
        <CardHeader title="Cases awaiting review" titleTypographyProps={{ variant: 'subtitle2' }}
          sx={{ pb: 0 }} />
        <CardContent>
          <Paper variant="outlined">
            <FixedSizeList height={300} width="100%" itemSize={48} itemCount={cases.length} overscanCount={5}>
              {Row}
            </FixedSizeList>
          </Paper>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Flagged: {reviews.size}
            </Typography>
            <Button size="small" variant="contained" onClick={() => setSaved(true)}>
              Save review flags
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ height: 400 }} />
    </Box>
  );
}
