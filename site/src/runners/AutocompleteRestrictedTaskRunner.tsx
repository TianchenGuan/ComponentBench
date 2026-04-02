'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './autocomplete_restricted/antd/T01';
import AntdT02 from './autocomplete_restricted/antd/T02';
import AntdT03 from './autocomplete_restricted/antd/T03';
import AntdT04 from './autocomplete_restricted/antd/T04';
import AntdT05 from './autocomplete_restricted/antd/T05';
import AntdT06 from './autocomplete_restricted/antd/T06';
import AntdT07 from './autocomplete_restricted/antd/T07';
import AntdT08 from './autocomplete_restricted/antd/T08';
import AntdT09 from './autocomplete_restricted/antd/T09';
import AntdT10 from './autocomplete_restricted/antd/T10';

// Import task-specific components for mui
import MuiT01 from './autocomplete_restricted/mui/T01';
import MuiT02 from './autocomplete_restricted/mui/T02';
import MuiT03 from './autocomplete_restricted/mui/T03';
import MuiT04 from './autocomplete_restricted/mui/T04';
import MuiT05 from './autocomplete_restricted/mui/T05';
import MuiT06 from './autocomplete_restricted/mui/T06';
import MuiT07 from './autocomplete_restricted/mui/T07';
import MuiT08 from './autocomplete_restricted/mui/T08';
import MuiT09 from './autocomplete_restricted/mui/T09';
import MuiT10 from './autocomplete_restricted/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './autocomplete_restricted/mantine/T01';
import MantineT02 from './autocomplete_restricted/mantine/T02';
import MantineT03 from './autocomplete_restricted/mantine/T03';
import MantineT04 from './autocomplete_restricted/mantine/T04';
import MantineT05 from './autocomplete_restricted/mantine/T05';
import MantineT06 from './autocomplete_restricted/mantine/T06';
import MantineT07 from './autocomplete_restricted/mantine/T07';
import MantineT08 from './autocomplete_restricted/mantine/T08';
import MantineT09 from './autocomplete_restricted/mantine/T09';
import MantineT10 from './autocomplete_restricted/mantine/T10';

// v2 imports
import AntdV2T01 from './autocomplete_restricted/antd/v2/T01';
import AntdV2T02 from './autocomplete_restricted/antd/v2/T02';
import AntdV2T03 from './autocomplete_restricted/antd/v2/T03';
import AntdV2T04 from './autocomplete_restricted/antd/v2/T04';
import MuiV2T01 from './autocomplete_restricted/mui/v2/T01';
import MuiV2T02 from './autocomplete_restricted/mui/v2/T02';
import MuiV2T03 from './autocomplete_restricted/mui/v2/T03';
import MuiV2T04 from './autocomplete_restricted/mui/v2/T04';
import MantineV2T01 from './autocomplete_restricted/mantine/v2/T01';
import MantineV2T02 from './autocomplete_restricted/mantine/v2/T02';
import MantineV2T03 from './autocomplete_restricted/mantine/v2/T03';
import MantineV2T04 from './autocomplete_restricted/mantine/v2/T04';

interface AutocompleteRestrictedTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'autocomplete_restricted-antd-T01': AntdT01,
  'autocomplete_restricted-antd-T02': AntdT02,
  'autocomplete_restricted-antd-T03': AntdT03,
  'autocomplete_restricted-antd-T04': AntdT04,
  'autocomplete_restricted-antd-T05': AntdT05,
  'autocomplete_restricted-antd-T06': AntdT06,
  'autocomplete_restricted-antd-T07': AntdT07,
  'autocomplete_restricted-antd-T08': AntdT08,
  'autocomplete_restricted-antd-T09': AntdT09,
  'autocomplete_restricted-antd-T10': AntdT10,
  // MUI tasks
  'autocomplete_restricted-mui-T01': MuiT01,
  'autocomplete_restricted-mui-T02': MuiT02,
  'autocomplete_restricted-mui-T03': MuiT03,
  'autocomplete_restricted-mui-T04': MuiT04,
  'autocomplete_restricted-mui-T05': MuiT05,
  'autocomplete_restricted-mui-T06': MuiT06,
  'autocomplete_restricted-mui-T07': MuiT07,
  'autocomplete_restricted-mui-T08': MuiT08,
  'autocomplete_restricted-mui-T09': MuiT09,
  'autocomplete_restricted-mui-T10': MuiT10,
  // Mantine tasks
  'autocomplete_restricted-mantine-T01': MantineT01,
  'autocomplete_restricted-mantine-T02': MantineT02,
  'autocomplete_restricted-mantine-T03': MantineT03,
  'autocomplete_restricted-mantine-T04': MantineT04,
  'autocomplete_restricted-mantine-T05': MantineT05,
  'autocomplete_restricted-mantine-T06': MantineT06,
  'autocomplete_restricted-mantine-T07': MantineT07,
  'autocomplete_restricted-mantine-T08': MantineT08,
  'autocomplete_restricted-mantine-T09': MantineT09,
  'autocomplete_restricted-mantine-T10': MantineT10,
  // v2
  'autocomplete_restricted-antd-v2-T01': AntdV2T01,
  'autocomplete_restricted-antd-v2-T02': AntdV2T02,
  'autocomplete_restricted-antd-v2-T03': AntdV2T03,
  'autocomplete_restricted-antd-v2-T04': AntdV2T04,
  'autocomplete_restricted-mui-v2-T01': MuiV2T01,
  'autocomplete_restricted-mui-v2-T02': MuiV2T02,
  'autocomplete_restricted-mui-v2-T03': MuiV2T03,
  'autocomplete_restricted-mui-v2-T04': MuiV2T04,
  'autocomplete_restricted-mantine-v2-T01': MantineV2T01,
  'autocomplete_restricted-mantine-v2-T02': MantineV2T02,
  'autocomplete_restricted-mantine-v2-T03': MantineV2T03,
  'autocomplete_restricted-mantine-v2-T04': MantineV2T04,
};

export default function AutocompleteRestrictedTaskRunner({ task }: AutocompleteRestrictedTaskRunnerProps) {
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
