'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './data_table_sortable/antd/T01';
import AntdT02 from './data_table_sortable/antd/T02';
import AntdT03 from './data_table_sortable/antd/T03';
import AntdT04 from './data_table_sortable/antd/T04';
import AntdT05 from './data_table_sortable/antd/T05';
import AntdT06 from './data_table_sortable/antd/T06';
import AntdT07 from './data_table_sortable/antd/T07';
import AntdT08 from './data_table_sortable/antd/T08';
import AntdT09 from './data_table_sortable/antd/T09';
import AntdT10 from './data_table_sortable/antd/T10';

// Import task-specific components for mui
import MuiT01 from './data_table_sortable/mui/T01';
import MuiT02 from './data_table_sortable/mui/T02';
import MuiT03 from './data_table_sortable/mui/T03';
import MuiT04 from './data_table_sortable/mui/T04';
import MuiT05 from './data_table_sortable/mui/T05';
import MuiT06 from './data_table_sortable/mui/T06';
import MuiT07 from './data_table_sortable/mui/T07';
import MuiT08 from './data_table_sortable/mui/T08';
import MuiT09 from './data_table_sortable/mui/T09';
import MuiT10 from './data_table_sortable/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './data_table_sortable/mantine/T01';
import MantineT02 from './data_table_sortable/mantine/T02';
import MantineT03 from './data_table_sortable/mantine/T03';
import MantineT04 from './data_table_sortable/mantine/T04';
import MantineT05 from './data_table_sortable/mantine/T05';
import MantineT06 from './data_table_sortable/mantine/T06';
import MantineT07 from './data_table_sortable/mantine/T07';
import MantineT08 from './data_table_sortable/mantine/T08';
import MantineT09 from './data_table_sortable/mantine/T09';
import MantineT10 from './data_table_sortable/mantine/T10';

// v2 imports
import AntdV2T01 from './data_table_sortable/antd/v2/T01'; import AntdV2T02 from './data_table_sortable/antd/v2/T02';
import AntdV2T03 from './data_table_sortable/antd/v2/T03'; import AntdV2T04 from './data_table_sortable/antd/v2/T04';
import AntdV2T05 from './data_table_sortable/antd/v2/T05';
import MuiV2T06 from './data_table_sortable/mui/v2/T06'; import MuiV2T07 from './data_table_sortable/mui/v2/T07';
import MuiV2T08 from './data_table_sortable/mui/v2/T08'; import MuiV2T09 from './data_table_sortable/mui/v2/T09';
import MuiV2T10 from './data_table_sortable/mui/v2/T10'; import MuiV2T11 from './data_table_sortable/mui/v2/T11';
import MantineV2T12 from './data_table_sortable/mantine/v2/T12'; import MantineV2T13 from './data_table_sortable/mantine/v2/T13';
import MantineV2T14 from './data_table_sortable/mantine/v2/T14'; import MantineV2T15 from './data_table_sortable/mantine/v2/T15';
import MantineV2T16 from './data_table_sortable/mantine/v2/T16';

interface DataTableSortableTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks (T01-T10)
  'data_table_sortable-antd-T01': AntdT01,
  'data_table_sortable-antd-T02': AntdT02,
  'data_table_sortable-antd-T03': AntdT03,
  'data_table_sortable-antd-T04': AntdT04,
  'data_table_sortable-antd-T05': AntdT05,
  'data_table_sortable-antd-T06': AntdT06,
  'data_table_sortable-antd-T07': AntdT07,
  'data_table_sortable-antd-T08': AntdT08,
  'data_table_sortable-antd-T09': AntdT09,
  'data_table_sortable-antd-T10': AntdT10,
  // MUI tasks (T11-T20 in YAML, T01-T10 in code)
  'data_table_sortable-mui-T11': MuiT01,
  'data_table_sortable-mui-T12': MuiT02,
  'data_table_sortable-mui-T13': MuiT03,
  'data_table_sortable-mui-T14': MuiT04,
  'data_table_sortable-mui-T15': MuiT05,
  'data_table_sortable-mui-T16': MuiT06,
  'data_table_sortable-mui-T17': MuiT07,
  'data_table_sortable-mui-T18': MuiT08,
  'data_table_sortable-mui-T19': MuiT09,
  'data_table_sortable-mui-T20': MuiT10,
  // Mantine tasks (T21-T30 in YAML, T01-T10 in code)
  'data_table_sortable-mantine-T21': MantineT01,
  'data_table_sortable-mantine-T22': MantineT02,
  'data_table_sortable-mantine-T23': MantineT03,
  'data_table_sortable-mantine-T24': MantineT04,
  'data_table_sortable-mantine-T25': MantineT05,
  'data_table_sortable-mantine-T26': MantineT06,
  'data_table_sortable-mantine-T27': MantineT07,
  'data_table_sortable-mantine-T28': MantineT08,
  'data_table_sortable-mantine-T29': MantineT09,
  'data_table_sortable-mantine-T30': MantineT10,
  // v2
  'data_table_sortable-antd-v2-T01': AntdV2T01, 'data_table_sortable-antd-v2-T02': AntdV2T02,
  'data_table_sortable-antd-v2-T03': AntdV2T03, 'data_table_sortable-antd-v2-T04': AntdV2T04,
  'data_table_sortable-antd-v2-T05': AntdV2T05,
  'data_table_sortable-mui-v2-T06': MuiV2T06, 'data_table_sortable-mui-v2-T07': MuiV2T07,
  'data_table_sortable-mui-v2-T08': MuiV2T08, 'data_table_sortable-mui-v2-T09': MuiV2T09,
  'data_table_sortable-mui-v2-T10': MuiV2T10, 'data_table_sortable-mui-v2-T11': MuiV2T11,
  'data_table_sortable-mantine-v2-T12': MantineV2T12, 'data_table_sortable-mantine-v2-T13': MantineV2T13,
  'data_table_sortable-mantine-v2-T14': MantineV2T14, 'data_table_sortable-mantine-v2-T15': MantineV2T15,
  'data_table_sortable-mantine-v2-T16': MantineV2T16,
};

export default function DataTableSortableTaskRunner({ task }: DataTableSortableTaskRunnerProps) {
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
