'use client';

/**
 * context_menu-mui-T04: Set Task A priority to High
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=2.
 *
 * Instances: TWO task cards are shown, each with its own context menu on right-click:
 * - Task A
 * - Task B
 *
 * Target instance: Task A.
 *
 * Context menu implementation: each card has an onContextMenu handler that opens a MUI Menu.
 *
 * Menu content for each task:
 * - Open
 * - Priority (radio group rendered inside the menu)
 *     - Low
 *     - Medium
 *     - High
 * - Delete
 *
 * Radio behavior: exactly one Priority option can be selected at a time.
 *
 * Initial state: Task A Priority: Medium, Task B Priority: Medium.
 *
 * Success: For the context menu instance labeled 'Task A', the selected radio value in group 'Priority' equals 'High'.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Divider, ListItemIcon } from '@mui/material';
import { Check as CheckIcon, Assignment as TaskIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

interface TaskCardProps {
  name: string;
  priority: 'Low' | 'Medium' | 'High';
  onPriorityChange: (priority: 'Low' | 'Medium' | 'High') => void;
}

function TaskCard({ name, priority, onPriorityChange }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorPosition(null);
  };

  const handlePrioritySelect = (p: 'Low' | 'Medium' | 'High') => {
    onPriorityChange(p);
    // Keep menu open to show selection
  };

  return (
    <>
      <Box
        onContextMenu={handleContextMenu}
        sx={{
          flex: 1,
          p: 2,
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.200',
          cursor: 'context-menu',
          textAlign: 'center',
        }}
        data-testid={`task-card-${name.replace(' ', '-').toLowerCase()}`}
        data-priority={priority}
      >
        <TaskIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="subtitle1" fontWeight={500}>{name}</Typography>
        <Typography variant="caption" color="text.secondary">
          Priority: {priority}
        </Typography>
      </Box>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
      >
        <MenuItem onClick={handleClose}>Open</MenuItem>
        <Divider />
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 0.5 }}>
          Priority
        </Typography>
        {(['Low', 'Medium', 'High'] as const).map((p) => (
          <MenuItem
            key={p}
            onClick={() => handlePrioritySelect(p)}
            data-testid={`priority-${p.toLowerCase()}`}
          >
            {priority === p && (
              <ListItemIcon>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
            <Typography sx={{ pl: priority === p ? 0 : 4 }}>{p}</Typography>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [taskAPriority, setTaskAPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [taskBPriority, setTaskBPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (taskAPriority === 'High' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [taskAPriority, successTriggered, onSuccess]);

  return (
    <Paper elevation={2} sx={{ p: 2, width: 450 }}>
      <Typography variant="h6" gutterBottom>
        Tasks
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TaskCard
          name="Task A"
          priority={taskAPriority}
          onPriorityChange={setTaskAPriority}
        />
        <TaskCard
          name="Task B"
          priority={taskBPriority}
          onPriorityChange={setTaskBPriority}
        />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Task A Priority: <strong data-testid="task-a-priority">{taskAPriority}</strong>
        {' | '}
        Task B Priority: <strong data-testid="task-b-priority">{taskBPriority}</strong>
      </Typography>
    </Paper>
  );
}
