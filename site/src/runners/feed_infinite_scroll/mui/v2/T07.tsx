'use client';

/**
 * feed_infinite_scroll-mui-v2-T07
 * Incident feed: open the target row and save the decision
 *
 * Settings panel, compact, off-center. "Incidents" card with ListItemButton
 * rows and Collapse previews. Target INC-063. Click "Save incident decision".
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Card, CardHeader, CardContent, List, ListItemButton, ListItemText,
  Collapse, Typography, Button, CircularProgress, Box, Switch,
  FormControlLabel, Chip, Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

interface IncRow { id: string; title: string; ts: string; }

const INC_TITLES: Record<number, string> = {
  1: 'Service degraded', 10: 'Memory leak detected', 20: 'Latency spike',
  30: 'Error rate increase', 40: 'Database connection pool full',
  50: 'CDN cache miss storm', 63: 'Rollback requested', 70: 'Partial outage',
  80: 'Recovery initiated', 90: 'All-clear issued',
};

function genIncidents(start: number, count: number): IncRow[] {
  const out: IncRow[] = [];
  for (let i = start; i < start + count; i++) {
    out.push({
      id: `INC-${String(i).padStart(3, '0')}`,
      title: INC_TITLES[i] || `Incident ${i}`,
      ts: `${(i * 4) % 60}m ago`,
    });
  }
  return out;
}

const TOTAL = 120;
const PAGE = 15;
const TARGET = 'INC-063';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<IncRow[]>(() => genIncidents(1, PAGE));
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const successRef = useRef(false);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && items.length < TOTAL) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => [...prev, ...genIncidents(prev.length + 1, PAGE)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, items.length],
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
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Controls</Typography>
        <FormControlLabel control={<Switch size="small" defaultChecked />} label={<Typography variant="body2">Auto-refresh</Typography>} />
        <FormControlLabel control={<Switch size="small" />} label={<Typography variant="body2">Sound alerts</Typography>} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Status</Typography>
        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
          <Chip label="P1: 0" size="small" color="success" /><Chip label="P2: 3" size="small" color="warning" />
        </Stack>
      </Box>
      <Card sx={{ flex: 1, maxWidth: 480 }}>
        <CardHeader
          title={<Typography variant="subtitle1">Incidents</Typography>}
          action={
            <Button size="small" variant="contained" onClick={handleSave} data-testid="save-incident">
              Save incident decision
            </Button>
          }
          sx={{ pb: 0 }}
        />
        {expandedId && (
          <Box sx={{ px: 2 }}>
            <Chip label={`Selected: ${expandedId}`} size="small" color="info" />
          </Box>
        )}
        <CardContent sx={{ pt: 0.5 }}>
          <Box data-testid="feed-incidents" sx={{ height: 380, overflow: 'auto' }} onScroll={handleScroll}>
            <List dense disablePadding>
              {items.map((item) => (
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
                      Incident {item.id}: {item.title}. Severity: P2. Owner: on-call team. Last update: {item.ts}.
                    </Box>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
            {loading && <Box sx={{ textAlign: 'center', py: 1 }}><CircularProgress size={16} /></Box>}
          </Box>
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', pt: 0.5 }}>
            Loaded {items.length} / {TOTAL}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
