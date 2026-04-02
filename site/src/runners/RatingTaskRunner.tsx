'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './rating/antd/T01';
import AntdT02 from './rating/antd/T02';
import AntdT03 from './rating/antd/T03';
import AntdT04 from './rating/antd/T04';
import AntdT05 from './rating/antd/T05';
import AntdT06 from './rating/antd/T06';
import AntdT07 from './rating/antd/T07';
import AntdT08 from './rating/antd/T08';
import AntdT09 from './rating/antd/T09';
import AntdT10 from './rating/antd/T10';

// Import task-specific components for mui
import MuiT01 from './rating/mui/T01';
import MuiT02 from './rating/mui/T02';
import MuiT03 from './rating/mui/T03';
import MuiT04 from './rating/mui/T04';
import MuiT05 from './rating/mui/T05';
import MuiT06 from './rating/mui/T06';
import MuiT07 from './rating/mui/T07';
import MuiT08 from './rating/mui/T08';
import MuiT09 from './rating/mui/T09';
import MuiT10 from './rating/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './rating/mantine/T01';
import MantineT02 from './rating/mantine/T02';
import MantineT03 from './rating/mantine/T03';
import MantineT04 from './rating/mantine/T04';
import MantineT05 from './rating/mantine/T05';
import MantineT06 from './rating/mantine/T06';
import MantineT07 from './rating/mantine/T07';
import MantineT08 from './rating/mantine/T08';
import MantineT09 from './rating/mantine/T09';
import MantineT10 from './rating/mantine/T10';

interface RatingTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'rating-antd-T01': AntdT01,
  'rating-antd-T02': AntdT02,
  'rating-antd-T03': AntdT03,
  'rating-antd-T04': AntdT04,
  'rating-antd-T05': AntdT05,
  'rating-antd-T06': AntdT06,
  'rating-antd-T07': AntdT07,
  'rating-antd-T08': AntdT08,
  'rating-antd-T09': AntdT09,
  'rating-antd-T10': AntdT10,
  // MUI tasks
  'rating-mui-T01': MuiT01,
  'rating-mui-T02': MuiT02,
  'rating-mui-T03': MuiT03,
  'rating-mui-T04': MuiT04,
  'rating-mui-T05': MuiT05,
  'rating-mui-T06': MuiT06,
  'rating-mui-T07': MuiT07,
  'rating-mui-T08': MuiT08,
  'rating-mui-T09': MuiT09,
  'rating-mui-T10': MuiT10,
  // Mantine tasks
  'rating-mantine-T01': MantineT01,
  'rating-mantine-T02': MantineT02,
  'rating-mantine-T03': MantineT03,
  'rating-mantine-T04': MantineT04,
  'rating-mantine-T05': MantineT05,
  'rating-mantine-T06': MantineT06,
  'rating-mantine-T07': MantineT07,
  'rating-mantine-T08': MantineT08,
  'rating-mantine-T09': MantineT09,
  'rating-mantine-T10': MantineT10,
};

export default function RatingTaskRunner({ task }: RatingTaskRunnerProps) {
  const handleSuccess = () => {
    finishTask(task.id);
    message.success('Task completed!');
  };

  const TaskComponent = taskComponentMap[task.id];

  if (!TaskComponent) {
    return (
      <ThemeWrapper task={task}>
        <PlacementWrapper placement={task.scene_context.placement}>
          <div
            style={{
              padding: 48,
              background: task.scene_context.theme === 'dark' ? '#1f1f1f' : '#fff',
              borderRadius: 8,
              border: '1px solid #e8e8e8',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              Task component not found
            </div>
            <div style={{ color: '#999' }}>
              Task ID: <code>{task.id}</code>
            </div>
          </div>
        </PlacementWrapper>
      </ThemeWrapper>
    );
  }

  return (
    <ThemeWrapper task={task}>
      <PlacementWrapper placement={task.scene_context.placement}>
        <TaskComponent task={task} onSuccess={handleSuccess} />
      </PlacementWrapper>
    </ThemeWrapper>
  );
}
