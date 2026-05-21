'use client';

/**
 * progress_bar-mui-T10: Drawer task manager: complete Report export
 *
 * Layout: drawer_flow with dark theme. A small floating "Task manager" button is anchored 
 * at the bottom-right corner of the viewport.
 *
 * Target components: two MUI LinearProgress bars (instances=2) shown only inside the 
 * Task manager drawer:
 * - "Report export" (TARGET)
 * - "Thumbnail generation" (distractor)
 *
 * Overlay behavior:
 * - Clicking the floating "Task manager" button opens a right-side Drawer titled "Tasks".
 * - Each task row contains: a task name, a LinearProgress bar, and a small "Start" button.
 *
 * Initial state:
 * - Both tasks start at 0% and idle (no animation).
 *
 * Success: "Report export" progress equals 100% with status success.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Drawer,
  Typography,
  LinearProgress,
  Button,
  TextField,
  List,
  ListItem,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { ListAlt as ListAltIcon, Close as CloseIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { TaskComponentProps } from '../types';

interface TaskItem {
  id: string;
  name: string;
  progress: number;
  isRunning: boolean;
  status: 'idle' | 'running' | 'done';
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 'report', name: 'Report export', progress: 0, isRunning: false, status: 'idle' },
    { id: 'thumbnail', name: 'Thumbnail generation', progress: 0, isRunning: false, status: 'idle' },
  ]);

  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const successFiredRef = useRef(false);

  // Check for success: Report export at 100% with status done
  useEffect(() => {
    const reportTask = tasks.find((t) => t.id === 'report');
    if (
      reportTask &&
      reportTask.progress >= 100 &&
      reportTask.status === 'done' &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [tasks, onSuccess]);

  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const handleStartTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.isRunning || task.status === 'done') return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, isRunning: true, status: 'running' } : t
      )
    );

    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          if (t.progress >= 100) {
            clearInterval(intervalsRef.current.get(taskId)!);
            intervalsRef.current.delete(taskId);
            return { ...t, progress: 100, isRunning: false, status: 'done' };
          }
          return { ...t, progress: t.progress + 2 };
        })
      );
    }, 100);

    intervalsRef.current.set(taskId, interval);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: 400,
          bgcolor: '#121212',
          position: 'relative',
          borderRadius: 1,
        }}
      >
        <Typography
          variant="body1"
          sx={{ p: 3, color: 'text.secondary' }}
        >
          Click the Task manager button to view and manage tasks.
        </Typography>

        {/* Floating button */}
        <Fab
          color="primary"
          aria-label="Task manager"
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
          }}
        >
          <ListAltIcon />
        </Fab>

        {/* Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: { width: 350, bgcolor: '#1e1e1e' },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Tasks</Typography>
              <IconButton onClick={() => setDrawerOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              size="small"
              placeholder="Search tasks..."
              fullWidth
              sx={{ mb: 2 }}
            />

            <Divider sx={{ mb: 2 }} />

            <List disablePadding>
              {tasks.map((task) => (
                <ListItem
                  key={task.id}
                  data-task-id={task.id}
                  sx={{
                    display: 'block',
                    px: 0,
                    py: 1.5,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {task.name}
                    </Typography>
                    {task.status === 'done' && (
                      <Chip label="Done" size="small" color="success" />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={task.progress}
                        aria-label={`${task.name} progress`}
                        data-testid={`progress-${task.id}`}
                        color={task.status === 'done' ? 'success' : 'primary'}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ minWidth: 35 }}>
                      {task.progress}%
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleStartTask(task.id)}
                      disabled={task.isRunning || task.status === 'done'}
                    >
                      Start
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
