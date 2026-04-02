'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './pin_input_otp/antd/T01';
import AntdT02 from './pin_input_otp/antd/T02';
import AntdT03 from './pin_input_otp/antd/T03';
import AntdT04 from './pin_input_otp/antd/T04';
import AntdT05 from './pin_input_otp/antd/T05';
import AntdT06 from './pin_input_otp/antd/T06';
import AntdT07 from './pin_input_otp/antd/T07';
import AntdT08 from './pin_input_otp/antd/T08';
import AntdT09 from './pin_input_otp/antd/T09';
import AntdT10 from './pin_input_otp/antd/T10';

// Import task-specific components for mui
import MuiT01 from './pin_input_otp/mui/T01';
import MuiT02 from './pin_input_otp/mui/T02';
import MuiT03 from './pin_input_otp/mui/T03';
import MuiT04 from './pin_input_otp/mui/T04';
import MuiT05 from './pin_input_otp/mui/T05';
import MuiT06 from './pin_input_otp/mui/T06';
import MuiT07 from './pin_input_otp/mui/T07';
import MuiT08 from './pin_input_otp/mui/T08';
import MuiT09 from './pin_input_otp/mui/T09';
import MuiT10 from './pin_input_otp/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './pin_input_otp/mantine/T01';
import MantineT02 from './pin_input_otp/mantine/T02';
import MantineT03 from './pin_input_otp/mantine/T03';
import MantineT04 from './pin_input_otp/mantine/T04';
import MantineT05 from './pin_input_otp/mantine/T05';
import MantineT06 from './pin_input_otp/mantine/T06';
import MantineT07 from './pin_input_otp/mantine/T07';
import MantineT08 from './pin_input_otp/mantine/T08';
import MantineT09 from './pin_input_otp/mantine/T09';
import MantineT10 from './pin_input_otp/mantine/T10';

interface PinInputOtpTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks (T01-T10 in YAML)
  'pin_input_otp-antd-T01': AntdT01,
  'pin_input_otp-antd-T02': AntdT02,
  'pin_input_otp-antd-T03': AntdT03,
  'pin_input_otp-antd-T04': AntdT04,
  'pin_input_otp-antd-T05': AntdT05,
  'pin_input_otp-antd-T06': AntdT06,
  'pin_input_otp-antd-T07': AntdT07,
  'pin_input_otp-antd-T08': AntdT08,
  'pin_input_otp-antd-T09': AntdT09,
  'pin_input_otp-antd-T10': AntdT10,
  // MUI tasks (T11-T20 in YAML)
  'pin_input_otp-mui-T11': MuiT01,
  'pin_input_otp-mui-T12': MuiT02,
  'pin_input_otp-mui-T13': MuiT03,
  'pin_input_otp-mui-T14': MuiT04,
  'pin_input_otp-mui-T15': MuiT05,
  'pin_input_otp-mui-T16': MuiT06,
  'pin_input_otp-mui-T17': MuiT07,
  'pin_input_otp-mui-T18': MuiT08,
  'pin_input_otp-mui-T19': MuiT09,
  'pin_input_otp-mui-T20': MuiT10,
  // Mantine tasks (T21-T30 in YAML)
  'pin_input_otp-mantine-T21': MantineT01,
  'pin_input_otp-mantine-T22': MantineT02,
  'pin_input_otp-mantine-T23': MantineT03,
  'pin_input_otp-mantine-T24': MantineT04,
  'pin_input_otp-mantine-T25': MantineT05,
  'pin_input_otp-mantine-T26': MantineT06,
  'pin_input_otp-mantine-T27': MantineT07,
  'pin_input_otp-mantine-T28': MantineT08,
  'pin_input_otp-mantine-T29': MantineT09,
  'pin_input_otp-mantine-T30': MantineT10,
};

export default function PinInputOtpTaskRunner({ task }: PinInputOtpTaskRunnerProps) {
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
