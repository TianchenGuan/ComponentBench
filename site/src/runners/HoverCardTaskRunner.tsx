'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './hover_card/antd/T01';
import AntdT02 from './hover_card/antd/T02';
import AntdT03 from './hover_card/antd/T03';
import AntdT04 from './hover_card/antd/T04';
import AntdT05 from './hover_card/antd/T05';
import AntdT06 from './hover_card/antd/T06';
import AntdT07 from './hover_card/antd/T07';
import AntdT08 from './hover_card/antd/T08';
import AntdT09 from './hover_card/antd/T09';
import AntdT10 from './hover_card/antd/T10';

// Import task-specific components for mui
import MuiT01 from './hover_card/mui/T01';
import MuiT02 from './hover_card/mui/T02';
import MuiT03 from './hover_card/mui/T03';
import MuiT04 from './hover_card/mui/T04';
import MuiT05 from './hover_card/mui/T05';
import MuiT06 from './hover_card/mui/T06';
import MuiT07 from './hover_card/mui/T07';
import MuiT08 from './hover_card/mui/T08';
import MuiT09 from './hover_card/mui/T09';
import MuiT10 from './hover_card/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './hover_card/mantine/T01';
import MantineT02 from './hover_card/mantine/T02';
import MantineT03 from './hover_card/mantine/T03';
import MantineT04 from './hover_card/mantine/T04';
import MantineT05 from './hover_card/mantine/T05';
import MantineT06 from './hover_card/mantine/T06';
import MantineT07 from './hover_card/mantine/T07';
import MantineT08 from './hover_card/mantine/T08';
import MantineT09 from './hover_card/mantine/T09';
import MantineT10 from './hover_card/mantine/T10';

interface HoverCardTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'hover_card-antd-T01': AntdT01,
  'hover_card-antd-T02': AntdT02,
  'hover_card-antd-T03': AntdT03,
  'hover_card-antd-T04': AntdT04,
  'hover_card-antd-T05': AntdT05,
  'hover_card-antd-T06': AntdT06,
  'hover_card-antd-T07': AntdT07,
  'hover_card-antd-T08': AntdT08,
  'hover_card-antd-T09': AntdT09,
  'hover_card-antd-T10': AntdT10,
  // MUI tasks
  'hover_card-mui-T01': MuiT01,
  'hover_card-mui-T02': MuiT02,
  'hover_card-mui-T03': MuiT03,
  'hover_card-mui-T04': MuiT04,
  'hover_card-mui-T05': MuiT05,
  'hover_card-mui-T06': MuiT06,
  'hover_card-mui-T07': MuiT07,
  'hover_card-mui-T08': MuiT08,
  'hover_card-mui-T09': MuiT09,
  'hover_card-mui-T10': MuiT10,
  // Mantine tasks
  'hover_card-mantine-T01': MantineT01,
  'hover_card-mantine-T02': MantineT02,
  'hover_card-mantine-T03': MantineT03,
  'hover_card-mantine-T04': MantineT04,
  'hover_card-mantine-T05': MantineT05,
  'hover_card-mantine-T06': MantineT06,
  'hover_card-mantine-T07': MantineT07,
  'hover_card-mantine-T08': MantineT08,
  'hover_card-mantine-T09': MantineT09,
  'hover_card-mantine-T10': MantineT10,
};

export default function HoverCardTaskRunner({ task }: HoverCardTaskRunnerProps) {
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
