'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for mui
import MuiT01 from './select_native/mui/T01';
import MuiT02 from './select_native/mui/T02';
import MuiT03 from './select_native/mui/T03';
import MuiT04 from './select_native/mui/T04';
import MuiT05 from './select_native/mui/T05';
import MuiT06 from './select_native/mui/T06';
import MuiT07 from './select_native/mui/T07';
import MuiT08 from './select_native/mui/T08';
import MuiT09 from './select_native/mui/T09';
import MuiT10 from './select_native/mui/T10';
import MuiT11 from './select_native/mui/T11';
import MuiT12 from './select_native/mui/T12';
import MuiT13 from './select_native/mui/T13';
import MuiT14 from './select_native/mui/T14';
import MuiT15 from './select_native/mui/T15';

// Import task-specific components for mantine
import MantineT01 from './select_native/mantine/T01';
import MantineT02 from './select_native/mantine/T02';
import MantineT03 from './select_native/mantine/T03';
import MantineT04 from './select_native/mantine/T04';
import MantineT05 from './select_native/mantine/T05';
import MantineT06 from './select_native/mantine/T06';
import MantineT07 from './select_native/mantine/T07';
import MantineT08 from './select_native/mantine/T08';
import MantineT09 from './select_native/mantine/T09';
import MantineT10 from './select_native/mantine/T10';

// v2 imports
import MuiV2T19 from './select_native/mui/v2/T19';
import MuiV2T20 from './select_native/mui/v2/T20';
import MuiV2T21 from './select_native/mui/v2/T21';
import MuiV2T22 from './select_native/mui/v2/T22';
import MuiV2T23 from './select_native/mui/v2/T23';
import MuiV2T24 from './select_native/mui/v2/T24';
import MuiV2T25 from './select_native/mui/v2/T25';
import MuiV2T26 from './select_native/mui/v2/T26';
import MantineV2T27 from './select_native/mantine/v2/T27';
import MantineV2T28 from './select_native/mantine/v2/T28';
import MantineV2T29 from './select_native/mantine/v2/T29';
import MantineV2T30 from './select_native/mantine/v2/T30';
import MantineV2T31 from './select_native/mantine/v2/T31';
import MantineV2T32 from './select_native/mantine/v2/T32';
import MantineV2T33 from './select_native/mantine/v2/T33';
import MantineV2T34 from './select_native/mantine/v2/T34';
import MantineT11 from './select_native/mantine/T11';
import MantineT12 from './select_native/mantine/T12';
import MantineT13 from './select_native/mantine/T13';
import MantineT14 from './select_native/mantine/T14';
import MantineT15 from './select_native/mantine/T15';

interface SelectNativeTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // MUI tasks
  'select_native-mui-T01': MuiT01,
  'select_native-mui-T02': MuiT02,
  'select_native-mui-T03': MuiT03,
  'select_native-mui-T04': MuiT04,
  'select_native-mui-T05': MuiT05,
  'select_native-mui-T06': MuiT06,
  'select_native-mui-T07': MuiT07,
  'select_native-mui-T08': MuiT08,
  'select_native-mui-T09': MuiT09,
  'select_native-mui-T10': MuiT10,
  'select_native-mui-T11': MuiT11,
  'select_native-mui-T12': MuiT12,
  'select_native-mui-T13': MuiT13,
  'select_native-mui-T14': MuiT14,
  'select_native-mui-T15': MuiT15,
  // Mantine tasks
  'select_native-mantine-T01': MantineT01,
  'select_native-mantine-T02': MantineT02,
  'select_native-mantine-T03': MantineT03,
  'select_native-mantine-T04': MantineT04,
  'select_native-mantine-T05': MantineT05,
  'select_native-mantine-T06': MantineT06,
  'select_native-mantine-T07': MantineT07,
  'select_native-mantine-T08': MantineT08,
  'select_native-mantine-T09': MantineT09,
  'select_native-mantine-T10': MantineT10,
  'select_native-mantine-T11': MantineT11,
  'select_native-mantine-T12': MantineT12,
  'select_native-mantine-T13': MantineT13,
  'select_native-mantine-T14': MantineT14,
  'select_native-mantine-T15': MantineT15,
  // v2
  'select_native-mui-v2-T19': MuiV2T19,
  'select_native-mui-v2-T20': MuiV2T20,
  'select_native-mui-v2-T21': MuiV2T21,
  'select_native-mui-v2-T22': MuiV2T22,
  'select_native-mui-v2-T23': MuiV2T23,
  'select_native-mui-v2-T24': MuiV2T24,
  'select_native-mui-v2-T25': MuiV2T25,
  'select_native-mui-v2-T26': MuiV2T26,
  'select_native-mantine-v2-T27': MantineV2T27,
  'select_native-mantine-v2-T28': MantineV2T28,
  'select_native-mantine-v2-T29': MantineV2T29,
  'select_native-mantine-v2-T30': MantineV2T30,
  'select_native-mantine-v2-T31': MantineV2T31,
  'select_native-mantine-v2-T32': MantineV2T32,
  'select_native-mantine-v2-T33': MantineV2T33,
  'select_native-mantine-v2-T34': MantineV2T34,
};

export default function SelectNativeTaskRunner({ task }: SelectNativeTaskRunnerProps) {
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
