'use client';

/**
 * context_menu-mui-v2-T07: Task A — Priority → High (dense menu)
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Divider, ListSubheader } from '@mui/material';
import type { TaskComponentProps } from '../../types';

type Pri = 'Low' | 'Medium' | 'High';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [priorities, setPriorities] = useState<Record<string, Pri>>({
    'Task A': 'Medium',
    'Task B': 'Medium',
    'Task C': 'Medium',
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (priorities['Task A'] === 'High' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [priorities, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent, label: string) => {
    event.preventDefault();
    setActiveTask(label);
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorPosition(null);
    setActiveTask(null);
  };

  const setPri = (p: Pri) => {
    if (!activeTask) return;
    setPriorities((prev) => ({ ...prev, [activeTask]: p }));
  };

  const cur = activeTask ? priorities[activeTask] : 'Medium';

  return (
    <Paper elevation={2} sx={{ p: 1.5, width: 480 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontSize: 13 }}>
        Sprint strip
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {(['Task A', 'Task B', 'Task C'] as const).map((t) => (
          <Paper
            key={t}
            variant="outlined"
            onContextMenu={(e) => handleContextMenu(e, t)}
            sx={{ flex: 1, p: 1, cursor: 'context-menu' }}
            data-testid={`task-card-${t.replace(/\s/g, '-').toLowerCase()}`}
            data-instance-label={t}
            data-priority={priorities[t]}
            data-radio-groups={JSON.stringify({ Priority: priorities[t] })}
          >
            <Typography variant="caption" fontWeight={600}>
              {t}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 10 }}>
              Priority: {priorities[t]}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        slotProps={{ list: { dense: true, sx: { py: 0 } } }}
        data-testid="context-menu-overlay"
      >
        <MenuItem dense sx={{ fontSize: 11, minHeight: 26 }} onClick={handleClose}>
          Open
        </MenuItem>
        <ListSubheader sx={{ lineHeight: '24px', fontSize: 10, fontWeight: 600 }}>Priority</ListSubheader>
        {(['Low', 'Medium', 'High'] as const).map((p) => (
          <MenuItem
            key={p}
            dense
            selected={cur === p}
            sx={{ fontSize: 11, minHeight: 26, pl: 2 }}
            onClick={() => setPri(p)}
          >
            {p}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem dense sx={{ fontSize: 11, minHeight: 26 }} onClick={handleClose}>
          Assign
        </MenuItem>
        <MenuItem dense sx={{ fontSize: 11, minHeight: 26 }} onClick={handleClose}>
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
}
