'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './dialog_modal/antd/T01';
import AntdT02 from './dialog_modal/antd/T02';
import AntdT03 from './dialog_modal/antd/T03';
import AntdT04 from './dialog_modal/antd/T04';
import AntdT05 from './dialog_modal/antd/T05';
import AntdT06 from './dialog_modal/antd/T06';
import AntdT07 from './dialog_modal/antd/T07';
import AntdT08 from './dialog_modal/antd/T08';
import AntdT09 from './dialog_modal/antd/T09';
import AntdT10 from './dialog_modal/antd/T10';
import AntdV2T01 from './dialog_modal/antd/v2/T01';
import AntdV2T02 from './dialog_modal/antd/v2/T02';
import AntdV2T03 from './dialog_modal/antd/v2/T03';
import AntdV2T04 from './dialog_modal/antd/v2/T04';
import AntdV2T05 from './dialog_modal/antd/v2/T05';
import AntdV2T06 from './dialog_modal/antd/v2/T06';
import AntdV2T07 from './dialog_modal/antd/v2/T07';
import AntdV2T08 from './dialog_modal/antd/v2/T08';
import AntdV2T09 from './dialog_modal/antd/v2/T09';
import AntdV2T10 from './dialog_modal/antd/v2/T10';
import AntdV2T11 from './dialog_modal/antd/v2/T11';
import AntdV2T12 from './dialog_modal/antd/v2/T12';
import AntdV2T13 from './dialog_modal/antd/v2/T13';
import AntdV2T14 from './dialog_modal/antd/v2/T14';
import AntdV2T15 from './dialog_modal/antd/v2/T15';
import AntdV2T16 from './dialog_modal/antd/v2/T16';
import AntdV2T17 from './dialog_modal/antd/v2/T17';
import AntdV2T18 from './dialog_modal/antd/v2/T18';

// Import task-specific components for mui
import MuiT01 from './dialog_modal/mui/T01';
import MuiT02 from './dialog_modal/mui/T02';
import MuiT03 from './dialog_modal/mui/T03';
import MuiT04 from './dialog_modal/mui/T04';
import MuiT05 from './dialog_modal/mui/T05';
import MuiT06 from './dialog_modal/mui/T06';
import MuiT07 from './dialog_modal/mui/T07';
import MuiT08 from './dialog_modal/mui/T08';
import MuiT09 from './dialog_modal/mui/T09';
import MuiT10 from './dialog_modal/mui/T10';
import MuiV2T01 from './dialog_modal/mui/v2/T01';
import MuiV2T02 from './dialog_modal/mui/v2/T02';
import MuiV2T03 from './dialog_modal/mui/v2/T03';
import MuiV2T04 from './dialog_modal/mui/v2/T04';
import MuiV2T05 from './dialog_modal/mui/v2/T05';
import MuiV2T06 from './dialog_modal/mui/v2/T06';
import MuiV2T07 from './dialog_modal/mui/v2/T07';
import MuiV2T08 from './dialog_modal/mui/v2/T08';
import MuiV2T09 from './dialog_modal/mui/v2/T09';
import MuiV2T10 from './dialog_modal/mui/v2/T10';
import MuiV2T11 from './dialog_modal/mui/v2/T11';
import MuiV2T12 from './dialog_modal/mui/v2/T12';
import MuiV2T13 from './dialog_modal/mui/v2/T13';
import MuiV2T14 from './dialog_modal/mui/v2/T14';
import MuiV2T15 from './dialog_modal/mui/v2/T15';
import MuiV2T16 from './dialog_modal/mui/v2/T16';
import MuiV2T17 from './dialog_modal/mui/v2/T17';
import MuiV2T18 from './dialog_modal/mui/v2/T18';

// Import task-specific components for mantine
import MantineT01 from './dialog_modal/mantine/T01';
import MantineT02 from './dialog_modal/mantine/T02';
import MantineT03 from './dialog_modal/mantine/T03';
import MantineT04 from './dialog_modal/mantine/T04';
import MantineT05 from './dialog_modal/mantine/T05';
import MantineT06 from './dialog_modal/mantine/T06';
import MantineT07 from './dialog_modal/mantine/T07';
import MantineT08 from './dialog_modal/mantine/T08';
import MantineT09 from './dialog_modal/mantine/T09';
import MantineT10 from './dialog_modal/mantine/T10';

import MantineV2T01 from './dialog_modal/mantine/v2/T01';
import MantineV2T02 from './dialog_modal/mantine/v2/T02';
import MantineV2T03 from './dialog_modal/mantine/v2/T03';
import MantineV2T04 from './dialog_modal/mantine/v2/T04';
import MantineV2T05 from './dialog_modal/mantine/v2/T05';
import MantineV2T06 from './dialog_modal/mantine/v2/T06';
import MantineV2T07 from './dialog_modal/mantine/v2/T07';
import MantineV2T08 from './dialog_modal/mantine/v2/T08';
import MantineV2T09 from './dialog_modal/mantine/v2/T09';
import MantineV2T10 from './dialog_modal/mantine/v2/T10';
import MantineV2T11 from './dialog_modal/mantine/v2/T11';
import MantineV2T12 from './dialog_modal/mantine/v2/T12';

