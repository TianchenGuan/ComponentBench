'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './tabs/antd/T01';
import AntdT02 from './tabs/antd/T02';
import AntdT03 from './tabs/antd/T03';
import AntdT04 from './tabs/antd/T04';
import AntdT05 from './tabs/antd/T05';
import AntdT06 from './tabs/antd/T06';
import AntdT07 from './tabs/antd/T07';
import AntdT08 from './tabs/antd/T08';
import AntdT09 from './tabs/antd/T09';
import AntdT10 from './tabs/antd/T10';

// Import task-specific components for mui
import MuiT01 from './tabs/mui/T01';
import MuiT02 from './tabs/mui/T02';
import MuiT03 from './tabs/mui/T03';
import MuiT04 from './tabs/mui/T04';
import MuiT05 from './tabs/mui/T05';
import MuiT06 from './tabs/mui/T06';
import MuiT07 from './tabs/mui/T07';
import MuiT08 from './tabs/mui/T08';
import MuiT09 from './tabs/mui/T09';
import MuiT10 from './tabs/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './tabs/mantine/T01';
import MantineT02 from './tabs/mantine/T02';
import MantineT03 from './tabs/mantine/T03';
import MantineT04 from './tabs/mantine/T04';
import MantineT05 from './tabs/mantine/T05';
import MantineT06 from './tabs/mantine/T06';
import MantineT07 from './tabs/mantine/T07';
import MantineT08 from './tabs/mantine/T08';
import MantineT09 from './tabs/mantine/T09';
import MantineT10 from './tabs/mantine/T10';

interface TabsTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'tabs-antd-T01': AntdT01,
  'tabs-antd-T02': AntdT02,
  'tabs-antd-T03': AntdT03,
  'tabs-antd-T04': AntdT04,
  'tabs-antd-T05': AntdT05,
  'tabs-antd-T06': AntdT06,
  'tabs-antd-T07': AntdT07,
  'tabs-antd-T08': AntdT08,
  'tabs-antd-T09': AntdT09,
  'tabs-antd-T10': AntdT10,
  // MUI tasks
  'tabs-mui-T01': MuiT01,
  'tabs-mui-T02': MuiT02,
  'tabs-mui-T03': MuiT03,
  'tabs-mui-T04': MuiT04,
  'tabs-mui-T05': MuiT05,
  'tabs-mui-T06': MuiT06,
  'tabs-mui-T07': MuiT07,
  'tabs-mui-T08': MuiT08,
  'tabs-mui-T09': MuiT09,
  'tabs-mui-T10': MuiT10,
  // Mantine tasks
  'tabs-mantine-T01': MantineT01,
  'tabs-mantine-T02': MantineT02,
  'tabs-mantine-T03': MantineT03,
  'tabs-mantine-T04': MantineT04,
  'tabs-mantine-T05': MantineT05,
  'tabs-mantine-T06': MantineT06,
  'tabs-mantine-T07': MantineT07,
  'tabs-mantine-T08': MantineT08,
  'tabs-mantine-T09': MantineT09,
  'tabs-mantine-T10': MantineT10,
};

export default function TabsTaskRunner({ task }: TabsTaskRunnerProps) {
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
