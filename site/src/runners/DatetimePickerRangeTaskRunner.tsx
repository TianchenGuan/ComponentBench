'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './datetime_picker_range/antd/T01';
import AntdT02 from './datetime_picker_range/antd/T02';
import AntdT03 from './datetime_picker_range/antd/T03';
import AntdT04 from './datetime_picker_range/antd/T04';
import AntdT05 from './datetime_picker_range/antd/T05';
import AntdT06 from './datetime_picker_range/antd/T06';
import AntdT07 from './datetime_picker_range/antd/T07';
import AntdT08 from './datetime_picker_range/antd/T08';
import AntdT09 from './datetime_picker_range/antd/T09';
import AntdT10 from './datetime_picker_range/antd/T10';

// Import task-specific components for mui
import MuiT01 from './datetime_picker_range/mui/T01';
import MuiT02 from './datetime_picker_range/mui/T02';
import MuiT03 from './datetime_picker_range/mui/T03';
import MuiT04 from './datetime_picker_range/mui/T04';
import MuiT05 from './datetime_picker_range/mui/T05';
import MuiT06 from './datetime_picker_range/mui/T06';
import MuiT07 from './datetime_picker_range/mui/T07';
import MuiT08 from './datetime_picker_range/mui/T08';
import MuiT09 from './datetime_picker_range/mui/T09';
import MuiT10 from './datetime_picker_range/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './datetime_picker_range/mantine/T01';
import MantineT02 from './datetime_picker_range/mantine/T02';
import MantineT03 from './datetime_picker_range/mantine/T03';
import MantineT04 from './datetime_picker_range/mantine/T04';
import MantineT05 from './datetime_picker_range/mantine/T05';
import MantineT06 from './datetime_picker_range/mantine/T06';
import MantineT07 from './datetime_picker_range/mantine/T07';
import MantineT08 from './datetime_picker_range/mantine/T08';
import MantineT09 from './datetime_picker_range/mantine/T09';
import MantineT10 from './datetime_picker_range/mantine/T10';

import AntdV2T21 from './datetime_picker_range/antd/v2/T21';
import AntdV2T22 from './datetime_picker_range/antd/v2/T22';
import AntdV2T23 from './datetime_picker_range/antd/v2/T23';
import MuiV2T24 from './datetime_picker_range/mui/v2/T24';
import MuiV2T25 from './datetime_picker_range/mui/v2/T25';
import MuiV2T26 from './datetime_picker_range/mui/v2/T26';
import MuiV2T27 from './datetime_picker_range/mui/v2/T27';
import MantineV2T28 from './datetime_picker_range/mantine/v2/T28';
import MantineV2T29 from './datetime_picker_range/mantine/v2/T29';
import MantineV2T30 from './datetime_picker_range/mantine/v2/T30';

interface DatetimePickerRangeTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'datetime_picker_range-antd-T01': AntdT01,
  'datetime_picker_range-antd-T02': AntdT02,
  'datetime_picker_range-antd-T03': AntdT03,
  'datetime_picker_range-antd-T04': AntdT04,
  'datetime_picker_range-antd-T05': AntdT05,
  'datetime_picker_range-antd-T06': AntdT06,
  'datetime_picker_range-antd-T07': AntdT07,
  'datetime_picker_range-antd-T08': AntdT08,
  'datetime_picker_range-antd-T09': AntdT09,
  'datetime_picker_range-antd-T10': AntdT10,
  // MUI tasks
  'datetime_picker_range-mui-T01': MuiT01,
  'datetime_picker_range-mui-T02': MuiT02,
  'datetime_picker_range-mui-T03': MuiT03,
  'datetime_picker_range-mui-T04': MuiT04,
  'datetime_picker_range-mui-T05': MuiT05,
  'datetime_picker_range-mui-T06': MuiT06,
  'datetime_picker_range-mui-T07': MuiT07,
  'datetime_picker_range-mui-T08': MuiT08,
  'datetime_picker_range-mui-T09': MuiT09,
  'datetime_picker_range-mui-T10': MuiT10,
  // Mantine tasks
  'datetime_picker_range-mantine-T01': MantineT01,
  'datetime_picker_range-mantine-T02': MantineT02,
  'datetime_picker_range-mantine-T03': MantineT03,
  'datetime_picker_range-mantine-T04': MantineT04,
  'datetime_picker_range-mantine-T05': MantineT05,
  'datetime_picker_range-mantine-T06': MantineT06,
  'datetime_picker_range-mantine-T07': MantineT07,
  'datetime_picker_range-mantine-T08': MantineT08,
  'datetime_picker_range-mantine-T09': MantineT09,
  'datetime_picker_range-mantine-T10': MantineT10,
  // v2
  'datetime_picker_range-antd-v2-T21': AntdV2T21,
  'datetime_picker_range-antd-v2-T22': AntdV2T22,
  'datetime_picker_range-antd-v2-T23': AntdV2T23,
  'datetime_picker_range-mui-v2-T24': MuiV2T24,
  'datetime_picker_range-mui-v2-T25': MuiV2T25,
  'datetime_picker_range-mui-v2-T26': MuiV2T26,
  'datetime_picker_range-mui-v2-T27': MuiV2T27,
  'datetime_picker_range-mantine-v2-T28': MantineV2T28,
  'datetime_picker_range-mantine-v2-T29': MantineV2T29,
  'datetime_picker_range-mantine-v2-T30': MantineV2T30,
};

export default function DatetimePickerRangeTaskRunner({ task }: DatetimePickerRangeTaskRunnerProps) {
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
