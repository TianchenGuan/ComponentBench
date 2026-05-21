'use client';

/**
 * toolbar-mui-T08: Dark compact toolbar: scroll to Archive and click
 *
 * The scene is a dark-themed dashboard header at the top-left of the viewport. 
 * A MUI AppBar contains a dense/compact Toolbar labeled "Mail" with many small 
 * IconButtons (around 12) separated by minimal spacing.
 * The toolbar is horizontally scrollable within its own container (overflow-x). 
 * Only the first ~6 icons are visible initially.
 * The "Archive" action is located to the right and is not visible at first.
 */

import React, { useState } from 'react';
import {
  Paper,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import ReplyIcon from '@mui/icons-material/Reply';
import ForwardIcon from '@mui/icons-material/Forward';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import LabelIcon from '@mui/icons-material/Label';
import ReportIcon from '@mui/icons-material/Report';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import StarIcon from '@mui/icons-material/Star';
import SnoozeIcon from '@mui/icons-material/Snooze';
import type { TaskComponentProps } from '../types';

interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const ACTIONS: ToolbarAction[] = [
  { id: 'refresh', label: 'Refresh', icon: <RefreshIcon fontSize="small" /> },
  { id: 'delete', label: 'Delete', icon: <DeleteIcon fontSize="small" /> },
  { id: 'reply', label: 'Reply', icon: <ReplyIcon fontSize="small" /> },
  { id: 'forward', label: 'Forward', icon: <ForwardIcon fontSize="small" /> },
  { id: 'move', label: 'Move', icon: <MoveToInboxIcon fontSize="small" /> },
  { id: 'label', label: 'Label', icon: <LabelIcon fontSize="small" /> },
  { id: 'spam', label: 'Spam', icon: <ReportIcon fontSize="small" /> },
  { id: 'read', label: 'Mark read', icon: <MarkEmailReadIcon fontSize="small" /> },
  { id: 'unread', label: 'Mark unread', icon: <MarkEmailUnreadIcon fontSize="small" /> },
  { id: 'star', label: 'Star', icon: <StarIcon fontSize="small" /> },
  { id: 'snooze', label: 'Snooze', icon: <SnoozeIcon fontSize="small" /> },
  { id: 'archive', label: 'Archive', icon: <ArchiveIcon fontSize="small" /> },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [lastAction, setLastAction] = useState<string>('None');

  const handleAction = (action: ToolbarAction) => {
    setLastAction(action.label);
    if (action.id === 'archive') {
      onSuccess();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <AppBar position="static" color="default">
          <Toolbar
            variant="dense"
            sx={{ minHeight: 48, gap: 0.5 }}
            data-testid="mui-toolbar-mail"
          >
            <Typography variant="subtitle2" sx={{ mr: 1, whiteSpace: 'nowrap' }}>
              Mail
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                overflowX: 'auto',
                flex: 1,
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: 3,
                },
              }}
            >
              {ACTIONS.map((action) => (
                <Tooltip key={action.id} title={action.label}>
                  <IconButton
                    size="small"
                    onClick={() => handleAction(action)}
                    aria-label={action.label}
                    data-testid={`mui-toolbar-mail-${action.id}`}
                  >
                    {action.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
          <Typography variant="body2" color="text.secondary">
            Last action: {lastAction}
          </Typography>
        </Box>
      </Paper>

      {/* Clutter: other dashboard elements */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
        <Paper sx={{ p: 2, height: 80 }}>
          <Typography variant="caption" color="text.secondary">
            Inbox
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, height: 80 }}>
          <Typography variant="caption" color="text.secondary">
            Sent
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
