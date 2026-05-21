'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './drawer/antd/T01';
import AntdT02 from './drawer/antd/T02';
import AntdT03 from './drawer/antd/T03';
import AntdT04 from './drawer/antd/T04';
import AntdT05 from './drawer/antd/T05';
import AntdT06 from './drawer/antd/T06';
import AntdT07 from './drawer/antd/T07';
import AntdT08 from './drawer/antd/T08';
import AntdT09 from './drawer/antd/T09';
import AntdT10 from './drawer/antd/T10';

// Import task-specific components for mui
import MuiT01 from './drawer/mui/T01';
import MuiT02 from './drawer/mui/T02';
import MuiT03 from './drawer/mui/T03';
import MuiT04 from './drawer/mui/T04';
import MuiT05 from './drawer/mui/T05';
import MuiT06 from './drawer/mui/T06';
import MuiT07 from './drawer/mui/T07';
import MuiT08 from './drawer/mui/T08';
import MuiT09 from './drawer/mui/T09';
import MuiT10 from './drawer/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './drawer/mantine/T01';
import MantineT02 from './drawer/mantine/T02';
import MantineT03 from './drawer/mantine/T03';
import MantineT04 from './drawer/mantine/T04';
import MantineT05 from './drawer/mantine/T05';
import MantineT06 from './drawer/mantine/T06';
import MantineT07 from './drawer/mantine/T07';
import MantineT08 from './drawer/mantine/T08';
import MantineT09 from './drawer/mantine/T09';
import MantineT10 from './drawer/mantine/T10';

interface DrawerTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'drawer-antd-T01': AntdT01,
  'drawer-antd-T02': AntdT02,
  'drawer-antd-T03': AntdT03,
  'drawer-antd-T04': AntdT04,
  'drawer-antd-T05': AntdT05,
  'drawer-antd-T06': AntdT06,
  'drawer-antd-T07': AntdT07,
  'drawer-antd-T08': AntdT08,
  'drawer-antd-T09': AntdT09,
  'drawer-antd-T10': AntdT10,
  // MUI tasks
  'drawer-mui-T01': MuiT01,
  'drawer-mui-T02': MuiT02,
  'drawer-mui-T03': MuiT03,
  'drawer-mui-T04': MuiT04,
  'drawer-mui-T05': MuiT05,
  'drawer-mui-T06': MuiT06,
  'drawer-mui-T07': MuiT07,
  'drawer-mui-T08': MuiT08,
  'drawer-mui-T09': MuiT09,
  'drawer-mui-T10': MuiT10,
  // Mantine tasks
  'drawer-mantine-T01': MantineT01,
  'drawer-mantine-T02': MantineT02,
  'drawer-mantine-T03': MantineT03,
  'drawer-mantine-T04': MantineT04,
  'drawer-mantine-T05': MantineT05,
  'drawer-mantine-T06': MantineT06,
  'drawer-mantine-T07': MantineT07,
  'drawer-mantine-T08': MantineT08,
  'drawer-mantine-T09': MantineT09,
  'drawer-mantine-T10': MantineT10,
};

export default function DrawerTaskRunner({ task }: DrawerTaskRunnerProps) {
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
