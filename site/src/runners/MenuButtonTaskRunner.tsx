'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './menu_button/antd/T01';
import AntdT02 from './menu_button/antd/T02';
import AntdT03 from './menu_button/antd/T03';
import AntdT04 from './menu_button/antd/T04';
import AntdT05 from './menu_button/antd/T05';
import AntdT06 from './menu_button/antd/T06';
import AntdT07 from './menu_button/antd/T07';
import AntdT08 from './menu_button/antd/T08';
import AntdT09 from './menu_button/antd/T09';
import AntdT10 from './menu_button/antd/T10';

// Import task-specific components for mui
import MuiT01 from './menu_button/mui/T01';
import MuiT02 from './menu_button/mui/T02';
import MuiT03 from './menu_button/mui/T03';
import MuiT04 from './menu_button/mui/T04';
import MuiT05 from './menu_button/mui/T05';
import MuiT06 from './menu_button/mui/T06';
import MuiT07 from './menu_button/mui/T07';
import MuiT08 from './menu_button/mui/T08';
import MuiT09 from './menu_button/mui/T09';
import MuiT10 from './menu_button/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './menu_button/mantine/T01';
import MantineT02 from './menu_button/mantine/T02';
import MantineT03 from './menu_button/mantine/T03';
import MantineT04 from './menu_button/mantine/T04';
import MantineT05 from './menu_button/mantine/T05';
import MantineT06 from './menu_button/mantine/T06';
import MantineT07 from './menu_button/mantine/T07';
import MantineT08 from './menu_button/mantine/T08';
import MantineT09 from './menu_button/mantine/T09';
import MantineT10 from './menu_button/mantine/T10';

interface MenuButtonTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'menu_button-antd-T01': AntdT01,
  'menu_button-antd-T02': AntdT02,
  'menu_button-antd-T03': AntdT03,
  'menu_button-antd-T04': AntdT04,
  'menu_button-antd-T05': AntdT05,
  'menu_button-antd-T06': AntdT06,
  'menu_button-antd-T07': AntdT07,
  'menu_button-antd-T08': AntdT08,
  'menu_button-antd-T09': AntdT09,
  'menu_button-antd-T10': AntdT10,
  // MUI tasks
  'menu_button-mui-T01': MuiT01,
  'menu_button-mui-T02': MuiT02,
  'menu_button-mui-T03': MuiT03,
  'menu_button-mui-T04': MuiT04,
  'menu_button-mui-T05': MuiT05,
  'menu_button-mui-T06': MuiT06,
  'menu_button-mui-T07': MuiT07,
  'menu_button-mui-T08': MuiT08,
  'menu_button-mui-T09': MuiT09,
  'menu_button-mui-T10': MuiT10,
  // Mantine tasks
  'menu_button-mantine-T01': MantineT01,
  'menu_button-mantine-T02': MantineT02,
  'menu_button-mantine-T03': MantineT03,
  'menu_button-mantine-T04': MantineT04,
  'menu_button-mantine-T05': MantineT05,
  'menu_button-mantine-T06': MantineT06,
  'menu_button-mantine-T07': MantineT07,
  'menu_button-mantine-T08': MantineT08,
  'menu_button-mantine-T09': MantineT09,
  'menu_button-mantine-T10': MantineT10,
};

export default function MenuButtonTaskRunner({ task }: MenuButtonTaskRunnerProps) {
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
