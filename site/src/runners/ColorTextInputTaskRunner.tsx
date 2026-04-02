'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './color_text_input/antd/T01';
import AntdT02 from './color_text_input/antd/T02';
import AntdT03 from './color_text_input/antd/T03';
import AntdT04 from './color_text_input/antd/T04';
import AntdT05 from './color_text_input/antd/T05';
import AntdT06 from './color_text_input/antd/T06';
import AntdT07 from './color_text_input/antd/T07';
import AntdT08 from './color_text_input/antd/T08';
import AntdT09 from './color_text_input/antd/T09';
import AntdT10 from './color_text_input/antd/T10';

// Import task-specific components for mui
import MuiT01 from './color_text_input/mui/T01';
import MuiT02 from './color_text_input/mui/T02';
import MuiT03 from './color_text_input/mui/T03';
import MuiT04 from './color_text_input/mui/T04';
import MuiT05 from './color_text_input/mui/T05';
import MuiT06 from './color_text_input/mui/T06';
import MuiT07 from './color_text_input/mui/T07';
import MuiT08 from './color_text_input/mui/T08';
import MuiT09 from './color_text_input/mui/T09';
import MuiT10 from './color_text_input/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './color_text_input/mantine/T01';
import MantineT02 from './color_text_input/mantine/T02';
import MantineT03 from './color_text_input/mantine/T03';
import MantineT04 from './color_text_input/mantine/T04';
import MantineT05 from './color_text_input/mantine/T05';
import MantineT06 from './color_text_input/mantine/T06';
import MantineT07 from './color_text_input/mantine/T07';
import MantineT08 from './color_text_input/mantine/T08';
import MantineT09 from './color_text_input/mantine/T09';
import MantineT10 from './color_text_input/mantine/T10';

interface ColorTextInputTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'color_text_input-antd-T01': AntdT01,
  'color_text_input-antd-T02': AntdT02,
  'color_text_input-antd-T03': AntdT03,
  'color_text_input-antd-T04': AntdT04,
  'color_text_input-antd-T05': AntdT05,
  'color_text_input-antd-T06': AntdT06,
  'color_text_input-antd-T07': AntdT07,
  'color_text_input-antd-T08': AntdT08,
  'color_text_input-antd-T09': AntdT09,
  'color_text_input-antd-T10': AntdT10,
  // MUI tasks
  'color_text_input-mui-T01': MuiT01,
  'color_text_input-mui-T02': MuiT02,
  'color_text_input-mui-T03': MuiT03,
  'color_text_input-mui-T04': MuiT04,
  'color_text_input-mui-T05': MuiT05,
  'color_text_input-mui-T06': MuiT06,
  'color_text_input-mui-T07': MuiT07,
  'color_text_input-mui-T08': MuiT08,
  'color_text_input-mui-T09': MuiT09,
  'color_text_input-mui-T10': MuiT10,
  // Mantine tasks
  'color_text_input-mantine-T01': MantineT01,
  'color_text_input-mantine-T02': MantineT02,
  'color_text_input-mantine-T03': MantineT03,
  'color_text_input-mantine-T04': MantineT04,
  'color_text_input-mantine-T05': MantineT05,
  'color_text_input-mantine-T06': MantineT06,
  'color_text_input-mantine-T07': MantineT07,
  'color_text_input-mantine-T08': MantineT08,
  'color_text_input-mantine-T09': MantineT09,
  'color_text_input-mantine-T10': MantineT10,
};

export default function ColorTextInputTaskRunner({ task }: ColorTextInputTaskRunnerProps) {
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
