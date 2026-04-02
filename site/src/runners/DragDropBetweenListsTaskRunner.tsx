'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './drag_drop_between_lists/antd/T01';
import AntdT02 from './drag_drop_between_lists/antd/T02';
import AntdT03 from './drag_drop_between_lists/antd/T03';
import AntdT04 from './drag_drop_between_lists/antd/T04';
import AntdT05 from './drag_drop_between_lists/antd/T05';
import AntdT06 from './drag_drop_between_lists/antd/T06';
import AntdT07 from './drag_drop_between_lists/antd/T07';
import AntdT08 from './drag_drop_between_lists/antd/T08';
import AntdT09 from './drag_drop_between_lists/antd/T09';
import AntdT10 from './drag_drop_between_lists/antd/T10';
import AntdV2T17 from './drag_drop_between_lists/antd/v2/T17';
import AntdV2T18 from './drag_drop_between_lists/antd/v2/T18';
import AntdV2T19 from './drag_drop_between_lists/antd/v2/T19';
import AntdV2T20 from './drag_drop_between_lists/antd/v2/T20';
import AntdV2T21 from './drag_drop_between_lists/antd/v2/T21';

// Import task-specific components for mui
import MuiT01 from './drag_drop_between_lists/mui/T01';
import MuiT02 from './drag_drop_between_lists/mui/T02';
import MuiT03 from './drag_drop_between_lists/mui/T03';
import MuiT04 from './drag_drop_between_lists/mui/T04';
import MuiT05 from './drag_drop_between_lists/mui/T05';
import MuiT06 from './drag_drop_between_lists/mui/T06';
import MuiT07 from './drag_drop_between_lists/mui/T07';
import MuiT08 from './drag_drop_between_lists/mui/T08';
import MuiT09 from './drag_drop_between_lists/mui/T09';
import MuiT10 from './drag_drop_between_lists/mui/T10';
import MuiV2T22 from './drag_drop_between_lists/mui/v2/T22';
import MuiV2T23 from './drag_drop_between_lists/mui/v2/T23';
import MuiV2T24 from './drag_drop_between_lists/mui/v2/T24';
import MuiV2T25 from './drag_drop_between_lists/mui/v2/T25';
import MuiV2T26 from './drag_drop_between_lists/mui/v2/T26';
import MuiV2T27 from './drag_drop_between_lists/mui/v2/T27';

// Import task-specific components for mantine
import MantineT01 from './drag_drop_between_lists/mantine/T01';
import MantineT02 from './drag_drop_between_lists/mantine/T02';
import MantineT03 from './drag_drop_between_lists/mantine/T03';
import MantineT04 from './drag_drop_between_lists/mantine/T04';
import MantineT05 from './drag_drop_between_lists/mantine/T05';
import MantineT06 from './drag_drop_between_lists/mantine/T06';
import MantineT07 from './drag_drop_between_lists/mantine/T07';
import MantineT08 from './drag_drop_between_lists/mantine/T08';
import MantineT09 from './drag_drop_between_lists/mantine/T09';
import MantineT10 from './drag_drop_between_lists/mantine/T10';

import MantineV2T28 from './drag_drop_between_lists/mantine/v2/T28';
import MantineV2T29 from './drag_drop_between_lists/mantine/v2/T29';
import MantineV2T30 from './drag_drop_between_lists/mantine/v2/T30';
import MantineV2T31 from './drag_drop_between_lists/mantine/v2/T31';
import MantineV2T32 from './drag_drop_between_lists/mantine/v2/T32';

interface DragDropBetweenListsTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'drag_drop_between_lists-antd-T01': AntdT01,
  'drag_drop_between_lists-antd-T02': AntdT02,
  'drag_drop_between_lists-antd-T03': AntdT03,
  'drag_drop_between_lists-antd-T04': AntdT04,
  'drag_drop_between_lists-antd-T05': AntdT05,
  'drag_drop_between_lists-antd-T06': AntdT06,
  'drag_drop_between_lists-antd-T07': AntdT07,
  'drag_drop_between_lists-antd-T08': AntdT08,
  'drag_drop_between_lists-antd-T09': AntdT09,
  'drag_drop_between_lists-antd-T10': AntdT10,
  'drag_drop_between_lists-antd-v2-T17': AntdV2T17,
  'drag_drop_between_lists-antd-v2-T18': AntdV2T18,
  'drag_drop_between_lists-antd-v2-T19': AntdV2T19,
  'drag_drop_between_lists-antd-v2-T20': AntdV2T20,
  'drag_drop_between_lists-antd-v2-T21': AntdV2T21,
  // MUI tasks
  'drag_drop_between_lists-mui-T01': MuiT01,
  'drag_drop_between_lists-mui-T02': MuiT02,
  'drag_drop_between_lists-mui-T03': MuiT03,
  'drag_drop_between_lists-mui-T04': MuiT04,
  'drag_drop_between_lists-mui-T05': MuiT05,
  'drag_drop_between_lists-mui-T06': MuiT06,
  'drag_drop_between_lists-mui-T07': MuiT07,
  'drag_drop_between_lists-mui-T08': MuiT08,
  'drag_drop_between_lists-mui-T09': MuiT09,
  'drag_drop_between_lists-mui-T10': MuiT10,
  'drag_drop_between_lists-mui-v2-T22': MuiV2T22,
  'drag_drop_between_lists-mui-v2-T23': MuiV2T23,
  'drag_drop_between_lists-mui-v2-T24': MuiV2T24,
  'drag_drop_between_lists-mui-v2-T25': MuiV2T25,
  'drag_drop_between_lists-mui-v2-T26': MuiV2T26,
  'drag_drop_between_lists-mui-v2-T27': MuiV2T27,
  // Mantine tasks
  'drag_drop_between_lists-mantine-T01': MantineT01,
  'drag_drop_between_lists-mantine-T02': MantineT02,
  'drag_drop_between_lists-mantine-T03': MantineT03,
  'drag_drop_between_lists-mantine-T04': MantineT04,
  'drag_drop_between_lists-mantine-T05': MantineT05,
  'drag_drop_between_lists-mantine-T06': MantineT06,
  'drag_drop_between_lists-mantine-T07': MantineT07,
  'drag_drop_between_lists-mantine-T08': MantineT08,
  'drag_drop_between_lists-mantine-T09': MantineT09,
  'drag_drop_between_lists-mantine-T10': MantineT10,
  'drag_drop_between_lists-mantine-v2-T28': MantineV2T28,
  'drag_drop_between_lists-mantine-v2-T29': MantineV2T29,
  'drag_drop_between_lists-mantine-v2-T30': MantineV2T30,
  'drag_drop_between_lists-mantine-v2-T31': MantineV2T31,
  'drag_drop_between_lists-mantine-v2-T32': MantineV2T32,
};

export default function DragDropBetweenListsTaskRunner({ task }: DragDropBetweenListsTaskRunnerProps) {
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