interface DialogModalTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'dialog_modal-antd-T01': AntdT01,
  'dialog_modal-antd-T02': AntdT02,
  'dialog_modal-antd-T03': AntdT03,
  'dialog_modal-antd-T04': AntdT04,
  'dialog_modal-antd-T05': AntdT05,
  'dialog_modal-antd-T06': AntdT06,
  'dialog_modal-antd-T07': AntdT07,
  'dialog_modal-antd-T08': AntdT08,
  'dialog_modal-antd-T09': AntdT09,
  'dialog_modal-antd-T10': AntdT10,
  'dialog_modal-antd-v2-T01': AntdV2T01,
  'dialog_modal-antd-v2-T02': AntdV2T02,
  'dialog_modal-antd-v2-T03': AntdV2T03,
  'dialog_modal-antd-v2-T04': AntdV2T04,
  'dialog_modal-antd-v2-T05': AntdV2T05,
  'dialog_modal-antd-v2-T06': AntdV2T06,
  'dialog_modal-antd-v2-T07': AntdV2T07,
  'dialog_modal-antd-v2-T08': AntdV2T08,
  'dialog_modal-antd-v2-T09': AntdV2T09,
  'dialog_modal-antd-v2-T10': AntdV2T10,
  'dialog_modal-antd-v2-T11': AntdV2T11,
  'dialog_modal-antd-v2-T12': AntdV2T12,
  'dialog_modal-antd-v2-T13': AntdV2T13,
  'dialog_modal-antd-v2-T14': AntdV2T14,
  'dialog_modal-antd-v2-T15': AntdV2T15,
  'dialog_modal-antd-v2-T16': AntdV2T16,
  'dialog_modal-antd-v2-T17': AntdV2T17,
  'dialog_modal-antd-v2-T18': AntdV2T18,
  // MUI tasks
  'dialog_modal-mui-T01': MuiT01,
  'dialog_modal-mui-T02': MuiT02,
  'dialog_modal-mui-T03': MuiT03,
  'dialog_modal-mui-T04': MuiT04,
  'dialog_modal-mui-T05': MuiT05,
  'dialog_modal-mui-T06': MuiT06,
  'dialog_modal-mui-T07': MuiT07,
  'dialog_modal-mui-T08': MuiT08,
  'dialog_modal-mui-T09': MuiT09,
  'dialog_modal-mui-T10': MuiT10,
  'dialog_modal-mui-v2-T01': MuiV2T01,
  'dialog_modal-mui-v2-T02': MuiV2T02,
  'dialog_modal-mui-v2-T03': MuiV2T03,
  'dialog_modal-mui-v2-T04': MuiV2T04,
  'dialog_modal-mui-v2-T05': MuiV2T05,
  'dialog_modal-mui-v2-T06': MuiV2T06,
  'dialog_modal-mui-v2-T07': MuiV2T07,
  'dialog_modal-mui-v2-T08': MuiV2T08,
  'dialog_modal-mui-v2-T09': MuiV2T09,
  'dialog_modal-mui-v2-T10': MuiV2T10,
  'dialog_modal-mui-v2-T11': MuiV2T11,
  'dialog_modal-mui-v2-T12': MuiV2T12,
  'dialog_modal-mui-v2-T13': MuiV2T13,
  'dialog_modal-mui-v2-T14': MuiV2T14,
  'dialog_modal-mui-v2-T15': MuiV2T15,
  'dialog_modal-mui-v2-T16': MuiV2T16,
  'dialog_modal-mui-v2-T17': MuiV2T17,
  'dialog_modal-mui-v2-T18': MuiV2T18,
  // Mantine tasks
  'dialog_modal-mantine-T01': MantineT01,
  'dialog_modal-mantine-T02': MantineT02,
  'dialog_modal-mantine-T03': MantineT03,
  'dialog_modal-mantine-T04': MantineT04,
  'dialog_modal-mantine-T05': MantineT05,
  'dialog_modal-mantine-T06': MantineT06,
  'dialog_modal-mantine-T07': MantineT07,
  'dialog_modal-mantine-T08': MantineT08,
  'dialog_modal-mantine-T09': MantineT09,
  'dialog_modal-mantine-T10': MantineT10,
  'dialog_modal-mantine-v2-T01': MantineV2T01,
  'dialog_modal-mantine-v2-T02': MantineV2T02,
  'dialog_modal-mantine-v2-T03': MantineV2T03,
  'dialog_modal-mantine-v2-T04': MantineV2T04,
  'dialog_modal-mantine-v2-T05': MantineV2T05,
  'dialog_modal-mantine-v2-T06': MantineV2T06,
  'dialog_modal-mantine-v2-T07': MantineV2T07,
  'dialog_modal-mantine-v2-T08': MantineV2T08,
  'dialog_modal-mantine-v2-T09': MantineV2T09,
  'dialog_modal-mantine-v2-T10': MantineV2T10,
  'dialog_modal-mantine-v2-T11': MantineV2T11,
  'dialog_modal-mantine-v2-T12': MantineV2T12,
};

export default function DialogModalTaskRunner({ task }: DialogModalTaskRunnerProps) {
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
