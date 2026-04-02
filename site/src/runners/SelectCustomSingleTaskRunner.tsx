'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './select_custom_single/antd/T01';
import AntdT02 from './select_custom_single/antd/T02';
import AntdT03 from './select_custom_single/antd/T03';
import AntdT04 from './select_custom_single/antd/T04';
import AntdT05 from './select_custom_single/antd/T05';
import AntdT06 from './select_custom_single/antd/T06';
import AntdT07 from './select_custom_single/antd/T07';
import AntdT08 from './select_custom_single/antd/T08';
import AntdT09 from './select_custom_single/antd/T09';
import AntdT10 from './select_custom_single/antd/T10';

// Import task-specific components for mui
import MuiT01 from './select_custom_single/mui/T01';
import MuiT02 from './select_custom_single/mui/T02';
import MuiT03 from './select_custom_single/mui/T03';
import MuiT04 from './select_custom_single/mui/T04';
import MuiT05 from './select_custom_single/mui/T05';
import MuiT06 from './select_custom_single/mui/T06';
import MuiT07 from './select_custom_single/mui/T07';
import MuiT08 from './select_custom_single/mui/T08';
import MuiT09 from './select_custom_single/mui/T09';
import MuiT10 from './select_custom_single/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './select_custom_single/mantine/T01';
import MantineT02 from './select_custom_single/mantine/T02';
import MantineT03 from './select_custom_single/mantine/T03';
import MantineT04 from './select_custom_single/mantine/T04';
import MantineT05 from './select_custom_single/mantine/T05';
import MantineT06 from './select_custom_single/mantine/T06';
import MantineT07 from './select_custom_single/mantine/T07';
import MantineT08 from './select_custom_single/mantine/T08';
import MantineT09 from './select_custom_single/mantine/T09';
import MantineT10 from './select_custom_single/mantine/T10';

// v2 imports
import AntdV2T01 from './select_custom_single/antd/v2/T01';
import AntdV2T02 from './select_custom_single/antd/v2/T02';
import AntdV2T03 from './select_custom_single/antd/v2/T03';
import AntdV2T04 from './select_custom_single/antd/v2/T04';
import AntdV2T05 from './select_custom_single/antd/v2/T05';
import AntdV2T06 from './select_custom_single/antd/v2/T06';
import MuiV2T07 from './select_custom_single/mui/v2/T07';
import MuiV2T08 from './select_custom_single/mui/v2/T08';
import MuiV2T09 from './select_custom_single/mui/v2/T09';
import MuiV2T10 from './select_custom_single/mui/v2/T10';
import MuiV2T11 from './select_custom_single/mui/v2/T11';
import MuiV2T12 from './select_custom_single/mui/v2/T12';
import MantineV2T13 from './select_custom_single/mantine/v2/T13';
import MantineV2T14 from './select_custom_single/mantine/v2/T14';
import MantineV2T15 from './select_custom_single/mantine/v2/T15';
import MantineV2T16 from './select_custom_single/mantine/v2/T16';
import MantineV2T17 from './select_custom_single/mantine/v2/T17';
import MantineV2T18 from './select_custom_single/mantine/v2/T18';

interface SelectCustomSingleTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'select_custom_single-antd-T01': AntdT01,
  'select_custom_single-antd-T02': AntdT02,
  'select_custom_single-antd-T03': AntdT03,
  'select_custom_single-antd-T04': AntdT04,
  'select_custom_single-antd-T05': AntdT05,
  'select_custom_single-antd-T06': AntdT06,
  'select_custom_single-antd-T07': AntdT07,
  'select_custom_single-antd-T08': AntdT08,
  'select_custom_single-antd-T09': AntdT09,
  'select_custom_single-antd-T10': AntdT10,
  // MUI tasks
  'select_custom_single-mui-T01': MuiT01,
  'select_custom_single-mui-T02': MuiT02,
  'select_custom_single-mui-T03': MuiT03,
  'select_custom_single-mui-T04': MuiT04,
  'select_custom_single-mui-T05': MuiT05,
  'select_custom_single-mui-T06': MuiT06,
  'select_custom_single-mui-T07': MuiT07,
  'select_custom_single-mui-T08': MuiT08,
  'select_custom_single-mui-T09': MuiT09,
  'select_custom_single-mui-T10': MuiT10,
  // Mantine tasks
  'select_custom_single-mantine-T01': MantineT01,
  'select_custom_single-mantine-T02': MantineT02,
  'select_custom_single-mantine-T03': MantineT03,
  'select_custom_single-mantine-T04': MantineT04,
  'select_custom_single-mantine-T05': MantineT05,
  'select_custom_single-mantine-T06': MantineT06,
  'select_custom_single-mantine-T07': MantineT07,
  'select_custom_single-mantine-T08': MantineT08,
  'select_custom_single-mantine-T09': MantineT09,
  'select_custom_single-mantine-T10': MantineT10,
  // v2
  'select_custom_single-antd-v2-T01': AntdV2T01,
  'select_custom_single-antd-v2-T02': AntdV2T02,
  'select_custom_single-antd-v2-T03': AntdV2T03,
  'select_custom_single-antd-v2-T04': AntdV2T04,
  'select_custom_single-antd-v2-T05': AntdV2T05,
  'select_custom_single-antd-v2-T06': AntdV2T06,
  'select_custom_single-mui-v2-T07': MuiV2T07,
  'select_custom_single-mui-v2-T08': MuiV2T08,
  'select_custom_single-mui-v2-T09': MuiV2T09,
  'select_custom_single-mui-v2-T10': MuiV2T10,
  'select_custom_single-mui-v2-T11': MuiV2T11,
  'select_custom_single-mui-v2-T12': MuiV2T12,
  'select_custom_single-mantine-v2-T13': MantineV2T13,
  'select_custom_single-mantine-v2-T14': MantineV2T14,
  'select_custom_single-mantine-v2-T15': MantineV2T15,
  'select_custom_single-mantine-v2-T16': MantineV2T16,
  'select_custom_single-mantine-v2-T17': MantineV2T17,
  'select_custom_single-mantine-v2-T18': MantineV2T18,
};

export default function SelectCustomSingleTaskRunner({ task }: SelectCustomSingleTaskRunnerProps) {
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
