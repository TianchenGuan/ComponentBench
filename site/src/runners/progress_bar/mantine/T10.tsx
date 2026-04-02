'use client';

/**
 * progress_bar-mantine-T10: Dashboard list: complete Photo sync task
 *
 * Layout: dashboard. The page shows multiple panels (charts, recent events, and an "Operations" panel). 
 * The Operations panel contains a vertically scrollable list of tasks.
 *
 * Target components: three Mantine Progress bars (instances=3), one per task row in the Operations list:
 * - "Log cleanup"
 * - "Photo sync" (TARGET)
 * - "Backup verification"
 * Only two rows are visible at a time; the list must be scrolled to reveal "Photo sync".
 *
 * Each task row contains:
 * - Task name text.
 * - A Mantine Progress bar labeled with aria-label like "Photo sync progress".
 * - A small "Run" button.
 *
 * Initial state:
 * - All tasks start at 0% and idle.
 *
 * Interaction:
 * - Clicking "Run" in a row starts that row's progress filling to 100% and then stopping.
 *
 * Success: "Photo sync" progress reaches 100%.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Button, Group, Stack, Box, Paper } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface TaskItem {
  id: string;
  name: string;
  progress: number;
  isRunning: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 'log', name: 'Log cleanup', progress: 0, isRunning: false },
    { id: 'photo', name: 'Photo sync', progress: 0, isRunning: false },
    { id: 'backup', name: 'Backup verification', progress: 0, isRunning: false },
  ]);

  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const successFiredRef = useRef(false);

  // Check for success: Photo sync at 100%
  useEffect(() => {
    const photoTask = tasks.find((t) => t.id === 'photo');
    if (photoTask && photoTask.progress >= 100 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [tasks, onSuccess]);

  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const handleRun = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.isRunning || task.progress >= 100) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isRunning: true } : t))
    );

    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          if (t.progress >= 100) {
            clearInterval(intervalsRef.current.get(taskId)!);
            intervalsRef.current.delete(taskId);
            return { ...t, progress: 100, isRunning: false };
          }
          return { ...t, progress: t.progress + 2 };
        })
      );
    }, 100);

    intervalsRef.current.set(taskId, interval);
  };

  return (
    <Box style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {/* Chart panel (distractor) */}
      <Paper shadow="sm" p="md" radius="md" withBorder style={{ width: 200, height: 150 }}>
        <Text fw={500} size="sm" mb={8}>Analytics</Text>
        <Text size="xs" c="dimmed">Chart placeholder</Text>
      </Paper>

      {/* Recent events panel (distractor) */}
      <Paper shadow="sm" p="md" radius="md" withBorder style={{ width: 200, height: 150 }}>
        <Text fw={500} size="sm" mb={8}>Recent Events</Text>
        <Text size="xs" c="dimmed">No recent events</Text>
      </Paper>

      {/* Operations panel */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={600} size="lg" mb={12}>Operations</Text>
        
        {/* Scrollable list - only shows 2 items at a time */}
        <Box
          style={{
            height: 160,
            overflowY: 'auto',
            border: '1px solid #e9ecef',
            borderRadius: 4,
            padding: 8,
          }}
        >
          <Stack gap="md">
            {tasks.map((task) => (
              <div key={task.id} data-task-id={task.id}>
                <Group justify="space-between" mb={4}>
                  <Text size="sm">{task.name}</Text>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleRun(task.id)}
                    disabled={task.isRunning || task.progress >= 100}
                  >
                    Run
                  </Button>
                </Group>
                <Group gap="sm" align="center">
                  <Progress
                    value={task.progress}
                    aria-label={`${task.name} progress`}
                    data-testid={`progress-${task.id}`}
                    style={{ flex: 1 }}
                  />
                  <Text size="xs" c="dimmed" style={{ minWidth: 35 }}>
                    {task.progress}%
                  </Text>
                </Group>
              </div>
            ))}
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
