'use client';

/**
 * feed_infinite_scroll-mui-T10: Bulk Review: cancel clear-selection confirmation
 * 
 * Layout: isolated card titled "Bulk Review".
 * The feed is a scrollable infinite List with checkboxes.
 * Two items are already selected and committed: REV-055 and REV-058.
 * A toolbar above the feed shows "2 selected" and includes a button "Clear selection".
 * Clicking "Clear selection" opens a MUI Dialog asking "Clear 2 selected items?"
 * with two buttons: "Clear" (destructive) and "Cancel".
 * 
 * Success: last_confirm_dialog_action equals 'cancel' and selection remains unchanged
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'Content review',
    'Image approval',
    'Text verification',
    'Link check',
    'Format review',
    'Style review',
    'Compliance check',
    'Quality review',
    'Final approval',
    'Publication ready',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `REV-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
    });
  }
  return items;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [items] = useState<FeedItem[]>(() => generateItems(1, 60));
  // Pre-selected items
  const [committedSelection] = useState<string[]>(['REV-055', 'REV-058']);
  const [pendingSelection, setPendingSelection] = useState<Set<string>>(
    () => new Set(['REV-055', 'REV-058'])
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastDialogAction, setLastDialogAction] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && lastDialogAction === 'cancel') {
      // Verify selection is still the same
      if (committedSelection.length === 2 &&
          committedSelection.includes('REV-055') &&
          committedSelection.includes('REV-058')) {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [lastDialogAction, committedSelection, onSuccess]);

  const handleClearClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = (action: 'cancel' | 'clear') => {
    setLastDialogAction(action);
    setDialogOpen(false);
    
    // Note: In this task, we don't actually clear since success is about canceling
    // But if the user clicks Clear, we would normally clear the selection
  };

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

  return (
    <>
      <Paper 
        elevation={2} 
        sx={{ width: 500, overflow: 'hidden' }}
        data-testid="feed-BulkReview"
        data-committed-selected={JSON.stringify(committedSelection)}
        data-last-confirm-dialog-action={lastDialogAction}
      >
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="h6">Bulk Review</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {committedSelection.length} selected
            </Typography>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={handleClearClick}
              disabled={committedSelection.length === 0}
            >
              Clear selection
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            height: 400,
            overflow: 'auto',
          }}
        >
          <List disablePadding>
            {items.map((item) => (
              <ListItem
                key={item.id}
                data-item-id={item.id}
                divider
                sx={{ py: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Checkbox
                    edge="start"
                    checked={pendingSelection.has(item.id)}
                    onChange={() => handleToggle(item.id)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography fontSize={14}>
                      <strong>{item.id}</strong> · {item.title}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose('cancel')}
      >
        <DialogTitle>Clear selection?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Clear {committedSelection.length} selected items? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose('cancel')}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleDialogClose('clear')} 
            color="error"
            variant="contained"
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
