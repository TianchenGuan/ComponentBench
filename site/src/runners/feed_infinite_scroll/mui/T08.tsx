'use client';

/**
 * feed_infinite_scroll-mui-T08: Small bulk triage: save 4 cases
 * 
 * Layout: isolated card titled "Case Triage".
 * Scale: small. The feed card is narrower and rows are more compact.
 * The feed is an infinite-scrolling MUI List with a Checkbox at the start of each row.
 * Selection is staged: checking boxes updates a "Selected (pending)" count;
 * selection is only committed after clicking the sticky footer button "Save selection".
 * 
 * Success: committed_selected_item_ids equals [CASE-014, CASE-017, CASE-019, CASE-023]
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Checkbox,
  Button,
  CircularProgress,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
}

function generateCases(start: number, count: number): FeedItem[] {
  const titles = [
    'Billing dispute',
    'Account access',
    'Refund request',
    'Technical issue',
    'Feature request',
    'Bug report',
    'Data export',
    'Integration help',
    'Login problem',
    'Performance issue',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `CASE-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
    });
  }
  return items;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateCases(1, 25));
  const [loading, setLoading] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<Set<string>>(new Set());
  const [committedSelection, setCommittedSelection] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (successCalledRef.current) return;
    
    const targetIds = ['CASE-014', 'CASE-017', 'CASE-019', 'CASE-023'];
    const isMatch = committedSelection.length === 4 &&
      targetIds.every(id => committedSelection.includes(id));
    
    if (isMatch) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [committedSelection, onSuccess]);

  const handleToggle = (id: string) => {
    setPendingSelection(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = () => {
    setCommittedSelection(Array.from(pendingSelection));
  };

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading && items.length < 50) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateCases(prev.length + 1, 10)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <Paper 
      elevation={2} 
      sx={{ width: 380, overflow: 'hidden' }}
      data-testid="feed-CaseTriage"
      data-committed-selected={JSON.stringify(committedSelection)}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ p: 1.5, borderBottom: '1px solid #eee' }}>
        Case Triage
      </Typography>
      <Box
        ref={containerRef}
        sx={{
          height: 350,
          overflow: 'auto',
        }}
        onScroll={handleScroll}
      >
        <List dense disablePadding>
          {items.map((item) => (
            <ListItem
              key={item.id}
              data-item-id={item.id}
              divider
              dense
              sx={{ py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Checkbox
                  edge="start"
                  size="small"
                  checked={pendingSelection.has(item.id)}
                  onChange={() => handleToggle(item.id)}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontSize={12}>
                    <strong>{item.id}</strong> · {item.title}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
        {loading && (
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <CircularProgress size={18} />
          </Box>
        )}
      </Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 1.5,
        borderTop: '1px solid #eee',
        bgcolor: 'grey.50',
      }}>
        <Typography variant="caption" color="text.secondary">
          Selected (pending): {pendingSelection.size}
          {committedSelection.length > 0 && ` | ${committedSelection.length} saved`}
        </Typography>
        <Button
          size="small"
          variant="contained"
          disabled={pendingSelection.size === 0}
          onClick={handleSave}
        >
          Save selection
        </Button>
      </Box>
    </Paper>
  );
}
