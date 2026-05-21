'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './drag_drop_sortable_list/antd/T01';
import AntdT02 from './drag_drop_sortable_list/antd/T02';
import AntdT03 from './drag_drop_sortable_list/antd/T03';
import AntdT04 from './drag_drop_sortable_list/antd/T04';
import AntdT05 from './drag_drop_sortable_list/antd/T05';
import AntdT06 from './drag_drop_sortable_list/antd/T06';
import AntdT07 from './drag_drop_sortable_list/antd/T07';
import AntdT08 from './drag_drop_sortable_list/antd/T08';
import AntdT09 from './drag_drop_sortable_list/antd/T09';
import AntdT10 from './drag_drop_sortable_list/antd/T10';
import AntdV2T01 from './drag_drop_sortable_list/antd/v2/T01';
import AntdV2T02 from './drag_drop_sortable_list/antd/v2/T02';
import AntdV2T03 from './drag_drop_sortable_list/antd/v2/T03';
import AntdV2T04 from './drag_drop_sortable_list/antd/v2/T04';
import AntdV2T05 from './drag_drop_sortable_list/antd/v2/T05';
import AntdV2T06 from './drag_drop_sortable_list/antd/v2/T06';

// Import task-specific components for mui
import MuiT01 from './drag_drop_sortable_list/mui/T01';
import MuiT02 from './drag_drop_sortable_list/mui/T02';
import MuiT03 from './drag_drop_sortable_list/mui/T03';
import MuiT04 from './drag_drop_sortable_list/mui/T04';
import MuiT05 from './drag_drop_sortable_list/mui/T05';
import MuiT06 from './drag_drop_sortable_list/mui/T06';
import MuiT07 from './drag_drop_sortable_list/mui/T07';
import MuiT08 from './drag_drop_sortable_list/mui/T08';
import MuiT09 from './drag_drop_sortable_list/mui/T09';
import MuiT10 from './drag_drop_sortable_list/mui/T10';
import MuiV2T07 from './drag_drop_sortable_list/mui/v2/T07';
import MuiV2T08 from './drag_drop_sortable_list/mui/v2/T08';
import MuiV2T09 from './drag_drop_sortable_list/mui/v2/T09';
import MuiV2T10 from './drag_drop_sortable_list/mui/v2/T10';
import MuiV2T11 from './drag_drop_sortable_list/mui/v2/T11';

// Import task-specific components for mantine
import MantineT01 from './drag_drop_sortable_list/mantine/T01';
import MantineT02 from './drag_drop_sortable_list/mantine/T02';
import MantineT03 from './drag_drop_sortable_list/mantine/T03';
import MantineT04 from './drag_drop_sortable_list/mantine/T04';
import MantineT05 from './drag_drop_sortable_list/mantine/T05';
import MantineT06 from './drag_drop_sortable_list/mantine/T06';
import MantineT07 from './drag_drop_sortable_list/mantine/T07';
import MantineT08 from './drag_drop_sortable_list/mantine/T08';
import MantineT09 from './drag_drop_sortable_list/mantine/T09';
import MantineT10 from './drag_drop_sortable_list/mantine/T10';
import MantineV2T12 from './drag_drop_sortable_list/mantine/v2/T12';
import MantineV2T13 from './drag_drop_sortable_list/mantine/v2/T13';
import MantineV2T14 from './drag_drop_sortable_list/mantine/v2/T14';
import MantineV2T15 from './drag_drop_sortable_list/mantine/v2/T15';
import MantineV2T16 from './drag_drop_sortable_list/mantine/v2/T16';

interface DragDropSortableListTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'drag_drop_sortable_list-antd-T01': AntdT01,
  'drag_drop_sortable_list-antd-T02': AntdT02,
  'drag_drop_sortable_list-antd-T03': AntdT03,
  'drag_drop_sortable_list-antd-T04': AntdT04,
  'drag_drop_sortable_list-antd-T05': AntdT05,
  'drag_drop_sortable_list-antd-T06': AntdT06,
  'drag_drop_sortable_list-antd-T07': AntdT07,
  'drag_drop_sortable_list-antd-T08': AntdT08,
  'drag_drop_sortable_list-antd-T09': AntdT09,
  'drag_drop_sortable_list-antd-T10': AntdT10,
  'drag_drop_sortable_list-antd-v2-T01': AntdV2T01,
  'drag_drop_sortable_list-antd-v2-T02': AntdV2T02,
  'drag_drop_sortable_list-antd-v2-T03': AntdV2T03,
  'drag_drop_sortable_list-antd-v2-T04': AntdV2T04,
  'drag_drop_sortable_list-antd-v2-T05': AntdV2T05,
  'drag_drop_sortable_list-antd-v2-T06': AntdV2T06,
  // MUI tasks
  'drag_drop_sortable_list-mui-T01': MuiT01,
  'drag_drop_sortable_list-mui-T02': MuiT02,
  'drag_drop_sortable_list-mui-T03': MuiT03,
  'drag_drop_sortable_list-mui-T04': MuiT04,
  'drag_drop_sortable_list-mui-T05': MuiT05,
  'drag_drop_sortable_list-mui-T06': MuiT06,
  'drag_drop_sortable_list-mui-T07': MuiT07,
  'drag_drop_sortable_list-mui-T08': MuiT08,
  'drag_drop_sortable_list-mui-T09': MuiT09,
  'drag_drop_sortable_list-mui-T10': MuiT10,
  'drag_drop_sortable_list-mui-v2-T07': MuiV2T07,
  'drag_drop_sortable_list-mui-v2-T08': MuiV2T08,
  'drag_drop_sortable_list-mui-v2-T09': MuiV2T09,
  'drag_drop_sortable_list-mui-v2-T10': MuiV2T10,
  'drag_drop_sortable_list-mui-v2-T11': MuiV2T11,
  // Mantine tasks
  'drag_drop_sortable_list-mantine-T01': MantineT01,
  'drag_drop_sortable_list-mantine-T02': MantineT02,
  'drag_drop_sortable_list-mantine-T03': MantineT03,
  'drag_drop_sortable_list-mantine-T04': MantineT04,
  'drag_drop_sortable_list-mantine-T05': MantineT05,
  'drag_drop_sortable_list-mantine-T06': MantineT06,
  'drag_drop_sortable_list-mantine-T07': MantineT07,
  'drag_drop_sortable_list-mantine-T08': MantineT08,
  'drag_drop_sortable_list-mantine-T09': MantineT09,
  'drag_drop_sortable_list-mantine-T10': MantineT10,
  'drag_drop_sortable_list-mantine-v2-T12': MantineV2T12,
  'drag_drop_sortable_list-mantine-v2-T13': MantineV2T13,
  'drag_drop_sortable_list-mantine-v2-T14': MantineV2T14,
  'drag_drop_sortable_list-mantine-v2-T15': MantineV2T15,
  'drag_drop_sortable_list-mantine-v2-T16': MantineV2T16,
};

export default function DragDropSortableListTaskRunner({ task }: DragDropSortableListTaskRunnerProps) {
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
