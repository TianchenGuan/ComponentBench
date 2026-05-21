'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './menubar/antd/T01';
import AntdT02 from './menubar/antd/T02';
import AntdT03 from './menubar/antd/T03';
import AntdT04 from './menubar/antd/T04';
import AntdT05 from './menubar/antd/T05';
import AntdT06 from './menubar/antd/T06';
import AntdT07 from './menubar/antd/T07';
import AntdT08 from './menubar/antd/T08';
import AntdT09 from './menubar/antd/T09';
import AntdT10 from './menubar/antd/T10';

// Import task-specific components for mui
import MuiT01 from './menubar/mui/T01';
import MuiT02 from './menubar/mui/T02';
import MuiT03 from './menubar/mui/T03';
import MuiT04 from './menubar/mui/T04';
import MuiT05 from './menubar/mui/T05';
import MuiT06 from './menubar/mui/T06';
import MuiT07 from './menubar/mui/T07';
import MuiT08 from './menubar/mui/T08';
import MuiT09 from './menubar/mui/T09';
import MuiT10 from './menubar/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './menubar/mantine/T01';
import MantineT02 from './menubar/mantine/T02';
import MantineT03 from './menubar/mantine/T03';
import MantineT04 from './menubar/mantine/T04';
import MantineT05 from './menubar/mantine/T05';
import MantineT06 from './menubar/mantine/T06';
import MantineT07 from './menubar/mantine/T07';
import MantineT08 from './menubar/mantine/T08';
import MantineT09 from './menubar/mantine/T09';
import MantineT10 from './menubar/mantine/T10';

interface MenubarTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'menubar-antd-T01': AntdT01,
  'menubar-antd-T02': AntdT02,
  'menubar-antd-T03': AntdT03,
  'menubar-antd-T04': AntdT04,
  'menubar-antd-T05': AntdT05,
  'menubar-antd-T06': AntdT06,
  'menubar-antd-T07': AntdT07,
  'menubar-antd-T08': AntdT08,
  'menubar-antd-T09': AntdT09,
  'menubar-antd-T10': AntdT10,
  // MUI tasks
  'menubar-mui-T01': MuiT01,
  'menubar-mui-T02': MuiT02,
  'menubar-mui-T03': MuiT03,
  'menubar-mui-T04': MuiT04,
  'menubar-mui-T05': MuiT05,
  'menubar-mui-T06': MuiT06,
  'menubar-mui-T07': MuiT07,
  'menubar-mui-T08': MuiT08,
  'menubar-mui-T09': MuiT09,
  'menubar-mui-T10': MuiT10,
  // Mantine tasks
  'menubar-mantine-T01': MantineT01,
  'menubar-mantine-T02': MantineT02,
  'menubar-mantine-T03': MantineT03,
  'menubar-mantine-T04': MantineT04,
  'menubar-mantine-T05': MantineT05,
  'menubar-mantine-T06': MantineT06,
  'menubar-mantine-T07': MantineT07,
  'menubar-mantine-T08': MantineT08,
  'menubar-mantine-T09': MantineT09,
  'menubar-mantine-T10': MantineT10,
};

export default function MenubarTaskRunner({ task }: MenubarTaskRunnerProps) {
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
