'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './date_picker_range/antd/T01';
import AntdT02 from './date_picker_range/antd/T02';
import AntdT03 from './date_picker_range/antd/T03';
import AntdT04 from './date_picker_range/antd/T04';
import AntdT05 from './date_picker_range/antd/T05';
import AntdT06 from './date_picker_range/antd/T06';
import AntdT07 from './date_picker_range/antd/T07';
import AntdT08 from './date_picker_range/antd/T08';
import AntdT09 from './date_picker_range/antd/T09';
import AntdT10 from './date_picker_range/antd/T10';
import AntdV2T11 from './date_picker_range/antd/v2/T11';
import AntdV2T12 from './date_picker_range/antd/v2/T12';
import AntdV2T13 from './date_picker_range/antd/v2/T13';
import AntdV2T14 from './date_picker_range/antd/v2/T14';

// Import task-specific components for mui
import MuiT01 from './date_picker_range/mui/T01';
import MuiT02 from './date_picker_range/mui/T02';
import MuiT03 from './date_picker_range/mui/T03';
import MuiT04 from './date_picker_range/mui/T04';
import MuiT05 from './date_picker_range/mui/T05';
import MuiT06 from './date_picker_range/mui/T06';
import MuiT07 from './date_picker_range/mui/T07';
import MuiT08 from './date_picker_range/mui/T08';
import MuiT09 from './date_picker_range/mui/T09';
import MuiT10 from './date_picker_range/mui/T10';
import MuiV2T15 from './date_picker_range/mui/v2/T15';
import MuiV2T16 from './date_picker_range/mui/v2/T16';
import MuiV2T17 from './date_picker_range/mui/v2/T17';

// Import task-specific components for mantine
import MantineT01 from './date_picker_range/mantine/T01';
import MantineT02 from './date_picker_range/mantine/T02';
import MantineT03 from './date_picker_range/mantine/T03';
import MantineT04 from './date_picker_range/mantine/T04';
import MantineT05 from './date_picker_range/mantine/T05';
import MantineT06 from './date_picker_range/mantine/T06';
import MantineT07 from './date_picker_range/mantine/T07';
import MantineT08 from './date_picker_range/mantine/T08';
import MantineT09 from './date_picker_range/mantine/T09';
import MantineT10 from './date_picker_range/mantine/T10';
import MantineV2T18 from './date_picker_range/mantine/v2/T18';
import MantineV2T19 from './date_picker_range/mantine/v2/T19';
import MantineV2T20 from './date_picker_range/mantine/v2/T20';

interface DatePickerRangeTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'date_picker_range-antd-T01': AntdT01,
  'date_picker_range-antd-T02': AntdT02,
  'date_picker_range-antd-T03': AntdT03,
  'date_picker_range-antd-T04': AntdT04,
  'date_picker_range-antd-T05': AntdT05,
  'date_picker_range-antd-T06': AntdT06,
  'date_picker_range-antd-T07': AntdT07,
  'date_picker_range-antd-T08': AntdT08,
  'date_picker_range-antd-T09': AntdT09,
  'date_picker_range-antd-T10': AntdT10,
  'date_picker_range-antd-v2-T11': AntdV2T11,
  'date_picker_range-antd-v2-T12': AntdV2T12,
  'date_picker_range-antd-v2-T13': AntdV2T13,
  'date_picker_range-antd-v2-T14': AntdV2T14,
  // MUI tasks
  'date_picker_range-mui-T01': MuiT01,
  'date_picker_range-mui-T02': MuiT02,
  'date_picker_range-mui-T03': MuiT03,
  'date_picker_range-mui-T04': MuiT04,
  'date_picker_range-mui-T05': MuiT05,
  'date_picker_range-mui-T06': MuiT06,
  'date_picker_range-mui-T07': MuiT07,
  'date_picker_range-mui-T08': MuiT08,
  'date_picker_range-mui-T09': MuiT09,
  'date_picker_range-mui-T10': MuiT10,
  'date_picker_range-mui-v2-T15': MuiV2T15,
  'date_picker_range-mui-v2-T16': MuiV2T16,
  'date_picker_range-mui-v2-T17': MuiV2T17,
  // Mantine tasks
  'date_picker_range-mantine-T01': MantineT01,
  'date_picker_range-mantine-T02': MantineT02,
  'date_picker_range-mantine-T03': MantineT03,
  'date_picker_range-mantine-T04': MantineT04,
  'date_picker_range-mantine-T05': MantineT05,
  'date_picker_range-mantine-T06': MantineT06,
  'date_picker_range-mantine-T07': MantineT07,
  'date_picker_range-mantine-T08': MantineT08,
  'date_picker_range-mantine-T09': MantineT09,
  'date_picker_range-mantine-T10': MantineT10,
  'date_picker_range-mantine-v2-T18': MantineV2T18,
  'date_picker_range-mantine-v2-T19': MantineV2T19,
  'date_picker_range-mantine-v2-T20': MantineV2T20,
};

export default function DatePickerRangeTaskRunner({ task }: DatePickerRangeTaskRunnerProps) {
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
