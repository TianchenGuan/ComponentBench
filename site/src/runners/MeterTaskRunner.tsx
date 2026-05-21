'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './meter/antd/T01';
import AntdT02 from './meter/antd/T02';
import AntdT03 from './meter/antd/T03';
import AntdT04 from './meter/antd/T04';
import AntdT05 from './meter/antd/T05';
import AntdT06 from './meter/antd/T06';
import AntdT07 from './meter/antd/T07';
import AntdT08 from './meter/antd/T08';
import AntdT09 from './meter/antd/T09';
import AntdT10 from './meter/antd/T10';

// Import task-specific components for mui
import MuiT01 from './meter/mui/T01';
import MuiT02 from './meter/mui/T02';
import MuiT03 from './meter/mui/T03';
import MuiT04 from './meter/mui/T04';
import MuiT05 from './meter/mui/T05';
import MuiT06 from './meter/mui/T06';
import MuiT07 from './meter/mui/T07';
import MuiT08 from './meter/mui/T08';
import MuiT09 from './meter/mui/T09';
import MuiT10 from './meter/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './meter/mantine/T01';
import MantineT02 from './meter/mantine/T02';
import MantineT03 from './meter/mantine/T03';
import MantineT04 from './meter/mantine/T04';
import MantineT05 from './meter/mantine/T05';
import MantineT06 from './meter/mantine/T06';
import MantineT07 from './meter/mantine/T07';
import MantineT08 from './meter/mantine/T08';
import MantineT09 from './meter/mantine/T09';
import MantineT10 from './meter/mantine/T10';

interface MeterTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'meter-antd-T01': AntdT01,
  'meter-antd-T02': AntdT02,
  'meter-antd-T03': AntdT03,
  'meter-antd-T04': AntdT04,
  'meter-antd-T05': AntdT05,
  'meter-antd-T06': AntdT06,
  'meter-antd-T07': AntdT07,
  'meter-antd-T08': AntdT08,
  'meter-antd-T09': AntdT09,
  'meter-antd-T10': AntdT10,
  // MUI tasks
  'meter-mui-T01': MuiT01,
  'meter-mui-T02': MuiT02,
  'meter-mui-T03': MuiT03,
  'meter-mui-T04': MuiT04,
  'meter-mui-T05': MuiT05,
  'meter-mui-T06': MuiT06,
  'meter-mui-T07': MuiT07,
  'meter-mui-T08': MuiT08,
  'meter-mui-T09': MuiT09,
  'meter-mui-T10': MuiT10,
  // Mantine tasks
  'meter-mantine-T01': MantineT01,
  'meter-mantine-T02': MantineT02,
  'meter-mantine-T03': MantineT03,
  'meter-mantine-T04': MantineT04,
  'meter-mantine-T05': MantineT05,
  'meter-mantine-T06': MantineT06,
  'meter-mantine-T07': MantineT07,
  'meter-mantine-T08': MantineT08,
  'meter-mantine-T09': MantineT09,
  'meter-mantine-T10': MantineT10,
};

export default function MeterTaskRunner({ task }: MeterTaskRunnerProps) {
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
