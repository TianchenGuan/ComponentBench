'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './json_editor/antd/T01';
import AntdT02 from './json_editor/antd/T02';
import AntdT03 from './json_editor/antd/T03';
import AntdT04 from './json_editor/antd/T04';
import AntdT05 from './json_editor/antd/T05';
import AntdT06 from './json_editor/antd/T06';
import AntdT07 from './json_editor/antd/T07';
import AntdT08 from './json_editor/antd/T08';
import AntdT09 from './json_editor/antd/T09';
import AntdT10 from './json_editor/antd/T10';

// Import task-specific components for mui
import MuiT01 from './json_editor/mui/T01';
import MuiT02 from './json_editor/mui/T02';
import MuiT03 from './json_editor/mui/T03';
import MuiT04 from './json_editor/mui/T04';
import MuiT05 from './json_editor/mui/T05';
import MuiT06 from './json_editor/mui/T06';
import MuiT07 from './json_editor/mui/T07';
import MuiT08 from './json_editor/mui/T08';
import MuiT09 from './json_editor/mui/T09';
import MuiT10 from './json_editor/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './json_editor/mantine/T01';
import MantineT02 from './json_editor/mantine/T02';
import MantineT03 from './json_editor/mantine/T03';
import MantineT04 from './json_editor/mantine/T04';
import MantineT05 from './json_editor/mantine/T05';
import MantineT06 from './json_editor/mantine/T06';
import MantineT07 from './json_editor/mantine/T07';
import MantineT08 from './json_editor/mantine/T08';
import MantineT09 from './json_editor/mantine/T09';
import MantineT10 from './json_editor/mantine/T10';

// Import v2 task-specific components for antd
import AntdV2T01 from './json_editor/antd/v2/T01';
import AntdV2T02 from './json_editor/antd/v2/T02';
import AntdV2T03 from './json_editor/antd/v2/T03';
import AntdV2T04 from './json_editor/antd/v2/T04';
import AntdV2T05 from './json_editor/antd/v2/T05';

// Import v2 task-specific components for mui
import MuiV2T01 from './json_editor/mui/v2/T01';
import MuiV2T02 from './json_editor/mui/v2/T02';
import MuiV2T03 from './json_editor/mui/v2/T03';
import MuiV2T04 from './json_editor/mui/v2/T04';
import MuiV2T05 from './json_editor/mui/v2/T05';
import MuiV2T06 from './json_editor/mui/v2/T06';

// Import v2 task-specific components for mantine
import MantineV2T01 from './json_editor/mantine/v2/T01';
import MantineV2T02 from './json_editor/mantine/v2/T02';
import MantineV2T03 from './json_editor/mantine/v2/T03';
import MantineV2T04 from './json_editor/mantine/v2/T04';
import MantineV2T05 from './json_editor/mantine/v2/T05';

interface JsonEditorTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'json_editor-antd-T01': AntdT01,
  'json_editor-antd-T02': AntdT02,
  'json_editor-antd-T03': AntdT03,
  'json_editor-antd-T04': AntdT04,
  'json_editor-antd-T05': AntdT05,
  'json_editor-antd-T06': AntdT06,
  'json_editor-antd-T07': AntdT07,
  'json_editor-antd-T08': AntdT08,
  'json_editor-antd-T09': AntdT09,
  'json_editor-antd-T10': AntdT10,
  // MUI tasks
  'json_editor-mui-T01': MuiT01,
  'json_editor-mui-T02': MuiT02,
  'json_editor-mui-T03': MuiT03,
  'json_editor-mui-T04': MuiT04,
  'json_editor-mui-T05': MuiT05,
  'json_editor-mui-T06': MuiT06,
  'json_editor-mui-T07': MuiT07,
  'json_editor-mui-T08': MuiT08,
  'json_editor-mui-T09': MuiT09,
  'json_editor-mui-T10': MuiT10,
  // Mantine tasks
  'json_editor-mantine-T01': MantineT01,
  'json_editor-mantine-T02': MantineT02,
  'json_editor-mantine-T03': MantineT03,
  'json_editor-mantine-T04': MantineT04,
  'json_editor-mantine-T05': MantineT05,
  'json_editor-mantine-T06': MantineT06,
  'json_editor-mantine-T07': MantineT07,
  'json_editor-mantine-T08': MantineT08,
  'json_editor-mantine-T09': MantineT09,
  'json_editor-mantine-T10': MantineT10,
  // v2 Antd tasks
  'json_editor-antd-v2-T01': AntdV2T01,
  'json_editor-antd-v2-T02': AntdV2T02,
  'json_editor-antd-v2-T03': AntdV2T03,
  'json_editor-antd-v2-T04': AntdV2T04,
  'json_editor-antd-v2-T05': AntdV2T05,
  // v2 MUI tasks
  'json_editor-mui-v2-T01': MuiV2T01,
  'json_editor-mui-v2-T02': MuiV2T02,
  'json_editor-mui-v2-T03': MuiV2T03,
  'json_editor-mui-v2-T04': MuiV2T04,
  'json_editor-mui-v2-T05': MuiV2T05,
  'json_editor-mui-v2-T06': MuiV2T06,
  // v2 Mantine tasks
  'json_editor-mantine-v2-T01': MantineV2T01,
  'json_editor-mantine-v2-T02': MantineV2T02,
  'json_editor-mantine-v2-T03': MantineV2T03,
  'json_editor-mantine-v2-T04': MantineV2T04,
  'json_editor-mantine-v2-T05': MantineV2T05,
};

export default function JsonEditorTaskRunner({ task }: JsonEditorTaskRunnerProps) {
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
