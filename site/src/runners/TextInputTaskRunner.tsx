'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './text_input/antd/T01';
import AntdT02 from './text_input/antd/T02';
import AntdT03 from './text_input/antd/T03';
import AntdT04 from './text_input/antd/T04';
import AntdT05 from './text_input/antd/T05';
import AntdT06 from './text_input/antd/T06';
import AntdT07 from './text_input/antd/T07';
import AntdT08 from './text_input/antd/T08';
import AntdT09 from './text_input/antd/T09';
import AntdT10 from './text_input/antd/T10';

// Import task-specific components for mui
import MuiT01 from './text_input/mui/T01';
import MuiT02 from './text_input/mui/T02';
import MuiT03 from './text_input/mui/T03';
import MuiT04 from './text_input/mui/T04';
import MuiT05 from './text_input/mui/T05';
import MuiT06 from './text_input/mui/T06';
import MuiT07 from './text_input/mui/T07';
import MuiT08 from './text_input/mui/T08';
import MuiT09 from './text_input/mui/T09';
import MuiT10 from './text_input/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './text_input/mantine/T01';
import MantineT02 from './text_input/mantine/T02';
import MantineT03 from './text_input/mantine/T03';
import MantineT04 from './text_input/mantine/T04';
import MantineT05 from './text_input/mantine/T05';
import MantineT06 from './text_input/mantine/T06';
import MantineT07 from './text_input/mantine/T07';
import MantineT08 from './text_input/mantine/T08';
import MantineT09 from './text_input/mantine/T09';
import MantineT10 from './text_input/mantine/T10';

interface TextInputTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'text_input-antd-T01': AntdT01,
  'text_input-antd-T02': AntdT02,
  'text_input-antd-T03': AntdT03,
  'text_input-antd-T04': AntdT04,
  'text_input-antd-T05': AntdT05,
  'text_input-antd-T06': AntdT06,
  'text_input-antd-T07': AntdT07,
  'text_input-antd-T08': AntdT08,
  'text_input-antd-T09': AntdT09,
  'text_input-antd-T10': AntdT10,
  // MUI tasks
  'text_input-mui-T01': MuiT01,
  'text_input-mui-T02': MuiT02,
  'text_input-mui-T03': MuiT03,
  'text_input-mui-T04': MuiT04,
  'text_input-mui-T05': MuiT05,
  'text_input-mui-T06': MuiT06,
  'text_input-mui-T07': MuiT07,
  'text_input-mui-T08': MuiT08,
  'text_input-mui-T09': MuiT09,
  'text_input-mui-T10': MuiT10,
  // Mantine tasks
  'text_input-mantine-T01': MantineT01,
  'text_input-mantine-T02': MantineT02,
  'text_input-mantine-T03': MantineT03,
  'text_input-mantine-T04': MantineT04,
  'text_input-mantine-T05': MantineT05,
  'text_input-mantine-T06': MantineT06,
  'text_input-mantine-T07': MantineT07,
  'text_input-mantine-T08': MantineT08,
  'text_input-mantine-T09': MantineT09,
  'text_input-mantine-T10': MantineT10,
};

export default function TextInputTaskRunner({ task }: TextInputTaskRunnerProps) {
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
