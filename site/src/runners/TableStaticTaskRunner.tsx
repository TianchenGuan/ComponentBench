'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './table_static/antd/T01';
import AntdT02 from './table_static/antd/T02';
import AntdT03 from './table_static/antd/T03';
import AntdT04 from './table_static/antd/T04';
import AntdT05 from './table_static/antd/T05';
import AntdT06 from './table_static/antd/T06';
import AntdT07 from './table_static/antd/T07';
import AntdT08 from './table_static/antd/T08';
import AntdT09 from './table_static/antd/T09';
import AntdT10 from './table_static/antd/T10';

// Import task-specific components for mui
import MuiT01 from './table_static/mui/T01';
import MuiT02 from './table_static/mui/T02';
import MuiT03 from './table_static/mui/T03';
import MuiT04 from './table_static/mui/T04';
import MuiT05 from './table_static/mui/T05';
import MuiT06 from './table_static/mui/T06';
import MuiT07 from './table_static/mui/T07';
import MuiT08 from './table_static/mui/T08';
import MuiT09 from './table_static/mui/T09';
import MuiT10 from './table_static/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './table_static/mantine/T01';
import MantineT02 from './table_static/mantine/T02';
import MantineT03 from './table_static/mantine/T03';
import MantineT04 from './table_static/mantine/T04';
import MantineT05 from './table_static/mantine/T05';
import MantineT06 from './table_static/mantine/T06';
import MantineT07 from './table_static/mantine/T07';
import MantineT08 from './table_static/mantine/T08';
import MantineT09 from './table_static/mantine/T09';
import MantineT10 from './table_static/mantine/T10';

interface TableStaticTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'table_static-antd-T01': AntdT01,
  'table_static-antd-T02': AntdT02,
  'table_static-antd-T03': AntdT03,
  'table_static-antd-T04': AntdT04,
  'table_static-antd-T05': AntdT05,
  'table_static-antd-T06': AntdT06,
  'table_static-antd-T07': AntdT07,
  'table_static-antd-T08': AntdT08,
  'table_static-antd-T09': AntdT09,
  'table_static-antd-T10': AntdT10,
  // MUI tasks
  'table_static-mui-T01': MuiT01,
  'table_static-mui-T02': MuiT02,
  'table_static-mui-T03': MuiT03,
  'table_static-mui-T04': MuiT04,
  'table_static-mui-T05': MuiT05,
  'table_static-mui-T06': MuiT06,
  'table_static-mui-T07': MuiT07,
  'table_static-mui-T08': MuiT08,
  'table_static-mui-T09': MuiT09,
  'table_static-mui-T10': MuiT10,
  // Mantine tasks
  'table_static-mantine-T01': MantineT01,
  'table_static-mantine-T02': MantineT02,
  'table_static-mantine-T03': MantineT03,
  'table_static-mantine-T04': MantineT04,
  'table_static-mantine-T05': MantineT05,
  'table_static-mantine-T06': MantineT06,
  'table_static-mantine-T07': MantineT07,
  'table_static-mantine-T08': MantineT08,
  'table_static-mantine-T09': MantineT09,
  'table_static-mantine-T10': MantineT10,
};

export default function TableStaticTaskRunner({ task }: TableStaticTaskRunnerProps) {
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
