'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './tooltip/antd/T01';
import AntdT02 from './tooltip/antd/T02';
import AntdT03 from './tooltip/antd/T03';
import AntdT04 from './tooltip/antd/T04';
import AntdT05 from './tooltip/antd/T05';
import AntdT06 from './tooltip/antd/T06';
import AntdT07 from './tooltip/antd/T07';
import AntdT08 from './tooltip/antd/T08';
import AntdT09 from './tooltip/antd/T09';
import AntdT10 from './tooltip/antd/T10';

// Import task-specific components for mui
import MuiT01 from './tooltip/mui/T01';
import MuiT02 from './tooltip/mui/T02';
import MuiT03 from './tooltip/mui/T03';
import MuiT04 from './tooltip/mui/T04';
import MuiT05 from './tooltip/mui/T05';
import MuiT06 from './tooltip/mui/T06';
import MuiT07 from './tooltip/mui/T07';
import MuiT08 from './tooltip/mui/T08';
import MuiT09 from './tooltip/mui/T09';
import MuiT10 from './tooltip/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './tooltip/mantine/T01';
import MantineT02 from './tooltip/mantine/T02';
import MantineT03 from './tooltip/mantine/T03';
import MantineT04 from './tooltip/mantine/T04';
import MantineT05 from './tooltip/mantine/T05';
import MantineT06 from './tooltip/mantine/T06';
import MantineT07 from './tooltip/mantine/T07';
import MantineT08 from './tooltip/mantine/T08';
import MantineT09 from './tooltip/mantine/T09';
import MantineT10 from './tooltip/mantine/T10';

interface TooltipTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'tooltip-antd-T01': AntdT01,
  'tooltip-antd-T02': AntdT02,
  'tooltip-antd-T03': AntdT03,
  'tooltip-antd-T04': AntdT04,
  'tooltip-antd-T05': AntdT05,
  'tooltip-antd-T06': AntdT06,
  'tooltip-antd-T07': AntdT07,
  'tooltip-antd-T08': AntdT08,
  'tooltip-antd-T09': AntdT09,
  'tooltip-antd-T10': AntdT10,
  // MUI tasks
  'tooltip-mui-T01': MuiT01,
  'tooltip-mui-T02': MuiT02,
  'tooltip-mui-T03': MuiT03,
  'tooltip-mui-T04': MuiT04,
  'tooltip-mui-T05': MuiT05,
  'tooltip-mui-T06': MuiT06,
  'tooltip-mui-T07': MuiT07,
  'tooltip-mui-T08': MuiT08,
  'tooltip-mui-T09': MuiT09,
  'tooltip-mui-T10': MuiT10,
  // Mantine tasks
  'tooltip-mantine-T01': MantineT01,
  'tooltip-mantine-T02': MantineT02,
  'tooltip-mantine-T03': MantineT03,
  'tooltip-mantine-T04': MantineT04,
  'tooltip-mantine-T05': MantineT05,
  'tooltip-mantine-T06': MantineT06,
  'tooltip-mantine-T07': MantineT07,
  'tooltip-mantine-T08': MantineT08,
  'tooltip-mantine-T09': MantineT09,
  'tooltip-mantine-T10': MantineT10,
};

export default function TooltipTaskRunner({ task }: TooltipTaskRunnerProps) {
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
