'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './inline_editable_text/antd/T01';
import AntdT02 from './inline_editable_text/antd/T02';
import AntdT03 from './inline_editable_text/antd/T03';
import AntdT04 from './inline_editable_text/antd/T04';
import AntdT05 from './inline_editable_text/antd/T05';
import AntdT06 from './inline_editable_text/antd/T06';
import AntdT07 from './inline_editable_text/antd/T07';
import AntdT08 from './inline_editable_text/antd/T08';
import AntdT09 from './inline_editable_text/antd/T09';
import AntdT10 from './inline_editable_text/antd/T10';

// Import task-specific components for mui
import MuiT01 from './inline_editable_text/mui/T01';
import MuiT02 from './inline_editable_text/mui/T02';
import MuiT03 from './inline_editable_text/mui/T03';
import MuiT04 from './inline_editable_text/mui/T04';
import MuiT05 from './inline_editable_text/mui/T05';
import MuiT06 from './inline_editable_text/mui/T06';
import MuiT07 from './inline_editable_text/mui/T07';
import MuiT08 from './inline_editable_text/mui/T08';
import MuiT09 from './inline_editable_text/mui/T09';
import MuiT10 from './inline_editable_text/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './inline_editable_text/mantine/T01';
import MantineT02 from './inline_editable_text/mantine/T02';
import MantineT03 from './inline_editable_text/mantine/T03';
import MantineT04 from './inline_editable_text/mantine/T04';
import MantineT05 from './inline_editable_text/mantine/T05';
import MantineT06 from './inline_editable_text/mantine/T06';
import MantineT07 from './inline_editable_text/mantine/T07';
import MantineT08 from './inline_editable_text/mantine/T08';
import MantineT09 from './inline_editable_text/mantine/T09';
import MantineT10 from './inline_editable_text/mantine/T10';

// v2 imports
import AntdV2T01 from './inline_editable_text/antd/v2/T01';
import AntdV2T02 from './inline_editable_text/antd/v2/T02';
import AntdV2T03 from './inline_editable_text/antd/v2/T03';
import AntdV2T04 from './inline_editable_text/antd/v2/T04';
import AntdV2T05 from './inline_editable_text/antd/v2/T05';
import AntdV2T06 from './inline_editable_text/antd/v2/T06';
import AntdV2T07 from './inline_editable_text/antd/v2/T07';
import AntdV2T08 from './inline_editable_text/antd/v2/T08';
import MuiV2T01 from './inline_editable_text/mui/v2/T01';
import MuiV2T02 from './inline_editable_text/mui/v2/T02';
import MuiV2T03 from './inline_editable_text/mui/v2/T03';
import MuiV2T04 from './inline_editable_text/mui/v2/T04';
import MuiV2T05 from './inline_editable_text/mui/v2/T05';
import MuiV2T06 from './inline_editable_text/mui/v2/T06';
import MuiV2T07 from './inline_editable_text/mui/v2/T07';
import MuiV2T08 from './inline_editable_text/mui/v2/T08';
import MantineV2T01 from './inline_editable_text/mantine/v2/T01';
import MantineV2T02 from './inline_editable_text/mantine/v2/T02';
import MantineV2T03 from './inline_editable_text/mantine/v2/T03';
import MantineV2T04 from './inline_editable_text/mantine/v2/T04';
import MantineV2T05 from './inline_editable_text/mantine/v2/T05';
import MantineV2T06 from './inline_editable_text/mantine/v2/T06';
import MantineV2T07 from './inline_editable_text/mantine/v2/T07';
import MantineV2T08 from './inline_editable_text/mantine/v2/T08';

interface InlineEditableTextTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'inline_editable_text-antd-T01': AntdT01,
  'inline_editable_text-antd-T02': AntdT02,
  'inline_editable_text-antd-T03': AntdT03,
  'inline_editable_text-antd-T04': AntdT04,
  'inline_editable_text-antd-T05': AntdT05,
  'inline_editable_text-antd-T06': AntdT06,
  'inline_editable_text-antd-T07': AntdT07,
  'inline_editable_text-antd-T08': AntdT08,
  'inline_editable_text-antd-T09': AntdT09,
  'inline_editable_text-antd-T10': AntdT10,
  // MUI tasks
  'inline_editable_text-mui-T01': MuiT01,
  'inline_editable_text-mui-T02': MuiT02,
  'inline_editable_text-mui-T03': MuiT03,
  'inline_editable_text-mui-T04': MuiT04,
  'inline_editable_text-mui-T05': MuiT05,
  'inline_editable_text-mui-T06': MuiT06,
  'inline_editable_text-mui-T07': MuiT07,
  'inline_editable_text-mui-T08': MuiT08,
  'inline_editable_text-mui-T09': MuiT09,
  'inline_editable_text-mui-T10': MuiT10,
  // Mantine tasks
  'inline_editable_text-mantine-T01': MantineT01,
  'inline_editable_text-mantine-T02': MantineT02,
  'inline_editable_text-mantine-T03': MantineT03,
  'inline_editable_text-mantine-T04': MantineT04,
  'inline_editable_text-mantine-T05': MantineT05,
  'inline_editable_text-mantine-T06': MantineT06,
  'inline_editable_text-mantine-T07': MantineT07,
  'inline_editable_text-mantine-T08': MantineT08,
  'inline_editable_text-mantine-T09': MantineT09,
  'inline_editable_text-mantine-T10': MantineT10,
  // v2
  'inline_editable_text-antd-v2-T01': AntdV2T01,
  'inline_editable_text-antd-v2-T02': AntdV2T02,
  'inline_editable_text-antd-v2-T03': AntdV2T03,
  'inline_editable_text-antd-v2-T04': AntdV2T04,
  'inline_editable_text-antd-v2-T05': AntdV2T05,
  'inline_editable_text-antd-v2-T06': AntdV2T06,
  'inline_editable_text-antd-v2-T07': AntdV2T07,
  'inline_editable_text-antd-v2-T08': AntdV2T08,
  'inline_editable_text-mui-v2-T01': MuiV2T01,
  'inline_editable_text-mui-v2-T02': MuiV2T02,
  'inline_editable_text-mui-v2-T03': MuiV2T03,
  'inline_editable_text-mui-v2-T04': MuiV2T04,
  'inline_editable_text-mui-v2-T05': MuiV2T05,
  'inline_editable_text-mui-v2-T06': MuiV2T06,
  'inline_editable_text-mui-v2-T07': MuiV2T07,
  'inline_editable_text-mui-v2-T08': MuiV2T08,
  'inline_editable_text-mantine-v2-T01': MantineV2T01,
  'inline_editable_text-mantine-v2-T02': MantineV2T02,
  'inline_editable_text-mantine-v2-T03': MantineV2T03,
  'inline_editable_text-mantine-v2-T04': MantineV2T04,
  'inline_editable_text-mantine-v2-T05': MantineV2T05,
  'inline_editable_text-mantine-v2-T06': MantineV2T06,
  'inline_editable_text-mantine-v2-T07': MantineV2T07,
  'inline_editable_text-mantine-v2-T08': MantineV2T08,
};

export default function InlineEditableTextTaskRunner({ task }: InlineEditableTextTaskRunnerProps) {
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
