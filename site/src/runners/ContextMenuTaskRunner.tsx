'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './context_menu/antd/T01';
import AntdT02 from './context_menu/antd/T02';
import AntdT03 from './context_menu/antd/T03';
import AntdT04 from './context_menu/antd/T04';
import AntdT05 from './context_menu/antd/T05';
import AntdT06 from './context_menu/antd/T06';
import AntdT07 from './context_menu/antd/T07';
import AntdT08 from './context_menu/antd/T08';
import AntdT09 from './context_menu/antd/T09';
import AntdT10 from './context_menu/antd/T10';
import AntdV2T01 from './context_menu/antd/v2/T01';
import AntdV2T02 from './context_menu/antd/v2/T02';
import AntdV2T03 from './context_menu/antd/v2/T03';
import AntdV2T04 from './context_menu/antd/v2/T04';
import AntdV2T05 from './context_menu/antd/v2/T05';
import AntdV2T06 from './context_menu/antd/v2/T06';
import AntdV2T07 from './context_menu/antd/v2/T07';
import AntdV2T08 from './context_menu/antd/v2/T08';
import AntdV2T09 from './context_menu/antd/v2/T09';
import AntdV2T10 from './context_menu/antd/v2/T10';
import AntdV2T11 from './context_menu/antd/v2/T11';
import AntdV2T12 from './context_menu/antd/v2/T12';
import AntdV2T13 from './context_menu/antd/v2/T13';
import AntdV2T14 from './context_menu/antd/v2/T14';
import AntdV2T15 from './context_menu/antd/v2/T15';
import AntdV2T16 from './context_menu/antd/v2/T16';

// Import task-specific components for mui
import MuiT01 from './context_menu/mui/T01';
import MuiT02 from './context_menu/mui/T02';
import MuiT03 from './context_menu/mui/T03';
import MuiT04 from './context_menu/mui/T04';
import MuiT05 from './context_menu/mui/T05';
import MuiT06 from './context_menu/mui/T06';
import MuiT07 from './context_menu/mui/T07';
import MuiT08 from './context_menu/mui/T08';
import MuiT09 from './context_menu/mui/T09';
import MuiT10 from './context_menu/mui/T10';
import MuiV2T01 from './context_menu/mui/v2/T01';
import MuiV2T02 from './context_menu/mui/v2/T02';
import MuiV2T03 from './context_menu/mui/v2/T03';
import MuiV2T04 from './context_menu/mui/v2/T04';
import MuiV2T05 from './context_menu/mui/v2/T05';
import MuiV2T06 from './context_menu/mui/v2/T06';
import MuiV2T07 from './context_menu/mui/v2/T07';
import MuiV2T08 from './context_menu/mui/v2/T08';
import MuiV2T09 from './context_menu/mui/v2/T09';
import MuiV2T10 from './context_menu/mui/v2/T10';
import MuiV2T11 from './context_menu/mui/v2/T11';
import MuiV2T12 from './context_menu/mui/v2/T12';
import MuiV2T13 from './context_menu/mui/v2/T13';
import MuiV2T14 from './context_menu/mui/v2/T14';
import MuiV2T15 from './context_menu/mui/v2/T15';
import MuiV2T16 from './context_menu/mui/v2/T16';

// Import task-specific components for mantine
import MantineT01 from './context_menu/mantine/T01';
import MantineT02 from './context_menu/mantine/T02';
import MantineT03 from './context_menu/mantine/T03';
import MantineT04 from './context_menu/mantine/T04';
import MantineT05 from './context_menu/mantine/T05';
import MantineT06 from './context_menu/mantine/T06';
import MantineT07 from './context_menu/mantine/T07';
import MantineT08 from './context_menu/mantine/T08';
import MantineT09 from './context_menu/mantine/T09';
import MantineT10 from './context_menu/mantine/T10';
import MantineV2T01 from './context_menu/mantine/v2/T01';
import MantineV2T02 from './context_menu/mantine/v2/T02';
import MantineV2T03 from './context_menu/mantine/v2/T03';
import MantineV2T04 from './context_menu/mantine/v2/T04';
import MantineV2T05 from './context_menu/mantine/v2/T05';
import MantineV2T06 from './context_menu/mantine/v2/T06';
import MantineV2T07 from './context_menu/mantine/v2/T07';
import MantineV2T08 from './context_menu/mantine/v2/T08';
import MantineV2T09 from './context_menu/mantine/v2/T09';
import MantineV2T10 from './context_menu/mantine/v2/T10';
import MantineV2T11 from './context_menu/mantine/v2/T11';
import MantineV2T12 from './context_menu/mantine/v2/T12';
import MantineV2T13 from './context_menu/mantine/v2/T13';
import MantineV2T14 from './context_menu/mantine/v2/T14';
import MantineV2T15 from './context_menu/mantine/v2/T15';
import MantineV2T16 from './context_menu/mantine/v2/T16';

