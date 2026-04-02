'use client';

/**
 * feed_infinite_scroll-mui-v2-T04
 * Review queue: exact four-case selection and apply
 *
 * Dashboard with "Review queue" and "Escalations". Dark theme, checkbox rows.
 * Select exactly CASE-021, CASE-024, CASE-027, CASE-031 in Review queue.
 * Click "Apply queue selection".
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Card, CardHeader, CardContent, List, ListItem, ListItemText,
  Checkbox, Typography, Button, CircularProgress, Chip, Box, Stack,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface QueueRow { id: string; title: string; }

function genQueue(prefix: string, count: number): QueueRow[] {
  const labels = ['Needs review', 'Pending approval', 'Awaiting response', 'Escalated', 'In progress', 'Deferred', 'Reopened', 'Blocked'];
  const out: QueueRow[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({ id: `${prefix}-${String(i).padStart(3, '0')}`, title: labels[i % labels.length] });
  }
  return out;
}

const ALL_REVIEW = genQueue('CASE', 200);
const ALL_ESCALATIONS = genQueue('ESC', 200);
const PAGE = 20;
const TARGET_IDS = new Set(['CASE-021', 'CASE-024', 'CASE-027', 'CASE-031']);

function CheckboxFeed({
  allItems, testId, checked, onToggle,
}: {
  allItems: QueueRow[]; testId: string;
  checked: Set<string>; onToggle: (id: string) => void;
}) {
  const [count, setCount] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const items = allItems.slice(0, count);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && count < allItems.length) {
        setLoading(true);
        setTimeout(() => {
          setCount((c) => Math.min(c + PAGE, allItems.length));
          setLoading(false);
        }, 350);
      }
    },
    [loading, count, allItems.length],
  );

  return (
    <Box data-testid={testId} sx={{ height: 280, overflow: 'auto' }} onScroll={handleScroll}>
      <List dense disablePadding>
        {items.map((item) => (
          <ListItem key={item.id} data-item-id={item.id} disablePadding sx={{ px: 1 }}>
            <Checkbox
              size="small"
              checked={checked.has(item.id)}
              onChange={() => onToggle(item.id)}
            />
            <ListItemText
              primary={<><strong style={{ fontSize: 12 }}>{item.id}</strong><span style={{ fontSize: 11, marginLeft: 6, color: '#aaa' }}>{item.title}</span></>}
              primaryTypographyProps={{ fontSize: 12 }}
            />
          </ListItem>
        ))}
      </List>
      {loading && <Box sx={{ textAlign: 'center', py: 0.5 }}><CircularProgress size={14} /></Box>}
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', py: 0.5 }}>
        {items.length} / {allItems.length}
      </Typography>
    </Box>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [reviewChecked, setReviewChecked] = useState<Set<string>>(new Set());
  const [escChecked, setEscChecked] = useState<Set<string>>(new Set());
  const successRef = useRef(false);

  const toggleReview = (id: string) => {
    setReviewChecked((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };
  const toggleEsc = (id: string) => {
    setEscChecked((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const handleApply = () => {
    if (successRef.current) return;
    if (reviewChecked.size === TARGET_IDS.size && Array.from(TARGET_IDS).every((id) => reviewChecked.has(id))) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', p: 2, minHeight: 440, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip label="Open: 38" size="small" />
          <Chip label="Critical: 5" size="small" color="error" />
        </Stack>
        <Card sx={{ width: 420, mb: 1.5 }}>
          <CardHeader
            title={<Typography variant="subtitle2">Review queue</Typography>}
            action={
              <Button size="small" variant="contained" onClick={handleApply} data-testid="apply-review">
                Apply queue selection
              </Button>
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <CheckboxFeed allItems={ALL_REVIEW} testId="feed-review-queue" checked={reviewChecked} onToggle={toggleReview} />
            <Typography variant="caption" sx={{ px: 1, display: 'block' }}>
              Pending: {reviewChecked.size} selected
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: 420 }}>
          <CardHeader title={<Typography variant="subtitle2">Escalations</Typography>} sx={{ pb: 0 }} />
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <CheckboxFeed allItems={ALL_ESCALATIONS} testId="feed-escalations" checked={escChecked} onToggle={toggleEsc} />
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
