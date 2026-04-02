'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './time_picker/antd/T01';
import AntdT02 from './time_picker/antd/T02';
import AntdT03 from './time_picker/antd/T03';
import AntdT04 from './time_picker/antd/T04';
import AntdT05 from './time_picker/antd/T05';
import AntdT06 from './time_picker/antd/T06';
import AntdT07 from './time_picker/antd/T07';
import AntdT08 from './time_picker/antd/T08';
import AntdT09 from './time_picker/antd/T09';
import AntdT10 from './time_picker/antd/T10';

// Import task-specific components for mui
import MuiT01 from './time_picker/mui/T01';
import MuiT02 from './time_picker/mui/T02';
import MuiT03 from './time_picker/mui/T03';
import MuiT04 from './time_picker/mui/T04';
import MuiT05 from './time_picker/mui/T05';
import MuiT06 from './time_picker/mui/T06';
import MuiT07 from './time_picker/mui/T07';
import MuiT08 from './time_picker/mui/T08';
import MuiT09 from './time_picker/mui/T09';
import MuiT10 from './time_picker/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './time_picker/mantine/T01';
import MantineT02 from './time_picker/mantine/T02';
import MantineT03 from './time_picker/mantine/T03';
import MantineT04 from './time_picker/mantine/T04';
import MantineT05 from './time_picker/mantine/T05';
import MantineT06 from './time_picker/mantine/T06';
import MantineT07 from './time_picker/mantine/T07';
import MantineT08 from './time_picker/mantine/T08';
import MantineT09 from './time_picker/mantine/T09';
import MantineT10 from './time_picker/mantine/T10';

import AntdV2T31 from './time_picker/antd/v2/T31';
import AntdV2T32 from './time_picker/antd/v2/T32';
import AntdV2T33 from './time_picker/antd/v2/T33';
import AntdV2T34 from './time_picker/antd/v2/T34';
import MuiV2T35 from './time_picker/mui/v2/T35';
import MuiV2T36 from './time_picker/mui/v2/T36';
import MuiV2T37 from './time_picker/mui/v2/T37';
import MantineV2T38 from './time_picker/mantine/v2/T38';
import MantineV2T39 from './time_picker/mantine/v2/T39';
import MantineV2T40 from './time_picker/mantine/v2/T40';

interface TimePickerTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'time_picker-antd-T01': AntdT01,
  'time_picker-antd-T02': AntdT02,
  'time_picker-antd-T03': AntdT03,
  'time_picker-antd-T04': AntdT04,
  'time_picker-antd-T05': AntdT05,
  'time_picker-antd-T06': AntdT06,
  'time_picker-antd-T07': AntdT07,
  'time_picker-antd-T08': AntdT08,
  'time_picker-antd-T09': AntdT09,
  'time_picker-antd-T10': AntdT10,
  // MUI tasks
  'time_picker-mui-T01': MuiT01,
  'time_picker-mui-T02': MuiT02,
  'time_picker-mui-T03': MuiT03,
  'time_picker-mui-T04': MuiT04,
  'time_picker-mui-T05': MuiT05,
  'time_picker-mui-T06': MuiT06,
  'time_picker-mui-T07': MuiT07,
  'time_picker-mui-T08': MuiT08,
  'time_picker-mui-T09': MuiT09,
  'time_picker-mui-T10': MuiT10,
  // Mantine tasks
  'time_picker-mantine-T01': MantineT01,
  'time_picker-mantine-T02': MantineT02,
  'time_picker-mantine-T03': MantineT03,
  'time_picker-mantine-T04': MantineT04,
  'time_picker-mantine-T05': MantineT05,
  'time_picker-mantine-T06': MantineT06,
  'time_picker-mantine-T07': MantineT07,
  'time_picker-mantine-T08': MantineT08,
  'time_picker-mantine-T09': MantineT09,
  'time_picker-mantine-T10': MantineT10,
  // v2
  'time_picker-antd-v2-T31': AntdV2T31,
  'time_picker-antd-v2-T32': AntdV2T32,
  'time_picker-antd-v2-T33': AntdV2T33,
  'time_picker-antd-v2-T34': AntdV2T34,
  'time_picker-mui-v2-T35': MuiV2T35,
  'time_picker-mui-v2-T36': MuiV2T36,
  'time_picker-mui-v2-T37': MuiV2T37,
  'time_picker-mantine-v2-T38': MantineV2T38,
  'time_picker-mantine-v2-T39': MantineV2T39,
  'time_picker-mantine-v2-T40': MantineV2T40,
};

export default function TimePickerTaskRunner({ task }: TimePickerTaskRunnerProps) {
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
