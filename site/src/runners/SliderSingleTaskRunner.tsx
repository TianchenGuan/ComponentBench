'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './slider_single/antd/T01';
import AntdT02 from './slider_single/antd/T02';
import AntdT03 from './slider_single/antd/T03';
import AntdT04 from './slider_single/antd/T04';
import AntdT05 from './slider_single/antd/T05';
import AntdT06 from './slider_single/antd/T06';
import AntdT07 from './slider_single/antd/T07';
import AntdT08 from './slider_single/antd/T08';
import AntdT09 from './slider_single/antd/T09';
import AntdT10 from './slider_single/antd/T10';
import AntdV2T01 from './slider_single/antd/v2/T01';
import AntdV2T02 from './slider_single/antd/v2/T02';
import AntdV2T03 from './slider_single/antd/v2/T03';
import AntdV2T04 from './slider_single/antd/v2/T04';
import AntdV2T05 from './slider_single/antd/v2/T05';
import AntdV2T06 from './slider_single/antd/v2/T06';
import AntdV2T07 from './slider_single/antd/v2/T07';
import AntdV2T08 from './slider_single/antd/v2/T08';

// Import task-specific components for mui
import MuiT01 from './slider_single/mui/T01';
import MuiT02 from './slider_single/mui/T02';
import MuiT03 from './slider_single/mui/T03';
import MuiT04 from './slider_single/mui/T04';
import MuiT05 from './slider_single/mui/T05';
import MuiT06 from './slider_single/mui/T06';
import MuiT07 from './slider_single/mui/T07';
import MuiT08 from './slider_single/mui/T08';
import MuiT09 from './slider_single/mui/T09';
import MuiT10 from './slider_single/mui/T10';
import MuiV2T17 from './slider_single/mui/v2/T17';
import MuiV2T18 from './slider_single/mui/v2/T18';
import MuiV2T19 from './slider_single/mui/v2/T19';
import MuiV2T20 from './slider_single/mui/v2/T20';
import MuiV2T21 from './slider_single/mui/v2/T21';
import MuiV2T22 from './slider_single/mui/v2/T22';
import MuiV2T23 from './slider_single/mui/v2/T23';
import MuiV2T24 from './slider_single/mui/v2/T24';

// Import task-specific components for mantine
import MantineT01 from './slider_single/mantine/T01';
import MantineT02 from './slider_single/mantine/T02';
import MantineT03 from './slider_single/mantine/T03';
import MantineT04 from './slider_single/mantine/T04';
import MantineT05 from './slider_single/mantine/T05';
import MantineT06 from './slider_single/mantine/T06';
import MantineT07 from './slider_single/mantine/T07';
import MantineT08 from './slider_single/mantine/T08';
import MantineT09 from './slider_single/mantine/T09';
import MantineT10 from './slider_single/mantine/T10';
import MantineV2T33 from './slider_single/mantine/v2/T33';
import MantineV2T34 from './slider_single/mantine/v2/T34';
import MantineV2T35 from './slider_single/mantine/v2/T35';
import MantineV2T36 from './slider_single/mantine/v2/T36';
import MantineV2T37 from './slider_single/mantine/v2/T37';
import MantineV2T38 from './slider_single/mantine/v2/T38';
import MantineV2T39 from './slider_single/mantine/v2/T39';
import MantineV2T40 from './slider_single/mantine/v2/T40';

interface SliderSingleTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'slider_single-antd-T01': AntdT01,
  'slider_single-antd-T02': AntdT02,
  'slider_single-antd-T03': AntdT03,
  'slider_single-antd-T04': AntdT04,
  'slider_single-antd-T05': AntdT05,
  'slider_single-antd-T06': AntdT06,
  'slider_single-antd-T07': AntdT07,
  'slider_single-antd-T08': AntdT08,
  'slider_single-antd-T09': AntdT09,
  'slider_single-antd-T10': AntdT10,
  'slider_single-antd-v2-T01': AntdV2T01,
  'slider_single-antd-v2-T02': AntdV2T02,
  'slider_single-antd-v2-T03': AntdV2T03,
  'slider_single-antd-v2-T04': AntdV2T04,
  'slider_single-antd-v2-T05': AntdV2T05,
  'slider_single-antd-v2-T06': AntdV2T06,
  'slider_single-antd-v2-T07': AntdV2T07,
  'slider_single-antd-v2-T08': AntdV2T08,
  // MUI tasks
  'slider_single-mui-T01': MuiT01,
  'slider_single-mui-T02': MuiT02,
  'slider_single-mui-T03': MuiT03,
  'slider_single-mui-T04': MuiT04,
  'slider_single-mui-T05': MuiT05,
  'slider_single-mui-T06': MuiT06,
  'slider_single-mui-T07': MuiT07,
  'slider_single-mui-T08': MuiT08,
  'slider_single-mui-T09': MuiT09,
  'slider_single-mui-T10': MuiT10,
  'slider_single-mui-v2-T17': MuiV2T17,
  'slider_single-mui-v2-T18': MuiV2T18,
  'slider_single-mui-v2-T19': MuiV2T19,
  'slider_single-mui-v2-T20': MuiV2T20,
  'slider_single-mui-v2-T21': MuiV2T21,
  'slider_single-mui-v2-T22': MuiV2T22,
  'slider_single-mui-v2-T23': MuiV2T23,
  'slider_single-mui-v2-T24': MuiV2T24,
  // Mantine tasks
  'slider_single-mantine-T01': MantineT01,
  'slider_single-mantine-T02': MantineT02,
  'slider_single-mantine-T03': MantineT03,
  'slider_single-mantine-T04': MantineT04,
  'slider_single-mantine-T05': MantineT05,
  'slider_single-mantine-T06': MantineT06,
  'slider_single-mantine-T07': MantineT07,
  'slider_single-mantine-T08': MantineT08,
  'slider_single-mantine-T09': MantineT09,
  'slider_single-mantine-T10': MantineT10,
  'slider_single-mantine-v2-T33': MantineV2T33,
  'slider_single-mantine-v2-T34': MantineV2T34,
  'slider_single-mantine-v2-T35': MantineV2T35,
  'slider_single-mantine-v2-T36': MantineV2T36,
  'slider_single-mantine-v2-T37': MantineV2T37,
  'slider_single-mantine-v2-T38': MantineV2T38,
  'slider_single-mantine-v2-T39': MantineV2T39,
  'slider_single-mantine-v2-T40': MantineV2T40,
};

export default function SliderSingleTaskRunner({ task }: SliderSingleTaskRunnerProps) {
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
