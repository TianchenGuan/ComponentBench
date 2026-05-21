'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './file_dropzone/antd/T01';
import AntdT02 from './file_dropzone/antd/T02';
import AntdT03 from './file_dropzone/antd/T03';
import AntdT04 from './file_dropzone/antd/T04';
import AntdT05 from './file_dropzone/antd/T05';
import AntdT06 from './file_dropzone/antd/T06';
import AntdT07 from './file_dropzone/antd/T07';
import AntdT08 from './file_dropzone/antd/T08';
import AntdT09 from './file_dropzone/antd/T09';
import AntdT10 from './file_dropzone/antd/T10';

// Import task-specific components for mui
import MuiT01 from './file_dropzone/mui/T01';
import MuiT02 from './file_dropzone/mui/T02';
import MuiT03 from './file_dropzone/mui/T03';
import MuiT04 from './file_dropzone/mui/T04';
import MuiT05 from './file_dropzone/mui/T05';
import MuiT06 from './file_dropzone/mui/T06';
import MuiT07 from './file_dropzone/mui/T07';
import MuiT08 from './file_dropzone/mui/T08';
import MuiT09 from './file_dropzone/mui/T09';
import MuiT10 from './file_dropzone/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './file_dropzone/mantine/T01';
import MantineT02 from './file_dropzone/mantine/T02';
import MantineT03 from './file_dropzone/mantine/T03';
import MantineT04 from './file_dropzone/mantine/T04';
import MantineT05 from './file_dropzone/mantine/T05';
import MantineT06 from './file_dropzone/mantine/T06';
import MantineT07 from './file_dropzone/mantine/T07';
import MantineT08 from './file_dropzone/mantine/T08';
import MantineT09 from './file_dropzone/mantine/T09';
import MantineT10 from './file_dropzone/mantine/T10';

interface FileDropzoneTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks (T01-T10)
  'file_dropzone-antd-T01': AntdT01,
  'file_dropzone-antd-T02': AntdT02,
  'file_dropzone-antd-T03': AntdT03,
  'file_dropzone-antd-T04': AntdT04,
  'file_dropzone-antd-T05': AntdT05,
  'file_dropzone-antd-T06': AntdT06,
  'file_dropzone-antd-T07': AntdT07,
  'file_dropzone-antd-T08': AntdT08,
  'file_dropzone-antd-T09': AntdT09,
  'file_dropzone-antd-T10': AntdT10,
  // MUI tasks (T01-T10)
  'file_dropzone-mui-T01': MuiT01,
  'file_dropzone-mui-T02': MuiT02,
  'file_dropzone-mui-T03': MuiT03,
  'file_dropzone-mui-T04': MuiT04,
  'file_dropzone-mui-T05': MuiT05,
  'file_dropzone-mui-T06': MuiT06,
  'file_dropzone-mui-T07': MuiT07,
  'file_dropzone-mui-T08': MuiT08,
  'file_dropzone-mui-T09': MuiT09,
  'file_dropzone-mui-T10': MuiT10,
  // Mantine tasks (T01-T10)
  'file_dropzone-mantine-T01': MantineT01,
  'file_dropzone-mantine-T02': MantineT02,
  'file_dropzone-mantine-T03': MantineT03,
  'file_dropzone-mantine-T04': MantineT04,
  'file_dropzone-mantine-T05': MantineT05,
  'file_dropzone-mantine-T06': MantineT06,
  'file_dropzone-mantine-T07': MantineT07,
  'file_dropzone-mantine-T08': MantineT08,
  'file_dropzone-mantine-T09': MantineT09,
  'file_dropzone-mantine-T10': MantineT10,
};

export default function FileDropzoneTaskRunner({ task }: FileDropzoneTaskRunnerProps) {
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
