'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './pagination/antd/T01';
import AntdT02 from './pagination/antd/T02';
import AntdT03 from './pagination/antd/T03';
import AntdT04 from './pagination/antd/T04';
import AntdT05 from './pagination/antd/T05';
import AntdT06 from './pagination/antd/T06';
import AntdT07 from './pagination/antd/T07';
import AntdT08 from './pagination/antd/T08';
import AntdT09 from './pagination/antd/T09';
import AntdT10 from './pagination/antd/T10';

// Import task-specific components for mui
import MuiT01 from './pagination/mui/T01';
import MuiT02 from './pagination/mui/T02';
import MuiT03 from './pagination/mui/T03';
import MuiT04 from './pagination/mui/T04';
import MuiT05 from './pagination/mui/T05';
import MuiT06 from './pagination/mui/T06';
import MuiT07 from './pagination/mui/T07';
import MuiT08 from './pagination/mui/T08';
import MuiT09 from './pagination/mui/T09';
import MuiT10 from './pagination/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './pagination/mantine/T01';
import MantineT02 from './pagination/mantine/T02';
import MantineT03 from './pagination/mantine/T03';
import MantineT04 from './pagination/mantine/T04';
import MantineT05 from './pagination/mantine/T05';
import MantineT06 from './pagination/mantine/T06';
import MantineT07 from './pagination/mantine/T07';
import MantineT08 from './pagination/mantine/T08';
import MantineT09 from './pagination/mantine/T09';
import MantineT10 from './pagination/mantine/T10';

interface PaginationTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'pagination-antd-T01': AntdT01,
  'pagination-antd-T02': AntdT02,
  'pagination-antd-T03': AntdT03,
  'pagination-antd-T04': AntdT04,
  'pagination-antd-T05': AntdT05,
  'pagination-antd-T06': AntdT06,
  'pagination-antd-T07': AntdT07,
  'pagination-antd-T08': AntdT08,
  'pagination-antd-T09': AntdT09,
  'pagination-antd-T10': AntdT10,
  // MUI tasks
  'pagination-mui-T01': MuiT01,
  'pagination-mui-T02': MuiT02,
  'pagination-mui-T03': MuiT03,
  'pagination-mui-T04': MuiT04,
  'pagination-mui-T05': MuiT05,
  'pagination-mui-T06': MuiT06,
  'pagination-mui-T07': MuiT07,
  'pagination-mui-T08': MuiT08,
  'pagination-mui-T09': MuiT09,
  'pagination-mui-T10': MuiT10,
  // Mantine tasks
  'pagination-mantine-T01': MantineT01,
  'pagination-mantine-T02': MantineT02,
  'pagination-mantine-T03': MantineT03,
  'pagination-mantine-T04': MantineT04,
  'pagination-mantine-T05': MantineT05,
  'pagination-mantine-T06': MantineT06,
  'pagination-mantine-T07': MantineT07,
  'pagination-mantine-T08': MantineT08,
  'pagination-mantine-T09': MantineT09,
  'pagination-mantine-T10': MantineT10,
};

export default function PaginationTaskRunner({ task }: PaginationTaskRunnerProps) {
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
