'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './icon_button/antd/T01';
import AntdT02 from './icon_button/antd/T02';
import AntdT03 from './icon_button/antd/T03';
import AntdT04 from './icon_button/antd/T04';
import AntdT05 from './icon_button/antd/T05';
import AntdT06 from './icon_button/antd/T06';
import AntdT07 from './icon_button/antd/T07';
import AntdT08 from './icon_button/antd/T08';
import AntdT09 from './icon_button/antd/T09';
import AntdT10 from './icon_button/antd/T10';

// Import task-specific components for mui
import MuiT01 from './icon_button/mui/T01';
import MuiT02 from './icon_button/mui/T02';
import MuiT03 from './icon_button/mui/T03';
import MuiT04 from './icon_button/mui/T04';
import MuiT05 from './icon_button/mui/T05';
import MuiT06 from './icon_button/mui/T06';
import MuiT07 from './icon_button/mui/T07';
import MuiT08 from './icon_button/mui/T08';
import MuiT09 from './icon_button/mui/T09';
import MuiT10 from './icon_button/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './icon_button/mantine/T01';
import MantineT02 from './icon_button/mantine/T02';
import MantineT03 from './icon_button/mantine/T03';
import MantineT04 from './icon_button/mantine/T04';
import MantineT05 from './icon_button/mantine/T05';
import MantineT06 from './icon_button/mantine/T06';
import MantineT07 from './icon_button/mantine/T07';
import MantineT08 from './icon_button/mantine/T08';
import MantineT09 from './icon_button/mantine/T09';
import MantineT10 from './icon_button/mantine/T10';

interface IconButtonTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'icon_button-antd-T01': AntdT01,
  'icon_button-antd-T02': AntdT02,
  'icon_button-antd-T03': AntdT03,
  'icon_button-antd-T04': AntdT04,
  'icon_button-antd-T05': AntdT05,
  'icon_button-antd-T06': AntdT06,
  'icon_button-antd-T07': AntdT07,
  'icon_button-antd-T08': AntdT08,
  'icon_button-antd-T09': AntdT09,
  'icon_button-antd-T10': AntdT10,
  // MUI tasks
  'icon_button-mui-T01': MuiT01,
  'icon_button-mui-T02': MuiT02,
  'icon_button-mui-T03': MuiT03,
  'icon_button-mui-T04': MuiT04,
  'icon_button-mui-T05': MuiT05,
  'icon_button-mui-T06': MuiT06,
  'icon_button-mui-T07': MuiT07,
  'icon_button-mui-T08': MuiT08,
  'icon_button-mui-T09': MuiT09,
  'icon_button-mui-T10': MuiT10,
  // Mantine tasks
  'icon_button-mantine-T01': MantineT01,
  'icon_button-mantine-T02': MantineT02,
  'icon_button-mantine-T03': MantineT03,
  'icon_button-mantine-T04': MantineT04,
  'icon_button-mantine-T05': MantineT05,
  'icon_button-mantine-T06': MantineT06,
  'icon_button-mantine-T07': MantineT07,
  'icon_button-mantine-T08': MantineT08,
  'icon_button-mantine-T09': MantineT09,
  'icon_button-mantine-T10': MantineT10,
};

export default function IconButtonTaskRunner({ task }: IconButtonTaskRunnerProps) {
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
