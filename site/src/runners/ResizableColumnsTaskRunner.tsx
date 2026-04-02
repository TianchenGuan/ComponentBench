'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './resizable_columns/antd/T01';
import AntdT02 from './resizable_columns/antd/T02';
import AntdT03 from './resizable_columns/antd/T03';
import AntdT04 from './resizable_columns/antd/T04';
import AntdT05 from './resizable_columns/antd/T05';
import AntdT06 from './resizable_columns/antd/T06';
import AntdT07 from './resizable_columns/antd/T07';
import AntdT08 from './resizable_columns/antd/T08';
import AntdT09 from './resizable_columns/antd/T09';
import AntdT10 from './resizable_columns/antd/T10';
import AntdV2T01 from './resizable_columns/antd/v2/T01';
import AntdV2T02 from './resizable_columns/antd/v2/T02';
import AntdV2T03 from './resizable_columns/antd/v2/T03';
import AntdV2T04 from './resizable_columns/antd/v2/T04';
import AntdV2T05 from './resizable_columns/antd/v2/T05';
import AntdV2T06 from './resizable_columns/antd/v2/T06';
import AntdV2T07 from './resizable_columns/antd/v2/T07';
import AntdV2T08 from './resizable_columns/antd/v2/T08';

// Import task-specific components for mui
import MuiT01 from './resizable_columns/mui/T01';
import MuiT02 from './resizable_columns/mui/T02';
import MuiT03 from './resizable_columns/mui/T03';
import MuiT04 from './resizable_columns/mui/T04';
import MuiT05 from './resizable_columns/mui/T05';
import MuiT06 from './resizable_columns/mui/T06';
import MuiT07 from './resizable_columns/mui/T07';
import MuiT08 from './resizable_columns/mui/T08';
import MuiT09 from './resizable_columns/mui/T09';
import MuiT10 from './resizable_columns/mui/T10';
import MuiV2T01 from './resizable_columns/mui/v2/T01';
import MuiV2T02 from './resizable_columns/mui/v2/T02';
import MuiV2T03 from './resizable_columns/mui/v2/T03';
import MuiV2T04 from './resizable_columns/mui/v2/T04';
import MuiV2T05 from './resizable_columns/mui/v2/T05';
import MuiV2T06 from './resizable_columns/mui/v2/T06';
import MuiV2T07 from './resizable_columns/mui/v2/T07';
import MuiV2T08 from './resizable_columns/mui/v2/T08';

// Import task-specific components for mantine
import MantineT01 from './resizable_columns/mantine/T01';
import MantineT02 from './resizable_columns/mantine/T02';
import MantineT03 from './resizable_columns/mantine/T03';
import MantineT04 from './resizable_columns/mantine/T04';
import MantineT05 from './resizable_columns/mantine/T05';
import MantineT06 from './resizable_columns/mantine/T06';
import MantineT07 from './resizable_columns/mantine/T07';
import MantineT08 from './resizable_columns/mantine/T08';
import MantineT09 from './resizable_columns/mantine/T09';
import MantineT10 from './resizable_columns/mantine/T10';
import MantineV2T01 from './resizable_columns/mantine/v2/T01';
import MantineV2T02 from './resizable_columns/mantine/v2/T02';
import MantineV2T03 from './resizable_columns/mantine/v2/T03';
import MantineV2T04 from './resizable_columns/mantine/v2/T04';
import MantineV2T05 from './resizable_columns/mantine/v2/T05';
import MantineV2T06 from './resizable_columns/mantine/v2/T06';
import MantineV2T07 from './resizable_columns/mantine/v2/T07';
import MantineV2T08 from './resizable_columns/mantine/v2/T08';

interface ResizableColumnsTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'resizable_columns-antd-T01': AntdT01,
  'resizable_columns-antd-T02': AntdT02,
  'resizable_columns-antd-T03': AntdT03,
  'resizable_columns-antd-T04': AntdT04,
  'resizable_columns-antd-T05': AntdT05,
  'resizable_columns-antd-T06': AntdT06,
  'resizable_columns-antd-T07': AntdT07,
  'resizable_columns-antd-T08': AntdT08,
  'resizable_columns-antd-T09': AntdT09,
  'resizable_columns-antd-T10': AntdT10,
  'resizable_columns-antd-v2-T01': AntdV2T01,
  'resizable_columns-antd-v2-T02': AntdV2T02,
  'resizable_columns-antd-v2-T03': AntdV2T03,
  'resizable_columns-antd-v2-T04': AntdV2T04,
  'resizable_columns-antd-v2-T05': AntdV2T05,
  'resizable_columns-antd-v2-T06': AntdV2T06,
  'resizable_columns-antd-v2-T07': AntdV2T07,
  'resizable_columns-antd-v2-T08': AntdV2T08,
  // MUI tasks
  'resizable_columns-mui-T01': MuiT01,
  'resizable_columns-mui-T02': MuiT02,
  'resizable_columns-mui-T03': MuiT03,
  'resizable_columns-mui-T04': MuiT04,
  'resizable_columns-mui-T05': MuiT05,
  'resizable_columns-mui-T06': MuiT06,
  'resizable_columns-mui-T07': MuiT07,
  'resizable_columns-mui-T08': MuiT08,
  'resizable_columns-mui-T09': MuiT09,
  'resizable_columns-mui-T10': MuiT10,
  'resizable_columns-mui-v2-T01': MuiV2T01,
  'resizable_columns-mui-v2-T02': MuiV2T02,
  'resizable_columns-mui-v2-T03': MuiV2T03,
  'resizable_columns-mui-v2-T04': MuiV2T04,
  'resizable_columns-mui-v2-T05': MuiV2T05,
  'resizable_columns-mui-v2-T06': MuiV2T06,
  'resizable_columns-mui-v2-T07': MuiV2T07,
  'resizable_columns-mui-v2-T08': MuiV2T08,
  // Mantine tasks
  'resizable_columns-mantine-T01': MantineT01,
  'resizable_columns-mantine-T02': MantineT02,
  'resizable_columns-mantine-T03': MantineT03,
  'resizable_columns-mantine-T04': MantineT04,
  'resizable_columns-mantine-T05': MantineT05,
  'resizable_columns-mantine-T06': MantineT06,
  'resizable_columns-mantine-T07': MantineT07,
  'resizable_columns-mantine-T08': MantineT08,
  'resizable_columns-mantine-T09': MantineT09,
  'resizable_columns-mantine-T10': MantineT10,
  'resizable_columns-mantine-v2-T01': MantineV2T01,
  'resizable_columns-mantine-v2-T02': MantineV2T02,
  'resizable_columns-mantine-v2-T03': MantineV2T03,
  'resizable_columns-mantine-v2-T04': MantineV2T04,
  'resizable_columns-mantine-v2-T05': MantineV2T05,
  'resizable_columns-mantine-v2-T06': MantineV2T06,
  'resizable_columns-mantine-v2-T07': MantineV2T07,
  'resizable_columns-mantine-v2-T08': MantineV2T08,
};

export default function ResizableColumnsTaskRunner({ task }: ResizableColumnsTaskRunnerProps) {
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
