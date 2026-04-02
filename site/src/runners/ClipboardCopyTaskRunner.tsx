'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './clipboard_copy/antd/T01';
import AntdT02 from './clipboard_copy/antd/T02';
import AntdT03 from './clipboard_copy/antd/T03';
import AntdT04 from './clipboard_copy/antd/T04';
import AntdT05 from './clipboard_copy/antd/T05';
import AntdT06 from './clipboard_copy/antd/T06';
import AntdT07 from './clipboard_copy/antd/T07';
import AntdT08 from './clipboard_copy/antd/T08';
import AntdT09 from './clipboard_copy/antd/T09';
import AntdT10 from './clipboard_copy/antd/T10';

// Import task-specific components for mui
import MuiT01 from './clipboard_copy/mui/T01';
import MuiT02 from './clipboard_copy/mui/T02';
import MuiT03 from './clipboard_copy/mui/T03';
import MuiT04 from './clipboard_copy/mui/T04';
import MuiT05 from './clipboard_copy/mui/T05';
import MuiT06 from './clipboard_copy/mui/T06';
import MuiT07 from './clipboard_copy/mui/T07';
import MuiT08 from './clipboard_copy/mui/T08';
import MuiT09 from './clipboard_copy/mui/T09';
import MuiT10 from './clipboard_copy/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './clipboard_copy/mantine/T01';
import MantineT02 from './clipboard_copy/mantine/T02';
import MantineT03 from './clipboard_copy/mantine/T03';
import MantineT04 from './clipboard_copy/mantine/T04';
import MantineT05 from './clipboard_copy/mantine/T05';
import MantineT06 from './clipboard_copy/mantine/T06';
import MantineT07 from './clipboard_copy/mantine/T07';
import MantineT08 from './clipboard_copy/mantine/T08';
import MantineT09 from './clipboard_copy/mantine/T09';
import MantineT10 from './clipboard_copy/mantine/T10';

interface ClipboardCopyTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'clipboard_copy-antd-T01': AntdT01,
  'clipboard_copy-antd-T02': AntdT02,
  'clipboard_copy-antd-T03': AntdT03,
  'clipboard_copy-antd-T04': AntdT04,
  'clipboard_copy-antd-T05': AntdT05,
  'clipboard_copy-antd-T06': AntdT06,
  'clipboard_copy-antd-T07': AntdT07,
  'clipboard_copy-antd-T08': AntdT08,
  'clipboard_copy-antd-T09': AntdT09,
  'clipboard_copy-antd-T10': AntdT10,
  // MUI tasks
  'clipboard_copy-mui-T01': MuiT01,
  'clipboard_copy-mui-T02': MuiT02,
  'clipboard_copy-mui-T03': MuiT03,
  'clipboard_copy-mui-T04': MuiT04,
  'clipboard_copy-mui-T05': MuiT05,
  'clipboard_copy-mui-T06': MuiT06,
  'clipboard_copy-mui-T07': MuiT07,
  'clipboard_copy-mui-T08': MuiT08,
  'clipboard_copy-mui-T09': MuiT09,
  'clipboard_copy-mui-T10': MuiT10,
  // Mantine tasks
  'clipboard_copy-mantine-T01': MantineT01,
  'clipboard_copy-mantine-T02': MantineT02,
  'clipboard_copy-mantine-T03': MantineT03,
  'clipboard_copy-mantine-T04': MantineT04,
  'clipboard_copy-mantine-T05': MantineT05,
  'clipboard_copy-mantine-T06': MantineT06,
  'clipboard_copy-mantine-T07': MantineT07,
  'clipboard_copy-mantine-T08': MantineT08,
  'clipboard_copy-mantine-T09': MantineT09,
  'clipboard_copy-mantine-T10': MantineT10,
};

export default function ClipboardCopyTaskRunner({ task }: ClipboardCopyTaskRunnerProps) {
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
