'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './breadcrumb/antd/T01';
import AntdT02 from './breadcrumb/antd/T02';
import AntdT03 from './breadcrumb/antd/T03';
import AntdT04 from './breadcrumb/antd/T04';
import AntdT05 from './breadcrumb/antd/T05';
import AntdT06 from './breadcrumb/antd/T06';
import AntdT07 from './breadcrumb/antd/T07';
import AntdT08 from './breadcrumb/antd/T08';
import AntdT09 from './breadcrumb/antd/T09';
import AntdT10 from './breadcrumb/antd/T10';

// Import task-specific components for mui
import MuiT01 from './breadcrumb/mui/T01';
import MuiT02 from './breadcrumb/mui/T02';
import MuiT03 from './breadcrumb/mui/T03';
import MuiT04 from './breadcrumb/mui/T04';
import MuiT05 from './breadcrumb/mui/T05';
import MuiT06 from './breadcrumb/mui/T06';
import MuiT07 from './breadcrumb/mui/T07';
import MuiT08 from './breadcrumb/mui/T08';
import MuiT09 from './breadcrumb/mui/T09';
import MuiT10 from './breadcrumb/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './breadcrumb/mantine/T01';
import MantineT02 from './breadcrumb/mantine/T02';
import MantineT03 from './breadcrumb/mantine/T03';
import MantineT04 from './breadcrumb/mantine/T04';
import MantineT05 from './breadcrumb/mantine/T05';
import MantineT06 from './breadcrumb/mantine/T06';
import MantineT07 from './breadcrumb/mantine/T07';
import MantineT08 from './breadcrumb/mantine/T08';
import MantineT09 from './breadcrumb/mantine/T09';
import MantineT10 from './breadcrumb/mantine/T10';

interface BreadcrumbTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'breadcrumb-antd-T01': AntdT01,
  'breadcrumb-antd-T02': AntdT02,
  'breadcrumb-antd-T03': AntdT03,
  'breadcrumb-antd-T04': AntdT04,
  'breadcrumb-antd-T05': AntdT05,
  'breadcrumb-antd-T06': AntdT06,
  'breadcrumb-antd-T07': AntdT07,
  'breadcrumb-antd-T08': AntdT08,
  'breadcrumb-antd-T09': AntdT09,
  'breadcrumb-antd-T10': AntdT10,
  // MUI tasks
  'breadcrumb-mui-T01': MuiT01,
  'breadcrumb-mui-T02': MuiT02,
  'breadcrumb-mui-T03': MuiT03,
  'breadcrumb-mui-T04': MuiT04,
  'breadcrumb-mui-T05': MuiT05,
  'breadcrumb-mui-T06': MuiT06,
  'breadcrumb-mui-T07': MuiT07,
  'breadcrumb-mui-T08': MuiT08,
  'breadcrumb-mui-T09': MuiT09,
  'breadcrumb-mui-T10': MuiT10,
  // Mantine tasks
  'breadcrumb-mantine-T01': MantineT01,
  'breadcrumb-mantine-T02': MantineT02,
  'breadcrumb-mantine-T03': MantineT03,
  'breadcrumb-mantine-T04': MantineT04,
  'breadcrumb-mantine-T05': MantineT05,
  'breadcrumb-mantine-T06': MantineT06,
  'breadcrumb-mantine-T07': MantineT07,
  'breadcrumb-mantine-T08': MantineT08,
  'breadcrumb-mantine-T09': MantineT09,
  'breadcrumb-mantine-T10': MantineT10,
};

export default function BreadcrumbTaskRunner({ task }: BreadcrumbTaskRunnerProps) {
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
