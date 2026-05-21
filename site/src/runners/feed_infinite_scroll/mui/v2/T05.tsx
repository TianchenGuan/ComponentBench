'use client';

/**
 * feed_infinite_scroll-mui-v2-T05
 * Dark chats feed: reference avatar and unread marker match
 *
 * Inline surface, dark theme. "Reference chat" card above "Chats" feed.
 * ListItemButton rows with avatar, unread dot, title. The target row matches
 * the reference card (color, unread dot, initial letter). Click "Use chat".
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Card, CardContent, List, ListItemButton, ListItemText,
  ListItemAvatar, Avatar, Typography, Button, CircularProgress,
  Box, Badge,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const AVATAR_COLORS = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#4caf50'];
const REFERENCE_COLOR_IDX = 3;
const REFERENCE_UNREAD = true;
/** Must match the reference Avatar child so the target row is visually aligned. */
const REFERENCE_INITIAL = 'R';

interface ChatRow { id: string; title: string; colorIdx: number; unread: boolean; initial: string; }

function genChats(count: number): ChatRow[] {
  const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank'];
  const out: ChatRow[] = [];
  for (let i = 1; i <= count; i++) {
    const name = names[i % names.length];
    out.push({
      id: `CHAT-${String(i).padStart(3, '0')}`,
      title: `${name} — ${i % 3 === 0 ? 'Project update' : i % 3 === 1 ? 'Quick question' : 'File shared'}`,
      colorIdx: i === 34 ? REFERENCE_COLOR_IDX : (i * 2 + i) % AVATAR_COLORS.length,
      unread: i === 34 ? REFERENCE_UNREAD : i % 5 === 0,
      initial: i === 34 ? REFERENCE_INITIAL : name[0],
    });
  }
  return out;
}

const ALL_CHATS = genChats(200);
const PAGE = 20;
const TARGET = 'CHAT-034';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<ChatRow[]>(() => ALL_CHATS.slice(0, PAGE));
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successRef = useRef(false);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && items.length < ALL_CHATS.length) {
        setLoading(true);
        setTimeout(() => {
          setItems(ALL_CHATS.slice(0, items.length + PAGE));
          setLoading(false);
        }, 350);
      }
    },
    [loading, items.length],
  );

  const handleUse = () => {
    if (activeId === TARGET && !successRef.current) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', p: 2, minHeight: 480 }}>
        <Card sx={{ width: 140, mb: 1.5, textAlign: 'center' }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Badge variant="dot" color="error" invisible={!REFERENCE_UNREAD}>
              <Avatar sx={{ bgcolor: AVATAR_COLORS[REFERENCE_COLOR_IDX], width: 36, height: 36, mx: 'auto' }}>
                {REFERENCE_INITIAL}
              </Avatar>
            </Badge>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>Reference chat</Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: 420 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1.5 }}>
            <Typography variant="subtitle2">Chats</Typography>
            <Button size="small" variant="contained" onClick={handleUse} data-testid="use-chat">
              Use chat
            </Button>
          </Box>
          <Box data-testid="feed-chats" sx={{ height: 340, overflow: 'auto' }} onScroll={handleScroll}>
            <List dense disablePadding>
              {items.map((item) => (
                <ListItemButton
                  key={item.id}
                  data-item-id={item.id}
                  selected={activeId === item.id}
                  onClick={() => setActiveId(item.id)}
                  sx={{ py: 0.25 }}
                >
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Badge variant="dot" color="error" invisible={!item.unread}>
                      <Avatar sx={{ bgcolor: AVATAR_COLORS[item.colorIdx], width: 28, height: 28, fontSize: 13 }}>
                        {item.initial}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<><strong style={{ fontSize: 12 }}>{item.id}</strong><span style={{ fontSize: 12, marginLeft: 4 }}>{item.title}</span></>}
                    primaryTypographyProps={{ fontSize: 12, noWrap: true }}
                  />
                </ListItemButton>
              ))}
            </List>
            {loading && <Box sx={{ textAlign: 'center', py: 1 }}><CircularProgress size={16} /></Box>}
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
