'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './tree_select/antd/T01';
import AntdT02 from './tree_select/antd/T02';
import AntdT03 from './tree_select/antd/T03';
import AntdT04 from './tree_select/antd/T04';
import AntdT05 from './tree_select/antd/T05';
import AntdT06 from './tree_select/antd/T06';
import AntdT07 from './tree_select/antd/T07';
import AntdT08 from './tree_select/antd/T08';
import AntdT09 from './tree_select/antd/T09';
import AntdT10 from './tree_select/antd/T10';

// Import task-specific components for mui
import MuiT01 from './tree_select/mui/T01';
import MuiT02 from './tree_select/mui/T02';
import MuiT03 from './tree_select/mui/T03';
import MuiT04 from './tree_select/mui/T04';
import MuiT05 from './tree_select/mui/T05';
import MuiT06 from './tree_select/mui/T06';
import MuiT07 from './tree_select/mui/T07';
import MuiT08 from './tree_select/mui/T08';
import MuiT09 from './tree_select/mui/T09';
import MuiT10 from './tree_select/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './tree_select/mantine/T01';
import MantineT02 from './tree_select/mantine/T02';
import MantineT03 from './tree_select/mantine/T03';
import MantineT04 from './tree_select/mantine/T04';
import MantineT05 from './tree_select/mantine/T05';
import MantineT06 from './tree_select/mantine/T06';
import MantineT07 from './tree_select/mantine/T07';
import MantineT08 from './tree_select/mantine/T08';
import MantineT09 from './tree_select/mantine/T09';
import MantineT10 from './tree_select/mantine/T10';

// v2 imports
import AntdV2T01 from './tree_select/antd/v2/T01';
import AntdV2T02 from './tree_select/antd/v2/T02';
import AntdV2T03 from './tree_select/antd/v2/T03';
import AntdV2T04 from './tree_select/antd/v2/T04';
import AntdV2T05 from './tree_select/antd/v2/T05';
import AntdV2T06 from './tree_select/antd/v2/T06';
import AntdV2T07 from './tree_select/antd/v2/T07';
import AntdV2T08 from './tree_select/antd/v2/T08';
import MuiV2T09 from './tree_select/mui/v2/T09';
import MuiV2T10 from './tree_select/mui/v2/T10';
import MuiV2T11 from './tree_select/mui/v2/T11';
import MuiV2T12 from './tree_select/mui/v2/T12';
import MuiV2T13 from './tree_select/mui/v2/T13';
import MuiV2T14 from './tree_select/mui/v2/T14';
import MuiV2T15 from './tree_select/mui/v2/T15';
import MuiV2T16 from './tree_select/mui/v2/T16';
import MantineV2T17 from './tree_select/mantine/v2/T17';
import MantineV2T18 from './tree_select/mantine/v2/T18';
import MantineV2T19 from './tree_select/mantine/v2/T19';
import MantineV2T20 from './tree_select/mantine/v2/T20';
import MantineV2T21 from './tree_select/mantine/v2/T21';
import MantineV2T22 from './tree_select/mantine/v2/T22';
import MantineV2T23 from './tree_select/mantine/v2/T23';
import MantineV2T24 from './tree_select/mantine/v2/T24';

interface TreeSelectTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'tree_select-antd-T01': AntdT01,
  'tree_select-antd-T02': AntdT02,
  'tree_select-antd-T03': AntdT03,
  'tree_select-antd-T04': AntdT04,
  'tree_select-antd-T05': AntdT05,
  'tree_select-antd-T06': AntdT06,
  'tree_select-antd-T07': AntdT07,
  'tree_select-antd-T08': AntdT08,
  'tree_select-antd-T09': AntdT09,
  'tree_select-antd-T10': AntdT10,
  // MUI tasks
  'tree_select-mui-T01': MuiT01,
  'tree_select-mui-T02': MuiT02,
  'tree_select-mui-T03': MuiT03,
  'tree_select-mui-T04': MuiT04,
  'tree_select-mui-T05': MuiT05,
  'tree_select-mui-T06': MuiT06,
  'tree_select-mui-T07': MuiT07,
  'tree_select-mui-T08': MuiT08,
  'tree_select-mui-T09': MuiT09,
  'tree_select-mui-T10': MuiT10,
  // Mantine tasks
  'tree_select-mantine-T01': MantineT01,
  'tree_select-mantine-T02': MantineT02,
  'tree_select-mantine-T03': MantineT03,
  'tree_select-mantine-T04': MantineT04,
  'tree_select-mantine-T05': MantineT05,
  'tree_select-mantine-T06': MantineT06,
  'tree_select-mantine-T07': MantineT07,
  'tree_select-mantine-T08': MantineT08,
  'tree_select-mantine-T09': MantineT09,
  'tree_select-mantine-T10': MantineT10,
  // v2
  'tree_select-antd-v2-T01': AntdV2T01, 'tree_select-antd-v2-T02': AntdV2T02,
  'tree_select-antd-v2-T03': AntdV2T03, 'tree_select-antd-v2-T04': AntdV2T04,
  'tree_select-antd-v2-T05': AntdV2T05, 'tree_select-antd-v2-T06': AntdV2T06,
  'tree_select-antd-v2-T07': AntdV2T07, 'tree_select-antd-v2-T08': AntdV2T08,
  'tree_select-mui-v2-T09': MuiV2T09, 'tree_select-mui-v2-T10': MuiV2T10,
  'tree_select-mui-v2-T11': MuiV2T11, 'tree_select-mui-v2-T12': MuiV2T12,
  'tree_select-mui-v2-T13': MuiV2T13, 'tree_select-mui-v2-T14': MuiV2T14,
  'tree_select-mui-v2-T15': MuiV2T15, 'tree_select-mui-v2-T16': MuiV2T16,
  'tree_select-mantine-v2-T17': MantineV2T17, 'tree_select-mantine-v2-T18': MantineV2T18,
  'tree_select-mantine-v2-T19': MantineV2T19, 'tree_select-mantine-v2-T20': MantineV2T20,
  'tree_select-mantine-v2-T21': MantineV2T21, 'tree_select-mantine-v2-T22': MantineV2T22,
  'tree_select-mantine-v2-T23': MantineV2T23, 'tree_select-mantine-v2-T24': MantineV2T24,
};

export default function TreeSelectTaskRunner({ task }: TreeSelectTaskRunnerProps) {
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
