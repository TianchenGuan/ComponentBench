'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './segmented_control/antd/T01';
import AntdT02 from './segmented_control/antd/T02';
import AntdT03 from './segmented_control/antd/T03';
import AntdT04 from './segmented_control/antd/T04';
import AntdT05 from './segmented_control/antd/T05';
import AntdT06 from './segmented_control/antd/T06';
import AntdT07 from './segmented_control/antd/T07';
import AntdT08 from './segmented_control/antd/T08';
import AntdT09 from './segmented_control/antd/T09';
import AntdT10 from './segmented_control/antd/T10';

// Import task-specific components for mui
import MuiT01 from './segmented_control/mui/T01';
import MuiT02 from './segmented_control/mui/T02';
import MuiT03 from './segmented_control/mui/T03';
import MuiT04 from './segmented_control/mui/T04';
import MuiT05 from './segmented_control/mui/T05';
import MuiT06 from './segmented_control/mui/T06';
import MuiT07 from './segmented_control/mui/T07';
import MuiT08 from './segmented_control/mui/T08';
import MuiT09 from './segmented_control/mui/T09';
import MuiT10 from './segmented_control/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './segmented_control/mantine/T01';
import MantineT02 from './segmented_control/mantine/T02';
import MantineT03 from './segmented_control/mantine/T03';
import MantineT04 from './segmented_control/mantine/T04';
import MantineT05 from './segmented_control/mantine/T05';
import MantineT06 from './segmented_control/mantine/T06';
import MantineT07 from './segmented_control/mantine/T07';
import MantineT08 from './segmented_control/mantine/T08';
import MantineT09 from './segmented_control/mantine/T09';
import MantineT10 from './segmented_control/mantine/T10';

interface SegmentedControlTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'segmented_control-antd-T01': AntdT01,
  'segmented_control-antd-T02': AntdT02,
  'segmented_control-antd-T03': AntdT03,
  'segmented_control-antd-T04': AntdT04,
  'segmented_control-antd-T05': AntdT05,
  'segmented_control-antd-T06': AntdT06,
  'segmented_control-antd-T07': AntdT07,
  'segmented_control-antd-T08': AntdT08,
  'segmented_control-antd-T09': AntdT09,
  'segmented_control-antd-T10': AntdT10,
  // MUI tasks
  'segmented_control-mui-T01': MuiT01,
  'segmented_control-mui-T02': MuiT02,
  'segmented_control-mui-T03': MuiT03,
  'segmented_control-mui-T04': MuiT04,
  'segmented_control-mui-T05': MuiT05,
  'segmented_control-mui-T06': MuiT06,
  'segmented_control-mui-T07': MuiT07,
  'segmented_control-mui-T08': MuiT08,
  'segmented_control-mui-T09': MuiT09,
  'segmented_control-mui-T10': MuiT10,
  // Mantine tasks
  'segmented_control-mantine-T01': MantineT01,
  'segmented_control-mantine-T02': MantineT02,
  'segmented_control-mantine-T03': MantineT03,
  'segmented_control-mantine-T04': MantineT04,
  'segmented_control-mantine-T05': MantineT05,
  'segmented_control-mantine-T06': MantineT06,
  'segmented_control-mantine-T07': MantineT07,
  'segmented_control-mantine-T08': MantineT08,
  'segmented_control-mantine-T09': MantineT09,
  'segmented_control-mantine-T10': MantineT10,
};

export default function SegmentedControlTaskRunner({ task }: SegmentedControlTaskRunnerProps) {
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
