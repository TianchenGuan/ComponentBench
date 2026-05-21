'use client';

/**
 * feed_infinite_scroll-mui-v2-T01
 * Inbox drawer: reveal the target message, expand it, and apply
 *
 * Drawer flow, compact spacing. "Open inbox" button -> MUI temporary Drawer.
 * Feed of ListItemButton rows with inline Collapse previews and on-scroll loading.
 * Target MSG-142 "Contract revision requested". Click "Use selected message".
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Card, CardContent, CardHeader, Button, Drawer, List, ListItemButton,
  ListItemText, Collapse, Typography, CircularProgress, Chip, Box,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import type { TaskComponentProps } from '../../types';

interface MsgRow { id: string; title: string; ts: string; preview: string; }

const MSG_TITLES: Record<number, string> = {
  1: 'Weekly sync notes', 10: 'Budget approval request', 20: 'Team standup recap',
  30: 'Vendor contract draft', 50: 'Product roadmap update', 80: 'Security alert',
  100: 'Design review feedback', 120: 'Sprint retrospective', 142: 'Contract revision requested',
  160: 'Compliance update', 180: 'Quarterly earnings brief',
};

function genMessages(start: number, count: number): MsgRow[] {
  const out: MsgRow[] = [];
  for (let i = start; i < start + count; i++) {
    out.push({
      id: `MSG-${String(i).padStart(3, '0')}`,
      title: MSG_TITLES[i] || `Message ${i}`,
      ts: `${(i * 3) % 24}h ago`,
      preview: `Preview for MSG-${String(i).padStart(3, '0')}: This message contains details about ${MSG_TITLES[i] || 'a topic'} that require your attention.`,
    });
  }
  return out;
}

const TOTAL = 180;
const PAGE = 20;
const TARGET = 'MSG-142';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState<MsgRow[]>(() => genMessages(1, PAGE));
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const successRef = useRef(false);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && items.length < TOTAL) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => [...prev, ...genMessages(prev.length + 1, PAGE)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, items.length],
  );

  const handleUse = () => {
    if (expandedId === TARGET && !successRef.current) {
      successRef.current = true;
      setDrawerOpen(false);
      onSuccess();
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3 }}>
      <Card sx={{ width: 380 }}>
        <CardHeader
          avatar={<MailOutlineIcon />}
          title="Mail summary"
          subheader="3 unread messages"
        />
        <CardContent>
          <Chip label="Inbox: 142" size="small" sx={{ mr: 1 }} />
          <Chip label="Drafts: 5" size="small" />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => setDrawerOpen(true)}>
              Open inbox
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 460, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Inbox</Typography>
            <Button
              variant="contained"
              size="small"
              disabled={!expandedId}
              onClick={handleUse}
              data-testid="use-selected-message"
            >
              Use selected message
            </Button>
          </Box>
          <Typography variant="caption" sx={{ px: 2, py: 0.5, color: 'text.secondary' }}>
            Loaded {items.length} / {TOTAL}
          </Typography>
          <Box
            data-testid="feed-inbox"
            sx={{ flex: 1, overflow: 'auto' }}
            onScroll={handleScroll}
          >
            <List dense disablePadding>
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItemButton
                    data-item-id={item.id}
                    selected={expandedId === item.id}
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    sx={{ py: 0.5 }}
                  >
                    <ListItemText
                      primary={
                        <span>
                          <strong style={{ fontSize: 13 }}>{item.id}</strong>
                          <span style={{ fontSize: 13 }}> · {item.title}</span>
                        </span>
                      }
                      secondary={item.ts}
                    />
                  </ListItemButton>
                  <Collapse in={expandedId === item.id} timeout="auto" unmountOnExit>
                    <Box sx={{ px: 3, py: 1, bgcolor: 'action.hover', fontSize: 12 }}>
                      {item.preview}
                    </Box>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
            {loading && (
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
