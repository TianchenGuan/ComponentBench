'use client';

/**
 * feed_infinite_scroll-mui-v2-T03
 * Orders feed search: filter, open the exact order, then save
 *
 * Settings panel layout. "Orders" card with MUI TextField search.
 * Typing refreshes the feed. Target ORD-1088 "Refund requested".
 * Open row (Collapse preview), then click "Save order choice".
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Card, CardHeader, CardContent, TextField, List, ListItemButton,
  ListItemText, Collapse, Typography, Button, CircularProgress, Box,
  Switch, FormControlLabel, Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

interface OrderRow { id: string; title: string; ts: string; }

const ALL_ORDERS: OrderRow[] = (() => {
  const titles = ['Refund requested', 'Shipped', 'Processing', 'Refund requested', 'Delivered', 'Cancelled', 'Refund requested', 'On hold', 'Returned', 'Backordered'];
  const out: OrderRow[] = [];
  for (let i = 1; i <= 1200; i++) {
    out.push({
      id: `ORD-${String(i).padStart(4, '0')}`,
      title: titles[i % titles.length],
      ts: `${(i * 5) % 48}h ago`,
    });
  }
  return out;
})();

const TARGET = 'ORD-1088';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [query, setQuery] = useState('');
  const [displayed, setDisplayed] = useState<OrderRow[]>(() => ALL_ORDERS.slice(0, 30));
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const successRef = useRef(false);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setExpandedId(null);
    if (!value.trim()) {
      setDisplayed(ALL_ORDERS.slice(0, 30));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const lower = value.toLowerCase();
      const filtered = ALL_ORDERS.filter(
        (r) => r.id.toLowerCase().includes(lower) || r.title.toLowerCase().includes(lower),
      );
      setDisplayed(filtered.slice(0, 50));
      setLoading(false);
    }, 500);
  }, []);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (query) return;
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && displayed.length < ALL_ORDERS.length) {
        setLoading(true);
        setTimeout(() => {
          setDisplayed((prev) => [...prev, ...ALL_ORDERS.slice(prev.length, prev.length + 20)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, displayed.length, query],
  );

  const handleSave = () => {
    if (expandedId === TARGET && !successRef.current) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
      <Box sx={{ width: 180 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Settings</Typography>
        <FormControlLabel control={<Switch size="small" defaultChecked />} label={<Typography variant="body2">Auto-refresh</Typography>} />
        <FormControlLabel control={<Switch size="small" />} label={<Typography variant="body2">Compact rows</Typography>} />
        <FormControlLabel control={<Switch size="small" />} label={<Typography variant="body2">Show totals</Typography>} />
      </Box>
      <Card sx={{ flex: 1, maxWidth: 520 }}>
        <CardHeader
          title={<Typography variant="subtitle1">Orders</Typography>}
          action={
            <Button size="small" variant="contained" onClick={handleSave} data-testid="save-order">
              Save order choice
            </Button>
          }
        />
        <CardContent sx={{ pt: 0 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search orders…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ mb: 1 }}
            data-testid="order-search"
          />
          <Box data-testid="feed-orders" sx={{ height: 360, overflow: 'auto' }} onScroll={handleScroll}>
            {loading && displayed.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}><CircularProgress size={24} /></Box>
            ) : (
              <List dense disablePadding>
                {displayed.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItemButton
                      data-item-id={item.id}
                      selected={expandedId === item.id}
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
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
                        Order {item.id}: {item.title}. Amount: $42.00. Status: in review.
                      </Box>
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>
            )}
            {loading && displayed.length > 0 && (
              <Box sx={{ textAlign: 'center', py: 1 }}><CircularProgress size={16} /></Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
