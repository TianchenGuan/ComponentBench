'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './accordion/antd/T01';
import AntdT02 from './accordion/antd/T02';
import AntdT03 from './accordion/antd/T03';
import AntdT04 from './accordion/antd/T04';
import AntdT05 from './accordion/antd/T05';
import AntdT06 from './accordion/antd/T06';
import AntdT07 from './accordion/antd/T07';
import AntdT08 from './accordion/antd/T08';
import AntdT09 from './accordion/antd/T09';
import AntdT10 from './accordion/antd/T10';

// Import task-specific components for mui
import MuiT01 from './accordion/mui/T01';
import MuiT02 from './accordion/mui/T02';
import MuiT03 from './accordion/mui/T03';
import MuiT04 from './accordion/mui/T04';
import MuiT05 from './accordion/mui/T05';
import MuiT06 from './accordion/mui/T06';
import MuiT07 from './accordion/mui/T07';
import MuiT08 from './accordion/mui/T08';
import MuiT09 from './accordion/mui/T09';
import MuiT10 from './accordion/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './accordion/mantine/T01';
import MantineT02 from './accordion/mantine/T02';
import MantineT03 from './accordion/mantine/T03';
import MantineT04 from './accordion/mantine/T04';
import MantineT05 from './accordion/mantine/T05';
import MantineT06 from './accordion/mantine/T06';
import MantineT07 from './accordion/mantine/T07';
import MantineT08 from './accordion/mantine/T08';
import MantineT09 from './accordion/mantine/T09';
import MantineT10 from './accordion/mantine/T10';

interface AccordionTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'accordion-antd-T01': AntdT01,
  'accordion-antd-T02': AntdT02,
  'accordion-antd-T03': AntdT03,
  'accordion-antd-T04': AntdT04,
  'accordion-antd-T05': AntdT05,
  'accordion-antd-T06': AntdT06,
  'accordion-antd-T07': AntdT07,
  'accordion-antd-T08': AntdT08,
  'accordion-antd-T09': AntdT09,
  'accordion-antd-T10': AntdT10,
  // MUI tasks
  'accordion-mui-T01': MuiT01,
  'accordion-mui-T02': MuiT02,
  'accordion-mui-T03': MuiT03,
  'accordion-mui-T04': MuiT04,
  'accordion-mui-T05': MuiT05,
  'accordion-mui-T06': MuiT06,
  'accordion-mui-T07': MuiT07,
  'accordion-mui-T08': MuiT08,
  'accordion-mui-T09': MuiT09,
  'accordion-mui-T10': MuiT10,
  // Mantine tasks
  'accordion-mantine-T01': MantineT01,
  'accordion-mantine-T02': MantineT02,
  'accordion-mantine-T03': MantineT03,
  'accordion-mantine-T04': MantineT04,
  'accordion-mantine-T05': MantineT05,
  'accordion-mantine-T06': MantineT06,
  'accordion-mantine-T07': MantineT07,
  'accordion-mantine-T08': MantineT08,
  'accordion-mantine-T09': MantineT09,
  'accordion-mantine-T10': MantineT10,
};

export default function AccordionTaskRunner({ task }: AccordionTaskRunnerProps) {
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
