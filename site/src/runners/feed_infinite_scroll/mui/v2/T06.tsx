'use client';

/**
 * feed_infinite_scroll-mui-v2-T06
 * Activity feed: visibility-gated reveal in nested left pane
 *
 * Nested scroll layout, bottom_left placement, high clutter.
 * Page has metric cards and a notes column with page scroll.
 * Left pane has "Activity" feed (MUI List, on-scroll loading).
 * Target ACT-184 must be truly visible (min_visible_ratio 0.5).
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Card, CardHeader, CardContent, List, ListItem, ListItemText,
  Typography, CircularProgress, Chip, Box, Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

interface ActRow { id: string; title: string; ts: string; }

const ACT_TITLES: Record<number, string> = {
  1: 'User login', 10: 'File uploaded', 20: 'Comment added', 30: 'Config changed',
  50: 'Deploy triggered', 80: 'Alert resolved', 100: 'Backup completed',
  120: 'Cert renewed', 140: 'Cache cleared', 160: 'Index rebuilt',
  184: 'Cache refresh complete', 200: 'Maintenance window closed', 220: 'Audit exported',
};

function genActivity(start: number, count: number): ActRow[] {
  const out: ActRow[] = [];
  for (let i = start; i < start + count; i++) {
    out.push({
      id: `ACT-${String(i).padStart(3, '0')}`,
      title: ACT_TITLES[i] || `Activity ${i}`,
      ts: `${i * 2}s ago`,
    });
  }
  return out;
}

const TOTAL = 220;
const PAGE = 20;
const TARGET = 'ACT-184';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<ActRow[]>(() => genActivity(1, PAGE));
  const [loading, setLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const successRef = useRef(false);

  const checkVisibility = useCallback(() => {
    if (successRef.current || !feedRef.current) return;
    const el = feedRef.current.querySelector(`[data-item-id="${TARGET}"]`);
    if (!el) return;
    const cRect = feedRef.current.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    const visTop = Math.max(cRect.top, tRect.top);
    const visBot = Math.min(cRect.bottom, tRect.bottom);
    const ratio = Math.max(0, visBot - visTop) / tRect.height;
    if (ratio >= 0.5) {
      successRef.current = true;
      onSuccess();
    }
  }, [onSuccess]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      checkVisibility();
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && items.length < TOTAL) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => [...prev, ...genActivity(prev.length + 1, PAGE)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, items.length, checkVisibility],
  );

  useEffect(() => { checkVisibility(); }, [items, checkVisibility]);

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, minHeight: 500 }}>
      <Box sx={{ width: 380, flexShrink: 0 }}>
        <Card>
          <CardHeader title={<Typography variant="subtitle2">Activity</Typography>} sx={{ pb: 0 }} />
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <Box
              ref={feedRef}
              data-testid="feed-activity"
              sx={{ height: 380, overflow: 'auto' }}
              onScroll={handleScroll}
            >
              <List dense disablePadding>
                {items.map((item) => (
                  <ListItem key={item.id} data-item-id={item.id} sx={{ py: 0.25, px: 1.5 }}>
                    <ListItemText
                      primary={<><strong style={{ fontSize: 12 }}>{item.id}</strong><span style={{ fontSize: 12 }}> · {item.title}</span></>}
                      secondary={item.ts}
                      primaryTypographyProps={{ fontSize: 12 }}
                      secondaryTypographyProps={{ fontSize: 10 }}
                    />
                  </ListItem>
                ))}
              </List>
              {loading && <Box sx={{ textAlign: 'center', py: 1 }}><CircularProgress size={16} /></Box>}
            </Box>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', py: 0.5, borderTop: '1px solid', borderColor: 'divider' }}>
              Loaded {items.length} / {TOTAL}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: 1, maxHeight: 500, overflow: 'auto' }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1}>
            <Chip label="CPU: 42%" size="small" /><Chip label="Mem: 68%" size="small" /><Chip label="Disk: 54%" size="small" />
          </Stack>
          <Card>
            <CardHeader title={<Typography variant="subtitle2">Notes</Typography>} sx={{ pb: 0 }} />
            <CardContent>
              {Array.from({ length: 20 }, (_, i) => (
                <Typography key={i} variant="body2" sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>
                  Note {i + 1}: System metric update recorded. All thresholds within normal range.
                  Performance baseline stable across all monitored endpoints.
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
