'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './popover/antd/T01';
import AntdT02 from './popover/antd/T02';
import AntdT03 from './popover/antd/T03';
import AntdT04 from './popover/antd/T04';
import AntdT05 from './popover/antd/T05';
import AntdT06 from './popover/antd/T06';
import AntdT07 from './popover/antd/T07';
import AntdT08 from './popover/antd/T08';
import AntdT09 from './popover/antd/T09';
import AntdT10 from './popover/antd/T10';

// Import task-specific components for mui
import MuiT01 from './popover/mui/T01';
import MuiT02 from './popover/mui/T02';
import MuiT03 from './popover/mui/T03';
import MuiT04 from './popover/mui/T04';
import MuiT05 from './popover/mui/T05';
import MuiT06 from './popover/mui/T06';
import MuiT07 from './popover/mui/T07';
import MuiT08 from './popover/mui/T08';
import MuiT09 from './popover/mui/T09';
import MuiT10 from './popover/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './popover/mantine/T01';
import MantineT02 from './popover/mantine/T02';
import MantineT03 from './popover/mantine/T03';
import MantineT04 from './popover/mantine/T04';
import MantineT05 from './popover/mantine/T05';
import MantineT06 from './popover/mantine/T06';
import MantineT07 from './popover/mantine/T07';
import MantineT08 from './popover/mantine/T08';
import MantineT09 from './popover/mantine/T09';
import MantineT10 from './popover/mantine/T10';

interface PopoverTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'popover-antd-T01': AntdT01,
  'popover-antd-T02': AntdT02,
  'popover-antd-T03': AntdT03,
  'popover-antd-T04': AntdT04,
  'popover-antd-T05': AntdT05,
  'popover-antd-T06': AntdT06,
  'popover-antd-T07': AntdT07,
  'popover-antd-T08': AntdT08,
  'popover-antd-T09': AntdT09,
  'popover-antd-T10': AntdT10,
  // MUI tasks
  'popover-mui-T01': MuiT01,
  'popover-mui-T02': MuiT02,
  'popover-mui-T03': MuiT03,
  'popover-mui-T04': MuiT04,
  'popover-mui-T05': MuiT05,
  'popover-mui-T06': MuiT06,
  'popover-mui-T07': MuiT07,
  'popover-mui-T08': MuiT08,
  'popover-mui-T09': MuiT09,
  'popover-mui-T10': MuiT10,
  // Mantine tasks
  'popover-mantine-T01': MantineT01,
  'popover-mantine-T02': MantineT02,
  'popover-mantine-T03': MantineT03,
  'popover-mantine-T04': MantineT04,
  'popover-mantine-T05': MantineT05,
  'popover-mantine-T06': MantineT06,
  'popover-mantine-T07': MantineT07,
  'popover-mantine-T08': MantineT08,
  'popover-mantine-T09': MantineT09,
  'popover-mantine-T10': MantineT10,
};

export default function PopoverTaskRunner({ task }: PopoverTaskRunnerProps) {
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
