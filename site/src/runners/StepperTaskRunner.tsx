'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './stepper/antd/T01';
import AntdT02 from './stepper/antd/T02';
import AntdT03 from './stepper/antd/T03';
import AntdT04 from './stepper/antd/T04';
import AntdT05 from './stepper/antd/T05';
import AntdT06 from './stepper/antd/T06';
import AntdT07 from './stepper/antd/T07';
import AntdT08 from './stepper/antd/T08';
import AntdT09 from './stepper/antd/T09';
import AntdT10 from './stepper/antd/T10';

// Import task-specific components for mui
import MuiT01 from './stepper/mui/T01';
import MuiT02 from './stepper/mui/T02';
import MuiT03 from './stepper/mui/T03';
import MuiT04 from './stepper/mui/T04';
import MuiT05 from './stepper/mui/T05';
import MuiT06 from './stepper/mui/T06';
import MuiT07 from './stepper/mui/T07';
import MuiT08 from './stepper/mui/T08';
import MuiT09 from './stepper/mui/T09';
import MuiT10 from './stepper/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './stepper/mantine/T01';
import MantineT02 from './stepper/mantine/T02';
import MantineT03 from './stepper/mantine/T03';
import MantineT04 from './stepper/mantine/T04';
import MantineT05 from './stepper/mantine/T05';
import MantineT06 from './stepper/mantine/T06';
import MantineT07 from './stepper/mantine/T07';
import MantineT08 from './stepper/mantine/T08';
import MantineT09 from './stepper/mantine/T09';
import MantineT10 from './stepper/mantine/T10';

interface StepperTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'stepper-antd-T01': AntdT01,
  'stepper-antd-T02': AntdT02,
  'stepper-antd-T03': AntdT03,
  'stepper-antd-T04': AntdT04,
  'stepper-antd-T05': AntdT05,
  'stepper-antd-T06': AntdT06,
  'stepper-antd-T07': AntdT07,
  'stepper-antd-T08': AntdT08,
  'stepper-antd-T09': AntdT09,
  'stepper-antd-T10': AntdT10,
  // MUI tasks
  'stepper-mui-T01': MuiT01,
  'stepper-mui-T02': MuiT02,
  'stepper-mui-T03': MuiT03,
  'stepper-mui-T04': MuiT04,
  'stepper-mui-T05': MuiT05,
  'stepper-mui-T06': MuiT06,
  'stepper-mui-T07': MuiT07,
  'stepper-mui-T08': MuiT08,
  'stepper-mui-T09': MuiT09,
  'stepper-mui-T10': MuiT10,
  // Mantine tasks
  'stepper-mantine-T01': MantineT01,
  'stepper-mantine-T02': MantineT02,
  'stepper-mantine-T03': MantineT03,
  'stepper-mantine-T04': MantineT04,
  'stepper-mantine-T05': MantineT05,
  'stepper-mantine-T06': MantineT06,
  'stepper-mantine-T07': MantineT07,
  'stepper-mantine-T08': MantineT08,
  'stepper-mantine-T09': MantineT09,
  'stepper-mantine-T10': MantineT10,
};

export default function StepperTaskRunner({ task }: StepperTaskRunnerProps) {
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