interface ContextMenuTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'context_menu-antd-T01': AntdT01,
  'context_menu-antd-T02': AntdT02,
  'context_menu-antd-T03': AntdT03,
  'context_menu-antd-T04': AntdT04,
  'context_menu-antd-T05': AntdT05,
  'context_menu-antd-T06': AntdT06,
  'context_menu-antd-T07': AntdT07,
  'context_menu-antd-T08': AntdT08,
  'context_menu-antd-T09': AntdT09,
  'context_menu-antd-T10': AntdT10,
  'context_menu-antd-v2-T01': AntdV2T01,
  'context_menu-antd-v2-T02': AntdV2T02,
  'context_menu-antd-v2-T03': AntdV2T03,
  'context_menu-antd-v2-T04': AntdV2T04,
  'context_menu-antd-v2-T05': AntdV2T05,
  'context_menu-antd-v2-T06': AntdV2T06,
  'context_menu-antd-v2-T07': AntdV2T07,
  'context_menu-antd-v2-T08': AntdV2T08,
  'context_menu-antd-v2-T09': AntdV2T09,
  'context_menu-antd-v2-T10': AntdV2T10,
  'context_menu-antd-v2-T11': AntdV2T11,
  'context_menu-antd-v2-T12': AntdV2T12,
  'context_menu-antd-v2-T13': AntdV2T13,
  'context_menu-antd-v2-T14': AntdV2T14,
  'context_menu-antd-v2-T15': AntdV2T15,
  'context_menu-antd-v2-T16': AntdV2T16,
  // MUI tasks
  'context_menu-mui-T01': MuiT01,
  'context_menu-mui-T02': MuiT02,
  'context_menu-mui-T03': MuiT03,
  'context_menu-mui-T04': MuiT04,
  'context_menu-mui-T05': MuiT05,
  'context_menu-mui-T06': MuiT06,
  'context_menu-mui-T07': MuiT07,
  'context_menu-mui-T08': MuiT08,
  'context_menu-mui-T09': MuiT09,
  'context_menu-mui-T10': MuiT10,
  'context_menu-mui-v2-T01': MuiV2T01,
  'context_menu-mui-v2-T02': MuiV2T02,
  'context_menu-mui-v2-T03': MuiV2T03,
  'context_menu-mui-v2-T04': MuiV2T04,
  'context_menu-mui-v2-T05': MuiV2T05,
  'context_menu-mui-v2-T06': MuiV2T06,
  'context_menu-mui-v2-T07': MuiV2T07,
  'context_menu-mui-v2-T08': MuiV2T08,
  'context_menu-mui-v2-T09': MuiV2T09,
  'context_menu-mui-v2-T10': MuiV2T10,
  'context_menu-mui-v2-T11': MuiV2T11,
  'context_menu-mui-v2-T12': MuiV2T12,
  'context_menu-mui-v2-T13': MuiV2T13,
  'context_menu-mui-v2-T14': MuiV2T14,
  'context_menu-mui-v2-T15': MuiV2T15,
  'context_menu-mui-v2-T16': MuiV2T16,
  // Mantine tasks
  'context_menu-mantine-T01': MantineT01,
  'context_menu-mantine-T02': MantineT02,
  'context_menu-mantine-T03': MantineT03,
  'context_menu-mantine-T04': MantineT04,
  'context_menu-mantine-T05': MantineT05,
  'context_menu-mantine-T06': MantineT06,
  'context_menu-mantine-T07': MantineT07,
  'context_menu-mantine-T08': MantineT08,
  'context_menu-mantine-T09': MantineT09,
  'context_menu-mantine-T10': MantineT10,
  'context_menu-mantine-v2-T01': MantineV2T01,
  'context_menu-mantine-v2-T02': MantineV2T02,
  'context_menu-mantine-v2-T03': MantineV2T03,
  'context_menu-mantine-v2-T04': MantineV2T04,
  'context_menu-mantine-v2-T05': MantineV2T05,
  'context_menu-mantine-v2-T06': MantineV2T06,
  'context_menu-mantine-v2-T07': MantineV2T07,
  'context_menu-mantine-v2-T08': MantineV2T08,
  'context_menu-mantine-v2-T09': MantineV2T09,
  'context_menu-mantine-v2-T10': MantineV2T10,
  'context_menu-mantine-v2-T11': MantineV2T11,
  'context_menu-mantine-v2-T12': MantineV2T12,
  'context_menu-mantine-v2-T13': MantineV2T13,
  'context_menu-mantine-v2-T14': MantineV2T14,
  'context_menu-mantine-v2-T15': MantineV2T15,
  'context_menu-mantine-v2-T16': MantineV2T16,
};

export default function ContextMenuTaskRunner({ task }: ContextMenuTaskRunnerProps) {
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
