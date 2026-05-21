'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './checkbox/antd/T01';
import AntdT02 from './checkbox/antd/T02';
import AntdT03 from './checkbox/antd/T03';
import AntdT04 from './checkbox/antd/T04';
import AntdT05 from './checkbox/antd/T05';
import AntdT06 from './checkbox/antd/T06';
import AntdT07 from './checkbox/antd/T07';
import AntdT08 from './checkbox/antd/T08';
import AntdT09 from './checkbox/antd/T09';
import AntdT10 from './checkbox/antd/T10';

// Import task-specific components for mui
import MuiT01 from './checkbox/mui/T01';
import MuiT02 from './checkbox/mui/T02';
import MuiT03 from './checkbox/mui/T03';
import MuiT04 from './checkbox/mui/T04';
import MuiT05 from './checkbox/mui/T05';
import MuiT06 from './checkbox/mui/T06';
import MuiT07 from './checkbox/mui/T07';
import MuiT08 from './checkbox/mui/T08';
import MuiT09 from './checkbox/mui/T09';
import MuiT10 from './checkbox/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './checkbox/mantine/T01';
import MantineT02 from './checkbox/mantine/T02';
import MantineT03 from './checkbox/mantine/T03';
import MantineT04 from './checkbox/mantine/T04';
import MantineT05 from './checkbox/mantine/T05';
import MantineT06 from './checkbox/mantine/T06';
import MantineT07 from './checkbox/mantine/T07';
import MantineT08 from './checkbox/mantine/T08';
import MantineT09 from './checkbox/mantine/T09';
import MantineT10 from './checkbox/mantine/T10';

interface CheckboxTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'checkbox-antd-T01': AntdT01,
  'checkbox-antd-T02': AntdT02,
  'checkbox-antd-T03': AntdT03,
  'checkbox-antd-T04': AntdT04,
  'checkbox-antd-T05': AntdT05,
  'checkbox-antd-T06': AntdT06,
  'checkbox-antd-T07': AntdT07,
  'checkbox-antd-T08': AntdT08,
  'checkbox-antd-T09': AntdT09,
  'checkbox-antd-T10': AntdT10,
  // MUI tasks
  'checkbox-mui-T01': MuiT01,
  'checkbox-mui-T02': MuiT02,
  'checkbox-mui-T03': MuiT03,
  'checkbox-mui-T04': MuiT04,
  'checkbox-mui-T05': MuiT05,
  'checkbox-mui-T06': MuiT06,
  'checkbox-mui-T07': MuiT07,
  'checkbox-mui-T08': MuiT08,
  'checkbox-mui-T09': MuiT09,
  'checkbox-mui-T10': MuiT10,
  // Mantine tasks
  'checkbox-mantine-T01': MantineT01,
  'checkbox-mantine-T02': MantineT02,
  'checkbox-mantine-T03': MantineT03,
  'checkbox-mantine-T04': MantineT04,
  'checkbox-mantine-T05': MantineT05,
  'checkbox-mantine-T06': MantineT06,
  'checkbox-mantine-T07': MantineT07,
  'checkbox-mantine-T08': MantineT08,
  'checkbox-mantine-T09': MantineT09,
  'checkbox-mantine-T10': MantineT10,
};

export default function CheckboxTaskRunner({ task }: CheckboxTaskRunnerProps) {
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
