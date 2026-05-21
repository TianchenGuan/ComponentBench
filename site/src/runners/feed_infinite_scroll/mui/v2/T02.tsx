'use client';

/**
 * feed_infinite_scroll-mui-v2-T02
 * Billing activity card: select the right feed row, not the inbox twin
 *
 * Dashboard with three feeds: "Billing activity", "Inbox", "Tasks".
 * Dark theme, compact. Target ACT-188 in Billing activity.
 * Decoys MSG-188, TASK-188 in other feeds. Expand + "Save billing card".
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Card, CardHeader, CardContent, List, ListItemButton, ListItemText,
  Collapse, Typography, Button, CircularProgress, Chip, Box, Stack,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface FeedRow { id: string; title: string; ts: string; }

function genRows(prefix: string, titleMap: Record<number, string>, count: number): FeedRow[] {
  const out: FeedRow[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({
      id: `${prefix}-${String(i).padStart(3, '0')}`,
      title: titleMap[i] || `Item ${i}`,
      ts: `${(i * 3) % 24}h ago`,
    });
  }
  return out;
}

const BILLING_TITLES: Record<number, string> = { 1: 'Invoice created', 20: 'Payment received', 50: 'Refund issued', 100: 'Subscription renewed', 150: 'Charge failed', 188: 'Card retry scheduled', 200: 'Payout completed' };
const INBOX_TITLES: Record<number, string> = { 1: 'Welcome email', 50: 'Weekly digest', 100: 'Security alert', 188: 'Card retry scheduled', 200: 'Survey request' };
const TASK_TITLES: Record<number, string> = { 1: 'Setup onboarding', 50: 'Review PR', 100: 'Deploy staging', 188: 'Card retry scheduled', 200: 'Write tests' };

const ALL_BILLING = genRows('ACT', BILLING_TITLES, 250);
const ALL_INBOX = genRows('MSG', INBOX_TITLES, 250);
const ALL_TASKS = genRows('TASK', TASK_TITLES, 250);

const PAGE = 20;
const TARGET = 'ACT-188';

function FeedPanel({
  allItems, testId, expandedId, onExpand, label, extra,
}: {
  allItems: FeedRow[]; testId: string; label: string;
  expandedId: string | null; onExpand: (id: string | null) => void;
  extra?: React.ReactNode;
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
        }, 400);
      }
    },
    [loading, count, allItems.length],
  );

  return (
    <Card sx={{ flex: 1 }}>
      <CardHeader
        title={<Typography variant="subtitle2">{label}</Typography>}
        action={extra}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box data-testid={testId} sx={{ height: 300, overflow: 'auto' }} onScroll={handleScroll}>
          <List dense disablePadding>
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <ListItemButton
                  data-item-id={item.id}
                  selected={expandedId === item.id}
                  onClick={() => onExpand(expandedId === item.id ? null : item.id)}
                  sx={{ py: 0.25 }}
                >
                  <ListItemText
                    primary={<><strong style={{ fontSize: 12 }}>{item.id}</strong><span style={{ fontSize: 12 }}> · {item.title}</span></>}
                    secondary={item.ts}
                    primaryTypographyProps={{ fontSize: 12 }}
                    secondaryTypographyProps={{ fontSize: 10 }}
                  />
                </ListItemButton>
                <Collapse in={expandedId === item.id} timeout="auto" unmountOnExit>
                  <Box sx={{ px: 3, py: 0.5, bgcolor: 'action.hover', fontSize: 11 }}>
                    Details for {item.id}: {item.title}. Recorded at {item.ts}.
                  </Box>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
          {loading && <Box sx={{ textAlign: 'center', py: 1 }}><CircularProgress size={16} /></Box>}
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', py: 0.5 }}>
            {items.length} / {allItems.length}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [billingExp, setBillingExp] = useState<string | null>(null);
  const [inboxExp, setInboxExp] = useState<string | null>(null);
  const [tasksExp, setTasksExp] = useState<string | null>(null);
  const successRef = useRef(false);

  const handleSave = () => {
    if (billingExp === TARGET && !successRef.current) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', p: 2, minHeight: 480 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Chip label="Revenue: $42.3k" size="small" />
          <Chip label="MRR: $12.1k" size="small" />
          <Chip label="Churn: 2.1%" size="small" color="warning" />
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <FeedPanel
            allItems={ALL_BILLING}
            testId="feed-billing-activity"
            label="Billing activity"
            expandedId={billingExp}
            onExpand={setBillingExp}
            extra={
              <Button size="small" variant="contained" onClick={handleSave} data-testid="save-billing">
                Save billing card
              </Button>
            }
          />
          <FeedPanel allItems={ALL_INBOX} testId="feed-inbox" label="Inbox" expandedId={inboxExp} onExpand={setInboxExp} />
          <FeedPanel allItems={ALL_TASKS} testId="feed-tasks" label="Tasks" expandedId={tasksExp} onExpand={setTasksExp} />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
