'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './link/antd/T01';
import AntdT02 from './link/antd/T02';
import AntdT03 from './link/antd/T03';
import AntdT04 from './link/antd/T04';
import AntdT05 from './link/antd/T05';
import AntdT06 from './link/antd/T06';
import AntdT07 from './link/antd/T07';
import AntdT08 from './link/antd/T08';
import AntdT09 from './link/antd/T09';
import AntdT10 from './link/antd/T10';

// Import task-specific components for mui
import MuiT01 from './link/mui/T01';
import MuiT02 from './link/mui/T02';
import MuiT03 from './link/mui/T03';
import MuiT04 from './link/mui/T04';
import MuiT05 from './link/mui/T05';
import MuiT06 from './link/mui/T06';
import MuiT07 from './link/mui/T07';
import MuiT08 from './link/mui/T08';
import MuiT09 from './link/mui/T09';
import MuiT10 from './link/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './link/mantine/T01';
import MantineT02 from './link/mantine/T02';
import MantineT03 from './link/mantine/T03';
import MantineT04 from './link/mantine/T04';
import MantineT05 from './link/mantine/T05';
import MantineT06 from './link/mantine/T06';
import MantineT07 from './link/mantine/T07';
import MantineT08 from './link/mantine/T08';
import MantineT09 from './link/mantine/T09';
import MantineT10 from './link/mantine/T10';

interface LinkTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'link-antd-T01': AntdT01,
  'link-antd-T02': AntdT02,
  'link-antd-T03': AntdT03,
  'link-antd-T04': AntdT04,
  'link-antd-T05': AntdT05,
  'link-antd-T06': AntdT06,
  'link-antd-T07': AntdT07,
  'link-antd-T08': AntdT08,
  'link-antd-T09': AntdT09,
  'link-antd-T10': AntdT10,
  // MUI tasks
  'link-mui-T01': MuiT01,
  'link-mui-T02': MuiT02,
  'link-mui-T03': MuiT03,
  'link-mui-T04': MuiT04,
  'link-mui-T05': MuiT05,
  'link-mui-T06': MuiT06,
  'link-mui-T07': MuiT07,
  'link-mui-T08': MuiT08,
  'link-mui-T09': MuiT09,
  'link-mui-T10': MuiT10,
  // Mantine tasks
  'link-mantine-T01': MantineT01,
  'link-mantine-T02': MantineT02,
  'link-mantine-T03': MantineT03,
  'link-mantine-T04': MantineT04,
  'link-mantine-T05': MantineT05,
  'link-mantine-T06': MantineT06,
  'link-mantine-T07': MantineT07,
  'link-mantine-T08': MantineT08,
  'link-mantine-T09': MantineT09,
  'link-mantine-T10': MantineT10,
};

export default function LinkTaskRunner({ task }: LinkTaskRunnerProps) {
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
