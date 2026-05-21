'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './date_picker_single/antd/T01';
import AntdT02 from './date_picker_single/antd/T02';
import AntdT03 from './date_picker_single/antd/T03';
import AntdT04 from './date_picker_single/antd/T04';
import AntdT05 from './date_picker_single/antd/T05';
import AntdT06 from './date_picker_single/antd/T06';
import AntdT07 from './date_picker_single/antd/T07';
import AntdT08 from './date_picker_single/antd/T08';
import AntdT09 from './date_picker_single/antd/T09';
import AntdT10 from './date_picker_single/antd/T10';

// Import task-specific components for mui
import MuiT01 from './date_picker_single/mui/T01';
import MuiT02 from './date_picker_single/mui/T02';
import MuiT03 from './date_picker_single/mui/T03';
import MuiT04 from './date_picker_single/mui/T04';
import MuiT05 from './date_picker_single/mui/T05';
import MuiT06 from './date_picker_single/mui/T06';
import MuiT07 from './date_picker_single/mui/T07';
import MuiT08 from './date_picker_single/mui/T08';
import MuiT09 from './date_picker_single/mui/T09';
import MuiT10 from './date_picker_single/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './date_picker_single/mantine/T01';
import MantineT02 from './date_picker_single/mantine/T02';
import MantineT03 from './date_picker_single/mantine/T03';
import MantineT04 from './date_picker_single/mantine/T04';
import MantineT05 from './date_picker_single/mantine/T05';
import MantineT06 from './date_picker_single/mantine/T06';
import MantineT07 from './date_picker_single/mantine/T07';
import MantineT08 from './date_picker_single/mantine/T08';
import MantineT09 from './date_picker_single/mantine/T09';
import MantineT10 from './date_picker_single/mantine/T10';

// v2
import AntdV2T01 from './date_picker_single/antd/v2/T01';
import AntdV2T02 from './date_picker_single/antd/v2/T02';
import AntdV2T03 from './date_picker_single/antd/v2/T03';
import AntdV2T04 from './date_picker_single/antd/v2/T04';
import MuiV2T05 from './date_picker_single/mui/v2/T05';
import MuiV2T06 from './date_picker_single/mui/v2/T06';
import MuiV2T07 from './date_picker_single/mui/v2/T07';
import MantineV2T08 from './date_picker_single/mantine/v2/T08';
import MantineV2T09 from './date_picker_single/mantine/v2/T09';
import MantineV2T10 from './date_picker_single/mantine/v2/T10';

interface DatePickerSingleTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'date_picker_single-antd-T01': AntdT01,
  'date_picker_single-antd-T02': AntdT02,
  'date_picker_single-antd-T03': AntdT03,
  'date_picker_single-antd-T04': AntdT04,
  'date_picker_single-antd-T05': AntdT05,
  'date_picker_single-antd-T06': AntdT06,
  'date_picker_single-antd-T07': AntdT07,
  'date_picker_single-antd-T08': AntdT08,
  'date_picker_single-antd-T09': AntdT09,
  'date_picker_single-antd-T10': AntdT10,
  // MUI tasks
  'date_picker_single-mui-T01': MuiT01,
  'date_picker_single-mui-T02': MuiT02,
  'date_picker_single-mui-T03': MuiT03,
  'date_picker_single-mui-T04': MuiT04,
  'date_picker_single-mui-T05': MuiT05,
  'date_picker_single-mui-T06': MuiT06,
  'date_picker_single-mui-T07': MuiT07,
  'date_picker_single-mui-T08': MuiT08,
  'date_picker_single-mui-T09': MuiT09,
  'date_picker_single-mui-T10': MuiT10,
  // Mantine tasks
  'date_picker_single-mantine-T01': MantineT01,
  'date_picker_single-mantine-T02': MantineT02,
  'date_picker_single-mantine-T03': MantineT03,
  'date_picker_single-mantine-T04': MantineT04,
  'date_picker_single-mantine-T05': MantineT05,
  'date_picker_single-mantine-T06': MantineT06,
  'date_picker_single-mantine-T07': MantineT07,
  'date_picker_single-mantine-T08': MantineT08,
  'date_picker_single-mantine-T09': MantineT09,
  'date_picker_single-mantine-T10': MantineT10,
  // v2
  'date_picker_single-antd-v2-T01': AntdV2T01,
  'date_picker_single-antd-v2-T02': AntdV2T02,
  'date_picker_single-antd-v2-T03': AntdV2T03,
  'date_picker_single-antd-v2-T04': AntdV2T04,
  'date_picker_single-mui-v2-T05': MuiV2T05,
  'date_picker_single-mui-v2-T06': MuiV2T06,
  'date_picker_single-mui-v2-T07': MuiV2T07,
  'date_picker_single-mantine-v2-T08': MantineV2T08,
  'date_picker_single-mantine-v2-T09': MantineV2T09,
  'date_picker_single-mantine-v2-T10': MantineV2T10,
};

export default function DatePickerSingleTaskRunner({ task }: DatePickerSingleTaskRunnerProps) {
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
