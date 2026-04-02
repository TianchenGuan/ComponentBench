'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

import '@gfazioli/mantine-split-pane/styles.css';

// Import task-specific components for antd
import AntdT01 from './window_splitter/antd/T01';
import AntdT02 from './window_splitter/antd/T02';
import AntdT03 from './window_splitter/antd/T03';
import AntdT04 from './window_splitter/antd/T04';
import AntdT05 from './window_splitter/antd/T05';
import AntdT06 from './window_splitter/antd/T06';
import AntdT07 from './window_splitter/antd/T07';
import AntdT08 from './window_splitter/antd/T08';
import AntdT09 from './window_splitter/antd/T09';
import AntdT10 from './window_splitter/antd/T10';
import AntdV2T01 from './window_splitter/antd/v2/T01';
import AntdV2T02 from './window_splitter/antd/v2/T02';
import AntdV2T03 from './window_splitter/antd/v2/T03';
import AntdV2T04 from './window_splitter/antd/v2/T04';
import AntdV2T05 from './window_splitter/antd/v2/T05';
import AntdV2T06 from './window_splitter/antd/v2/T06';
import AntdV2T07 from './window_splitter/antd/v2/T07';
import AntdV2T08 from './window_splitter/antd/v2/T08';

// Import task-specific components for mui
import MuiT01 from './window_splitter/mui/T01';
import MuiT02 from './window_splitter/mui/T02';
import MuiT03 from './window_splitter/mui/T03';
import MuiT04 from './window_splitter/mui/T04';
import MuiT05 from './window_splitter/mui/T05';
import MuiT06 from './window_splitter/mui/T06';
import MuiT07 from './window_splitter/mui/T07';
import MuiT08 from './window_splitter/mui/T08';
import MuiT09 from './window_splitter/mui/T09';
import MuiT10 from './window_splitter/mui/T10';
import MuiV2T01 from './window_splitter/mui/v2/T01';
import MuiV2T02 from './window_splitter/mui/v2/T02';
import MuiV2T03 from './window_splitter/mui/v2/T03';
import MuiV2T04 from './window_splitter/mui/v2/T04';
import MuiV2T05 from './window_splitter/mui/v2/T05';
import MuiV2T06 from './window_splitter/mui/v2/T06';
import MuiV2T07 from './window_splitter/mui/v2/T07';
import MuiV2T08 from './window_splitter/mui/v2/T08';

// Import task-specific components for mantine
import MantineT01 from './window_splitter/mantine/T01';
import MantineT02 from './window_splitter/mantine/T02';
import MantineT03 from './window_splitter/mantine/T03';
import MantineT04 from './window_splitter/mantine/T04';
import MantineT05 from './window_splitter/mantine/T05';
import MantineT06 from './window_splitter/mantine/T06';
import MantineT07 from './window_splitter/mantine/T07';
import MantineT08 from './window_splitter/mantine/T08';
import MantineT09 from './window_splitter/mantine/T09';
import MantineT10 from './window_splitter/mantine/T10';

import MantineV2T01 from './window_splitter/mantine/v2/T01';
import MantineV2T02 from './window_splitter/mantine/v2/T02';
import MantineV2T03 from './window_splitter/mantine/v2/T03';
import MantineV2T04 from './window_splitter/mantine/v2/T04';
import MantineV2T05 from './window_splitter/mantine/v2/T05';
import MantineV2T06 from './window_splitter/mantine/v2/T06';
import MantineV2T07 from './window_splitter/mantine/v2/T07';
import MantineV2T08 from './window_splitter/mantine/v2/T08';

interface WindowSplitterTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks (T01-T10)
  'window_splitter-antd-T01': AntdT01,
  'window_splitter-antd-T02': AntdT02,
  'window_splitter-antd-T03': AntdT03,
  'window_splitter-antd-T04': AntdT04,
  'window_splitter-antd-T05': AntdT05,
  'window_splitter-antd-T06': AntdT06,
  'window_splitter-antd-T07': AntdT07,
  'window_splitter-antd-T08': AntdT08,
  'window_splitter-antd-T09': AntdT09,
  'window_splitter-antd-T10': AntdT10,
  'window_splitter-antd-v2-T01': AntdV2T01,
  'window_splitter-antd-v2-T02': AntdV2T02,
  'window_splitter-antd-v2-T03': AntdV2T03,
  'window_splitter-antd-v2-T04': AntdV2T04,
  'window_splitter-antd-v2-T05': AntdV2T05,
  'window_splitter-antd-v2-T06': AntdV2T06,
  'window_splitter-antd-v2-T07': AntdV2T07,
  'window_splitter-antd-v2-T08': AntdV2T08,
  // MUI tasks (T11-T20 in YAML, but stored as T01-T10 in mui folder)
  'window_splitter-mui-T11': MuiT01,
  'window_splitter-mui-T12': MuiT02,
  'window_splitter-mui-T13': MuiT03,
  'window_splitter-mui-T14': MuiT04,
  'window_splitter-mui-T15': MuiT05,
  'window_splitter-mui-T16': MuiT06,
  'window_splitter-mui-T17': MuiT07,
  'window_splitter-mui-T18': MuiT08,
  'window_splitter-mui-T19': MuiT09,
  'window_splitter-mui-T20': MuiT10,
  'window_splitter-mui-v2-T01': MuiV2T01,
  'window_splitter-mui-v2-T02': MuiV2T02,
  'window_splitter-mui-v2-T03': MuiV2T03,
  'window_splitter-mui-v2-T04': MuiV2T04,
  'window_splitter-mui-v2-T05': MuiV2T05,
  'window_splitter-mui-v2-T06': MuiV2T06,
  'window_splitter-mui-v2-T07': MuiV2T07,
  'window_splitter-mui-v2-T08': MuiV2T08,
  // Mantine tasks (T21-T30 in YAML, but stored as T01-T10 in mantine folder)
  'window_splitter-mantine-T21': MantineT01,
  'window_splitter-mantine-T22': MantineT02,
  'window_splitter-mantine-T23': MantineT03,
  'window_splitter-mantine-T24': MantineT04,
  'window_splitter-mantine-T25': MantineT05,
  'window_splitter-mantine-T26': MantineT06,
  'window_splitter-mantine-T27': MantineT07,
  'window_splitter-mantine-T28': MantineT08,
  'window_splitter-mantine-T29': MantineT09,
  'window_splitter-mantine-T30': MantineT10,
  'window_splitter-mantine-v2-T01': MantineV2T01,
  'window_splitter-mantine-v2-T02': MantineV2T02,
  'window_splitter-mantine-v2-T03': MantineV2T03,
  'window_splitter-mantine-v2-T04': MantineV2T04,
  'window_splitter-mantine-v2-T05': MantineV2T05,
  'window_splitter-mantine-v2-T06': MantineV2T06,
  'window_splitter-mantine-v2-T07': MantineV2T07,
  'window_splitter-mantine-v2-T08': MantineV2T08,
};

export default function WindowSplitterTaskRunner({ task }: WindowSplitterTaskRunnerProps) {
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
