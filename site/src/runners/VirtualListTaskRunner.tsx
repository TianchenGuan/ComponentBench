'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './virtual_list/antd/T01';
import AntdT02 from './virtual_list/antd/T02';
import AntdT03 from './virtual_list/antd/T03';
import AntdT04 from './virtual_list/antd/T04';
import AntdT05 from './virtual_list/antd/T05';
import AntdT06 from './virtual_list/antd/T06';
import AntdT07 from './virtual_list/antd/T07';
import AntdT08 from './virtual_list/antd/T08';
import AntdT09 from './virtual_list/antd/T09';
import AntdT10 from './virtual_list/antd/T10';

// Import task-specific components for mui
import MuiT01 from './virtual_list/mui/T01';
import MuiT02 from './virtual_list/mui/T02';
import MuiT03 from './virtual_list/mui/T03';
import MuiT04 from './virtual_list/mui/T04';
import MuiT05 from './virtual_list/mui/T05';
import MuiT06 from './virtual_list/mui/T06';
import MuiT07 from './virtual_list/mui/T07';
import MuiT08 from './virtual_list/mui/T08';
import MuiT09 from './virtual_list/mui/T09';
import MuiT10 from './virtual_list/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './virtual_list/mantine/T01';
import MantineT02 from './virtual_list/mantine/T02';
import MantineT03 from './virtual_list/mantine/T03';
import MantineT04 from './virtual_list/mantine/T04';
import MantineT05 from './virtual_list/mantine/T05';
import MantineT06 from './virtual_list/mantine/T06';
import MantineT07 from './virtual_list/mantine/T07';
import MantineT08 from './virtual_list/mantine/T08';
import MantineT09 from './virtual_list/mantine/T09';
import MantineT10 from './virtual_list/mantine/T10';

// Import v2 task-specific components for antd
import AntdV2T01 from './virtual_list/antd/v2/T01';
import AntdV2T02 from './virtual_list/antd/v2/T02';
import AntdV2T03 from './virtual_list/antd/v2/T03';
import AntdV2T04 from './virtual_list/antd/v2/T04';
import AntdV2T05 from './virtual_list/antd/v2/T05';
import AntdV2T06 from './virtual_list/antd/v2/T06';
import AntdV2T07 from './virtual_list/antd/v2/T07';
import AntdV2T08 from './virtual_list/antd/v2/T08';

// Import v2 task-specific components for mui
import MuiV2T01 from './virtual_list/mui/v2/T01';
import MuiV2T02 from './virtual_list/mui/v2/T02';
import MuiV2T03 from './virtual_list/mui/v2/T03';
import MuiV2T04 from './virtual_list/mui/v2/T04';
import MuiV2T05 from './virtual_list/mui/v2/T05';
import MuiV2T06 from './virtual_list/mui/v2/T06';
import MuiV2T07 from './virtual_list/mui/v2/T07';
import MuiV2T08 from './virtual_list/mui/v2/T08';

// Import v2 task-specific components for mantine
import MantineV2T01 from './virtual_list/mantine/v2/T01';
import MantineV2T02 from './virtual_list/mantine/v2/T02';
import MantineV2T03 from './virtual_list/mantine/v2/T03';
import MantineV2T04 from './virtual_list/mantine/v2/T04';
import MantineV2T05 from './virtual_list/mantine/v2/T05';
import MantineV2T06 from './virtual_list/mantine/v2/T06';
import MantineV2T07 from './virtual_list/mantine/v2/T07';
import MantineV2T08 from './virtual_list/mantine/v2/T08';

interface VirtualListTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks (T01-T10)
  'virtual_list-antd-T01': AntdT01,
  'virtual_list-antd-T02': AntdT02,
  'virtual_list-antd-T03': AntdT03,
  'virtual_list-antd-T04': AntdT04,
  'virtual_list-antd-T05': AntdT05,
  'virtual_list-antd-T06': AntdT06,
  'virtual_list-antd-T07': AntdT07,
  'virtual_list-antd-T08': AntdT08,
  'virtual_list-antd-T09': AntdT09,
  'virtual_list-antd-T10': AntdT10,
  // MUI tasks (T01-T10)
  'virtual_list-mui-T01': MuiT01,
  'virtual_list-mui-T02': MuiT02,
  'virtual_list-mui-T03': MuiT03,
  'virtual_list-mui-T04': MuiT04,
  'virtual_list-mui-T05': MuiT05,
  'virtual_list-mui-T06': MuiT06,
  'virtual_list-mui-T07': MuiT07,
  'virtual_list-mui-T08': MuiT08,
  'virtual_list-mui-T09': MuiT09,
  'virtual_list-mui-T10': MuiT10,
  // Mantine tasks (T01-T10)
  'virtual_list-mantine-T01': MantineT01,
  'virtual_list-mantine-T02': MantineT02,
  'virtual_list-mantine-T03': MantineT03,
  'virtual_list-mantine-T04': MantineT04,
  'virtual_list-mantine-T05': MantineT05,
  'virtual_list-mantine-T06': MantineT06,
  'virtual_list-mantine-T07': MantineT07,
  'virtual_list-mantine-T08': MantineT08,
  'virtual_list-mantine-T09': MantineT09,
  'virtual_list-mantine-T10': MantineT10,
  // Antd v2 tasks (T01-T08)
  'virtual_list-antd-v2-T01': AntdV2T01,
  'virtual_list-antd-v2-T02': AntdV2T02,
  'virtual_list-antd-v2-T03': AntdV2T03,
  'virtual_list-antd-v2-T04': AntdV2T04,
  'virtual_list-antd-v2-T05': AntdV2T05,
  'virtual_list-antd-v2-T06': AntdV2T06,
  'virtual_list-antd-v2-T07': AntdV2T07,
  'virtual_list-antd-v2-T08': AntdV2T08,
  // MUI v2 tasks (T01-T08)
  'virtual_list-mui-v2-T01': MuiV2T01,
  'virtual_list-mui-v2-T02': MuiV2T02,
  'virtual_list-mui-v2-T03': MuiV2T03,
  'virtual_list-mui-v2-T04': MuiV2T04,
  'virtual_list-mui-v2-T05': MuiV2T05,
  'virtual_list-mui-v2-T06': MuiV2T06,
  'virtual_list-mui-v2-T07': MuiV2T07,
  'virtual_list-mui-v2-T08': MuiV2T08,
  // Mantine v2 tasks (T01-T08)
  'virtual_list-mantine-v2-T01': MantineV2T01,
  'virtual_list-mantine-v2-T02': MantineV2T02,
  'virtual_list-mantine-v2-T03': MantineV2T03,
  'virtual_list-mantine-v2-T04': MantineV2T04,
  'virtual_list-mantine-v2-T05': MantineV2T05,
  'virtual_list-mantine-v2-T06': MantineV2T06,
  'virtual_list-mantine-v2-T07': MantineV2T07,
  'virtual_list-mantine-v2-T08': MantineV2T08,
};

export default function VirtualListTaskRunner({ task }: VirtualListTaskRunnerProps) {
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
