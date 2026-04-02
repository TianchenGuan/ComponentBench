'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './textarea/antd/T01';
import AntdT02 from './textarea/antd/T02';
import AntdT03 from './textarea/antd/T03';
import AntdT04 from './textarea/antd/T04';
import AntdT05 from './textarea/antd/T05';
import AntdT06 from './textarea/antd/T06';
import AntdT07 from './textarea/antd/T07';
import AntdT08 from './textarea/antd/T08';
import AntdT09 from './textarea/antd/T09';
import AntdT10 from './textarea/antd/T10';

// Import task-specific components for mui
import MuiT01 from './textarea/mui/T01';
import MuiT02 from './textarea/mui/T02';
import MuiT03 from './textarea/mui/T03';
import MuiT04 from './textarea/mui/T04';
import MuiT05 from './textarea/mui/T05';
import MuiT06 from './textarea/mui/T06';
import MuiT07 from './textarea/mui/T07';
import MuiT08 from './textarea/mui/T08';
import MuiT09 from './textarea/mui/T09';
import MuiT10 from './textarea/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './textarea/mantine/T01';
import MantineT02 from './textarea/mantine/T02';
import MantineT03 from './textarea/mantine/T03';
import MantineT04 from './textarea/mantine/T04';
import MantineT05 from './textarea/mantine/T05';
import MantineT06 from './textarea/mantine/T06';
import MantineT07 from './textarea/mantine/T07';
import MantineT08 from './textarea/mantine/T08';
import MantineT09 from './textarea/mantine/T09';
import MantineT10 from './textarea/mantine/T10';

interface TextareaTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'textarea-antd-T01': AntdT01,
  'textarea-antd-T02': AntdT02,
  'textarea-antd-T03': AntdT03,
  'textarea-antd-T04': AntdT04,
  'textarea-antd-T05': AntdT05,
  'textarea-antd-T06': AntdT06,
  'textarea-antd-T07': AntdT07,
  'textarea-antd-T08': AntdT08,
  'textarea-antd-T09': AntdT09,
  'textarea-antd-T10': AntdT10,
  // MUI tasks
  'textarea-mui-T01': MuiT01,
  'textarea-mui-T02': MuiT02,
  'textarea-mui-T03': MuiT03,
  'textarea-mui-T04': MuiT04,
  'textarea-mui-T05': MuiT05,
  'textarea-mui-T06': MuiT06,
  'textarea-mui-T07': MuiT07,
  'textarea-mui-T08': MuiT08,
  'textarea-mui-T09': MuiT09,
  'textarea-mui-T10': MuiT10,
  // Mantine tasks
  'textarea-mantine-T01': MantineT01,
  'textarea-mantine-T02': MantineT02,
  'textarea-mantine-T03': MantineT03,
  'textarea-mantine-T04': MantineT04,
  'textarea-mantine-T05': MantineT05,
  'textarea-mantine-T06': MantineT06,
  'textarea-mantine-T07': MantineT07,
  'textarea-mantine-T08': MantineT08,
  'textarea-mantine-T09': MantineT09,
  'textarea-mantine-T10': MantineT10,
};

export default function TextareaTaskRunner({ task }: TextareaTaskRunnerProps) {
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
