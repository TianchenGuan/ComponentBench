'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './file_upload_button/antd/T01';
import AntdT02 from './file_upload_button/antd/T02';
import AntdT03 from './file_upload_button/antd/T03';
import AntdT04 from './file_upload_button/antd/T04';
import AntdT05 from './file_upload_button/antd/T05';
import AntdT06 from './file_upload_button/antd/T06';
import AntdT07 from './file_upload_button/antd/T07';
import AntdT08 from './file_upload_button/antd/T08';
import AntdT09 from './file_upload_button/antd/T09';
import AntdT10 from './file_upload_button/antd/T10';

// Import task-specific components for mui
import MuiT01 from './file_upload_button/mui/T01';
import MuiT02 from './file_upload_button/mui/T02';
import MuiT03 from './file_upload_button/mui/T03';
import MuiT04 from './file_upload_button/mui/T04';
import MuiT05 from './file_upload_button/mui/T05';
import MuiT06 from './file_upload_button/mui/T06';
import MuiT07 from './file_upload_button/mui/T07';
import MuiT08 from './file_upload_button/mui/T08';
import MuiT09 from './file_upload_button/mui/T09';
import MuiT10 from './file_upload_button/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './file_upload_button/mantine/T01';
import MantineT02 from './file_upload_button/mantine/T02';
import MantineT03 from './file_upload_button/mantine/T03';
import MantineT04 from './file_upload_button/mantine/T04';
import MantineT05 from './file_upload_button/mantine/T05';
import MantineT06 from './file_upload_button/mantine/T06';
import MantineT07 from './file_upload_button/mantine/T07';
import MantineT08 from './file_upload_button/mantine/T08';
import MantineT09 from './file_upload_button/mantine/T09';
import MantineT10 from './file_upload_button/mantine/T10';

interface FileUploadButtonTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks (T01-T10 in YAML)
  'file_upload_button-antd-T01': AntdT01,
  'file_upload_button-antd-T02': AntdT02,
  'file_upload_button-antd-T03': AntdT03,
  'file_upload_button-antd-T04': AntdT04,
  'file_upload_button-antd-T05': AntdT05,
  'file_upload_button-antd-T06': AntdT06,
  'file_upload_button-antd-T07': AntdT07,
  'file_upload_button-antd-T08': AntdT08,
  'file_upload_button-antd-T09': AntdT09,
  'file_upload_button-antd-T10': AntdT10,
  // MUI tasks (T11-T20 in YAML)
  'file_upload_button-mui-T11': MuiT01,
  'file_upload_button-mui-T12': MuiT02,
  'file_upload_button-mui-T13': MuiT03,
  'file_upload_button-mui-T14': MuiT04,
  'file_upload_button-mui-T15': MuiT05,
  'file_upload_button-mui-T16': MuiT06,
  'file_upload_button-mui-T17': MuiT07,
  'file_upload_button-mui-T18': MuiT08,
  'file_upload_button-mui-T19': MuiT09,
  'file_upload_button-mui-T20': MuiT10,
  // Mantine tasks (T21-T30 in YAML)
  'file_upload_button-mantine-T21': MantineT01,
  'file_upload_button-mantine-T22': MantineT02,
  'file_upload_button-mantine-T23': MantineT03,
  'file_upload_button-mantine-T24': MantineT04,
  'file_upload_button-mantine-T25': MantineT05,
  'file_upload_button-mantine-T26': MantineT06,
  'file_upload_button-mantine-T27': MantineT07,
  'file_upload_button-mantine-T28': MantineT08,
  'file_upload_button-mantine-T29': MantineT09,
  'file_upload_button-mantine-T30': MantineT10,
};

export default function FileUploadButtonTaskRunner({ task }: FileUploadButtonTaskRunnerProps) {
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
