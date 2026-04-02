'use client';

/**
 * feed_infinite_scroll-mui-v2-T08
 * Four panes: star only the approval row in Approvals and save
 *
 * Dashboard 2x2 grid: "Alerts", "Messages", "Tasks", "Approvals".
 * Dark theme, compact, small scale. Each row has trailing "Starred" action.
 * Target APR-244 in Approvals. Click "Save approval panes".
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Card, CardHeader, List, ListItem, ListItemText,
  Typography, Button, CircularProgress, Chip, Box, IconButton,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface FeedRow { id: string; title: string; }

function genFeed(prefix: string, count: number): FeedRow[] {
  const labels = ['Status change', 'New assignment', 'Contract renewal', 'Review due', 'Escalation', 'Deadline approaching', 'Follow-up needed', 'Approval pending'];
  const out: FeedRow[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({ id: `${prefix}-${String(i).padStart(3, '0')}`, title: labels[i % labels.length] });
  }
  return out;
}

const FEEDS: { key: string; label: string; data: FeedRow[] }[] = [
  { key: 'alerts', label: 'Alerts', data: genFeed('ALT', 300) },
  { key: 'messages', label: 'Messages', data: genFeed('MSG', 300) },
  { key: 'tasks', label: 'Tasks', data: genFeed('TSK', 300) },
  { key: 'approvals', label: 'Approvals', data: genFeed('APR', 300) },
];

const PAGE = 15;
const TARGET = 'APR-244';

function CompactFeed({
  feed, testId, stars, onToggle,
}: {
  feed: FeedRow[]; testId: string;
  stars: Set<string>; onToggle: (id: string) => void;
}) {
  const [count, setCount] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const visible = feed.slice(0, count);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 80 && !loading && count < feed.length) {
        setLoading(true);
        setTimeout(() => {
          setCount((c) => Math.min(c + PAGE, feed.length));
          setLoading(false);
        }, 300);
      }
    },
    [loading, count, feed.length],
  );

  return (
    <Box data-testid={testId} sx={{ height: 200, overflow: 'auto' }} onScroll={handleScroll}>
      <List dense disablePadding>
        {visible.map((item) => (
          <ListItem
            key={item.id}
            data-item-id={item.id}
            disablePadding
            sx={{ px: 0.5, py: 0 }}
            secondaryAction={
              <IconButton
                edge="end"
                size="small"
                onClick={() => onToggle(item.id)}
                data-testid={`star-${item.id}`}
                title="Starred"
              >
                {stars.has(item.id)
                  ? <StarIcon sx={{ fontSize: 14, color: '#ffb300' }} />
                  : <StarBorderIcon sx={{ fontSize: 14, color: '#666' }} />}
              </IconButton>
            }
          >
            <ListItemText
              primary={<><strong style={{ fontSize: 11 }}>{item.id}</strong><span style={{ fontSize: 11, marginLeft: 4, color: '#aaa' }}>{item.title}</span></>}
              primaryTypographyProps={{ fontSize: 11, noWrap: true }}
              sx={{ pr: 3 }}
            />
          </ListItem>
        ))}
      </List>
      {loading && <Box sx={{ textAlign: 'center', py: 0.5 }}><CircularProgress size={12} /></Box>}
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', fontSize: 9 }}>
        {visible.length}/{feed.length}
      </Typography>
    </Box>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [stars, setStars] = useState<Record<string, Set<string>>>({
    alerts: new Set(), messages: new Set(), tasks: new Set(), approvals: new Set(),
  });
  const successRef = useRef(false);

  const toggle = (feedKey: string, id: string) => {
    setStars((prev) => {
      const next = { ...prev };
      const s = new Set(prev[feedKey]);
      s.has(id) ? s.delete(id) : s.add(id);
      next[feedKey] = s;
      return next;
    });
  };

  const handleSave = () => {
    if (successRef.current) return;
    const aprStars = stars.approvals;
    if (
      aprStars.has(TARGET) &&
      aprStars.size === 1 &&
      stars.alerts.size === 0 &&
      stars.messages.size === 0 &&
      stars.tasks.size === 0
    ) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', p: 1.5, minHeight: 480 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
          <Chip label="Dashboard" size="small" />
          <Button size="small" variant="contained" onClick={handleSave} data-testid="save-approval-panes">
            Save approval panes
          </Button>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {FEEDS.map((f) => (
            <Card key={f.key}>
              <CardHeader
                title={<Typography variant="caption" fontWeight="bold">{f.label}</Typography>}
                sx={{ pb: 0, pt: 0.5, px: 1 }}
              />
              <CompactFeed
                feed={f.data}
                testId={`feed-${f.key}`}
                stars={stars[f.key]}
                onToggle={(id) => toggle(f.key, id)}
              />
            </Card>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
