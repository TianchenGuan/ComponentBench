'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './toolbar/antd/T01';
import AntdT02 from './toolbar/antd/T02';
import AntdT03 from './toolbar/antd/T03';
import AntdT04 from './toolbar/antd/T04';
import AntdT05 from './toolbar/antd/T05';
import AntdT06 from './toolbar/antd/T06';
import AntdT07 from './toolbar/antd/T07';
import AntdT08 from './toolbar/antd/T08';
import AntdT09 from './toolbar/antd/T09';
import AntdT10 from './toolbar/antd/T10';

// Import task-specific components for mui
import MuiT01 from './toolbar/mui/T01';
import MuiT02 from './toolbar/mui/T02';
import MuiT03 from './toolbar/mui/T03';
import MuiT04 from './toolbar/mui/T04';
import MuiT05 from './toolbar/mui/T05';
import MuiT06 from './toolbar/mui/T06';
import MuiT07 from './toolbar/mui/T07';
import MuiT08 from './toolbar/mui/T08';
import MuiT09 from './toolbar/mui/T09';
import MuiT10 from './toolbar/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './toolbar/mantine/T01';
import MantineT02 from './toolbar/mantine/T02';
import MantineT03 from './toolbar/mantine/T03';
import MantineT04 from './toolbar/mantine/T04';
import MantineT05 from './toolbar/mantine/T05';
import MantineT06 from './toolbar/mantine/T06';
import MantineT07 from './toolbar/mantine/T07';
import MantineT08 from './toolbar/mantine/T08';
import MantineT09 from './toolbar/mantine/T09';
import MantineT10 from './toolbar/mantine/T10';

interface ToolbarTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'toolbar-antd-T01': AntdT01,
  'toolbar-antd-T02': AntdT02,
  'toolbar-antd-T03': AntdT03,
  'toolbar-antd-T04': AntdT04,
  'toolbar-antd-T05': AntdT05,
  'toolbar-antd-T06': AntdT06,
  'toolbar-antd-T07': AntdT07,
  'toolbar-antd-T08': AntdT08,
  'toolbar-antd-T09': AntdT09,
  'toolbar-antd-T10': AntdT10,
  // MUI tasks
  'toolbar-mui-T01': MuiT01,
  'toolbar-mui-T02': MuiT02,
  'toolbar-mui-T03': MuiT03,
  'toolbar-mui-T04': MuiT04,
  'toolbar-mui-T05': MuiT05,
  'toolbar-mui-T06': MuiT06,
  'toolbar-mui-T07': MuiT07,
  'toolbar-mui-T08': MuiT08,
  'toolbar-mui-T09': MuiT09,
  'toolbar-mui-T10': MuiT10,
  // Mantine tasks
  'toolbar-mantine-T01': MantineT01,
  'toolbar-mantine-T02': MantineT02,
  'toolbar-mantine-T03': MantineT03,
  'toolbar-mantine-T04': MantineT04,
  'toolbar-mantine-T05': MantineT05,
  'toolbar-mantine-T06': MantineT06,
  'toolbar-mantine-T07': MantineT07,
  'toolbar-mantine-T08': MantineT08,
  'toolbar-mantine-T09': MantineT09,
  'toolbar-mantine-T10': MantineT10,
};

export default function ToolbarTaskRunner({ task }: ToolbarTaskRunnerProps) {
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
