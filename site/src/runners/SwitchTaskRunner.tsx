'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './switch/antd/T01';
import AntdT02 from './switch/antd/T02';
import AntdT03 from './switch/antd/T03';
import AntdT04 from './switch/antd/T04';
import AntdT05 from './switch/antd/T05';
import AntdT06 from './switch/antd/T06';
import AntdT07 from './switch/antd/T07';
import AntdT08 from './switch/antd/T08';
import AntdT09 from './switch/antd/T09';
import AntdT10 from './switch/antd/T10';

// Import task-specific components for mui
import MuiT01 from './switch/mui/T01';
import MuiT02 from './switch/mui/T02';
import MuiT03 from './switch/mui/T03';
import MuiT04 from './switch/mui/T04';
import MuiT05 from './switch/mui/T05';
import MuiT06 from './switch/mui/T06';
import MuiT07 from './switch/mui/T07';
import MuiT08 from './switch/mui/T08';
import MuiT09 from './switch/mui/T09';
import MuiT10 from './switch/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './switch/mantine/T01';
import MantineT02 from './switch/mantine/T02';
import MantineT03 from './switch/mantine/T03';
import MantineT04 from './switch/mantine/T04';
import MantineT05 from './switch/mantine/T05';
import MantineT06 from './switch/mantine/T06';
import MantineT07 from './switch/mantine/T07';
import MantineT08 from './switch/mantine/T08';
import MantineT09 from './switch/mantine/T09';
import MantineT10 from './switch/mantine/T10';

interface SwitchTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'switch-antd-T01': AntdT01,
  'switch-antd-T02': AntdT02,
  'switch-antd-T03': AntdT03,
  'switch-antd-T04': AntdT04,
  'switch-antd-T05': AntdT05,
  'switch-antd-T06': AntdT06,
  'switch-antd-T07': AntdT07,
  'switch-antd-T08': AntdT08,
  'switch-antd-T09': AntdT09,
  'switch-antd-T10': AntdT10,
  // MUI tasks
  'switch-mui-T01': MuiT01,
  'switch-mui-T02': MuiT02,
  'switch-mui-T03': MuiT03,
  'switch-mui-T04': MuiT04,
  'switch-mui-T05': MuiT05,
  'switch-mui-T06': MuiT06,
  'switch-mui-T07': MuiT07,
  'switch-mui-T08': MuiT08,
  'switch-mui-T09': MuiT09,
  'switch-mui-T10': MuiT10,
  // Mantine tasks
  'switch-mantine-T01': MantineT01,
  'switch-mantine-T02': MantineT02,
  'switch-mantine-T03': MantineT03,
  'switch-mantine-T04': MantineT04,
  'switch-mantine-T05': MantineT05,
  'switch-mantine-T06': MantineT06,
  'switch-mantine-T07': MantineT07,
  'switch-mantine-T08': MantineT08,
  'switch-mantine-T09': MantineT09,
  'switch-mantine-T10': MantineT10,
};

export default function SwitchTaskRunner({ task }: SwitchTaskRunnerProps) {
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
