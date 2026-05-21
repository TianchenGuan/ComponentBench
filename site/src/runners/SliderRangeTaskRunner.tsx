'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './slider_range/antd/T01';
import AntdT02 from './slider_range/antd/T02';
import AntdT03 from './slider_range/antd/T03';
import AntdT04 from './slider_range/antd/T04';
import AntdT05 from './slider_range/antd/T05';
import AntdT06 from './slider_range/antd/T06';
import AntdT07 from './slider_range/antd/T07';
import AntdT08 from './slider_range/antd/T08';
import AntdT09 from './slider_range/antd/T09';
import AntdT10 from './slider_range/antd/T10';
import AntdV2T09 from './slider_range/antd/v2/T09';
import AntdV2T10 from './slider_range/antd/v2/T10';
import AntdV2T11 from './slider_range/antd/v2/T11';
import AntdV2T12 from './slider_range/antd/v2/T12';
import AntdV2T13 from './slider_range/antd/v2/T13';
import AntdV2T14 from './slider_range/antd/v2/T14';
import AntdV2T15 from './slider_range/antd/v2/T15';
import AntdV2T16 from './slider_range/antd/v2/T16';

// Import task-specific components for mui
import MuiT01 from './slider_range/mui/T01';
import MuiT02 from './slider_range/mui/T02';
import MuiT03 from './slider_range/mui/T03';
import MuiT04 from './slider_range/mui/T04';
import MuiT05 from './slider_range/mui/T05';
import MuiT06 from './slider_range/mui/T06';
import MuiT07 from './slider_range/mui/T07';
import MuiT08 from './slider_range/mui/T08';
import MuiT09 from './slider_range/mui/T09';
import MuiT10 from './slider_range/mui/T10';
import MuiV2T25 from './slider_range/mui/v2/T25';
import MuiV2T26 from './slider_range/mui/v2/T26';
import MuiV2T27 from './slider_range/mui/v2/T27';
import MuiV2T28 from './slider_range/mui/v2/T28';
import MuiV2T29 from './slider_range/mui/v2/T29';
import MuiV2T30 from './slider_range/mui/v2/T30';
import MuiV2T31 from './slider_range/mui/v2/T31';
import MuiV2T32 from './slider_range/mui/v2/T32';

// Import task-specific components for mantine
import MantineT01 from './slider_range/mantine/T01';
import MantineT02 from './slider_range/mantine/T02';
import MantineT03 from './slider_range/mantine/T03';
import MantineT04 from './slider_range/mantine/T04';
import MantineT05 from './slider_range/mantine/T05';
import MantineT06 from './slider_range/mantine/T06';
import MantineT07 from './slider_range/mantine/T07';
import MantineT08 from './slider_range/mantine/T08';
import MantineT09 from './slider_range/mantine/T09';
import MantineT10 from './slider_range/mantine/T10';

import MantineV2T41 from './slider_range/mantine/v2/T41';
import MantineV2T42 from './slider_range/mantine/v2/T42';
import MantineV2T43 from './slider_range/mantine/v2/T43';
import MantineV2T44 from './slider_range/mantine/v2/T44';
import MantineV2T45 from './slider_range/mantine/v2/T45';
import MantineV2T46 from './slider_range/mantine/v2/T46';
import MantineV2T47 from './slider_range/mantine/v2/T47';
import MantineV2T48 from './slider_range/mantine/v2/T48';

interface SliderRangeTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'slider_range-antd-T01': AntdT01,
  'slider_range-antd-T02': AntdT02,
  'slider_range-antd-T03': AntdT03,
  'slider_range-antd-T04': AntdT04,
  'slider_range-antd-T05': AntdT05,
  'slider_range-antd-T06': AntdT06,
  'slider_range-antd-T07': AntdT07,
  'slider_range-antd-T08': AntdT08,
  'slider_range-antd-T09': AntdT09,
  'slider_range-antd-T10': AntdT10,
  'slider_range-antd-v2-T09': AntdV2T09,
  'slider_range-antd-v2-T10': AntdV2T10,
  'slider_range-antd-v2-T11': AntdV2T11,
  'slider_range-antd-v2-T12': AntdV2T12,
  'slider_range-antd-v2-T13': AntdV2T13,
  'slider_range-antd-v2-T14': AntdV2T14,
  'slider_range-antd-v2-T15': AntdV2T15,
  'slider_range-antd-v2-T16': AntdV2T16,
  // MUI tasks
  'slider_range-mui-T01': MuiT01,
  'slider_range-mui-T02': MuiT02,
  'slider_range-mui-T03': MuiT03,
  'slider_range-mui-T04': MuiT04,
  'slider_range-mui-T05': MuiT05,
  'slider_range-mui-T06': MuiT06,
  'slider_range-mui-T07': MuiT07,
  'slider_range-mui-T08': MuiT08,
  'slider_range-mui-T09': MuiT09,
  'slider_range-mui-T10': MuiT10,
  'slider_range-mui-v2-T25': MuiV2T25,
  'slider_range-mui-v2-T26': MuiV2T26,
  'slider_range-mui-v2-T27': MuiV2T27,
  'slider_range-mui-v2-T28': MuiV2T28,
  'slider_range-mui-v2-T29': MuiV2T29,
  'slider_range-mui-v2-T30': MuiV2T30,
  'slider_range-mui-v2-T31': MuiV2T31,
  'slider_range-mui-v2-T32': MuiV2T32,
  // Mantine tasks
  'slider_range-mantine-T01': MantineT01,
  'slider_range-mantine-T02': MantineT02,
  'slider_range-mantine-T03': MantineT03,
  'slider_range-mantine-T04': MantineT04,
  'slider_range-mantine-T05': MantineT05,
  'slider_range-mantine-T06': MantineT06,
  'slider_range-mantine-T07': MantineT07,
  'slider_range-mantine-T08': MantineT08,
  'slider_range-mantine-T09': MantineT09,
  'slider_range-mantine-T10': MantineT10,
  'slider_range-mantine-v2-T41': MantineV2T41,
  'slider_range-mantine-v2-T42': MantineV2T42,
  'slider_range-mantine-v2-T43': MantineV2T43,
  'slider_range-mantine-v2-T44': MantineV2T44,
  'slider_range-mantine-v2-T45': MantineV2T45,
  'slider_range-mantine-v2-T46': MantineV2T46,
  'slider_range-mantine-v2-T47': MantineV2T47,
  'slider_range-mantine-v2-T48': MantineV2T48,
};

export default function SliderRangeTaskRunner({ task }: SliderRangeTaskRunnerProps) {
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
