'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './tree_view/antd/T01';
import AntdT02 from './tree_view/antd/T02';
import AntdT03 from './tree_view/antd/T03';
import AntdT04 from './tree_view/antd/T04';
import AntdT05 from './tree_view/antd/T05';
import AntdT06 from './tree_view/antd/T06';
import AntdT07 from './tree_view/antd/T07';
import AntdT08 from './tree_view/antd/T08';
import AntdT09 from './tree_view/antd/T09';
import AntdT10 from './tree_view/antd/T10';

// Import task-specific components for mui
import MuiT01 from './tree_view/mui/T01';
import MuiT02 from './tree_view/mui/T02';
import MuiT03 from './tree_view/mui/T03';
import MuiT04 from './tree_view/mui/T04';
import MuiT05 from './tree_view/mui/T05';
import MuiT06 from './tree_view/mui/T06';
import MuiT07 from './tree_view/mui/T07';
import MuiT08 from './tree_view/mui/T08';
import MuiT09 from './tree_view/mui/T09';
import MuiT10 from './tree_view/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './tree_view/mantine/T01';
import MantineT02 from './tree_view/mantine/T02';
import MantineT03 from './tree_view/mantine/T03';
import MantineT04 from './tree_view/mantine/T04';
import MantineT05 from './tree_view/mantine/T05';
import MantineT06 from './tree_view/mantine/T06';
import MantineT07 from './tree_view/mantine/T07';
import MantineT08 from './tree_view/mantine/T08';
import MantineT09 from './tree_view/mantine/T09';
import MantineT10 from './tree_view/mantine/T10';

// v2 imports
import AntdV2T01 from './tree_view/antd/v2/T01'; import AntdV2T02 from './tree_view/antd/v2/T02';
import AntdV2T03 from './tree_view/antd/v2/T03'; import AntdV2T04 from './tree_view/antd/v2/T04';
import AntdV2T05 from './tree_view/antd/v2/T05'; import AntdV2T06 from './tree_view/antd/v2/T06';
import AntdV2T07 from './tree_view/antd/v2/T07'; import AntdV2T08 from './tree_view/antd/v2/T08';
import MuiV2T01 from './tree_view/mui/v2/T01'; import MuiV2T02 from './tree_view/mui/v2/T02';
import MuiV2T03 from './tree_view/mui/v2/T03'; import MuiV2T04 from './tree_view/mui/v2/T04';
import MuiV2T05 from './tree_view/mui/v2/T05'; import MuiV2T06 from './tree_view/mui/v2/T06';
import MuiV2T07 from './tree_view/mui/v2/T07'; import MuiV2T08 from './tree_view/mui/v2/T08';
import MantineV2T01 from './tree_view/mantine/v2/T01'; import MantineV2T02 from './tree_view/mantine/v2/T02';
import MantineV2T03 from './tree_view/mantine/v2/T03'; import MantineV2T04 from './tree_view/mantine/v2/T04';
import MantineV2T05 from './tree_view/mantine/v2/T05'; import MantineV2T06 from './tree_view/mantine/v2/T06';
import MantineV2T07 from './tree_view/mantine/v2/T07'; import MantineV2T08 from './tree_view/mantine/v2/T08';

interface TreeViewTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'tree_view-antd-T01': AntdT01,
  'tree_view-antd-T02': AntdT02,
  'tree_view-antd-T03': AntdT03,
  'tree_view-antd-T04': AntdT04,
  'tree_view-antd-T05': AntdT05,
  'tree_view-antd-T06': AntdT06,
  'tree_view-antd-T07': AntdT07,
  'tree_view-antd-T08': AntdT08,
  'tree_view-antd-T09': AntdT09,
  'tree_view-antd-T10': AntdT10,
  // MUI tasks
  'tree_view-mui-T01': MuiT01,
  'tree_view-mui-T02': MuiT02,
  'tree_view-mui-T03': MuiT03,
  'tree_view-mui-T04': MuiT04,
  'tree_view-mui-T05': MuiT05,
  'tree_view-mui-T06': MuiT06,
  'tree_view-mui-T07': MuiT07,
  'tree_view-mui-T08': MuiT08,
  'tree_view-mui-T09': MuiT09,
  'tree_view-mui-T10': MuiT10,
  // Mantine tasks
  'tree_view-mantine-T01': MantineT01,
  'tree_view-mantine-T02': MantineT02,
  'tree_view-mantine-T03': MantineT03,
  'tree_view-mantine-T04': MantineT04,
  'tree_view-mantine-T05': MantineT05,
  'tree_view-mantine-T06': MantineT06,
  'tree_view-mantine-T07': MantineT07,
  'tree_view-mantine-T08': MantineT08,
  'tree_view-mantine-T09': MantineT09,
  'tree_view-mantine-T10': MantineT10,
  // v2
  'tree_view-antd-v2-T01': AntdV2T01, 'tree_view-antd-v2-T02': AntdV2T02,
  'tree_view-antd-v2-T03': AntdV2T03, 'tree_view-antd-v2-T04': AntdV2T04,
  'tree_view-antd-v2-T05': AntdV2T05, 'tree_view-antd-v2-T06': AntdV2T06,
  'tree_view-antd-v2-T07': AntdV2T07, 'tree_view-antd-v2-T08': AntdV2T08,
  'tree_view-mui-v2-T01': MuiV2T01, 'tree_view-mui-v2-T02': MuiV2T02,
  'tree_view-mui-v2-T03': MuiV2T03, 'tree_view-mui-v2-T04': MuiV2T04,
  'tree_view-mui-v2-T05': MuiV2T05, 'tree_view-mui-v2-T06': MuiV2T06,
  'tree_view-mui-v2-T07': MuiV2T07, 'tree_view-mui-v2-T08': MuiV2T08,
  'tree_view-mantine-v2-T01': MantineV2T01, 'tree_view-mantine-v2-T02': MantineV2T02,
  'tree_view-mantine-v2-T03': MantineV2T03, 'tree_view-mantine-v2-T04': MantineV2T04,
  'tree_view-mantine-v2-T05': MantineV2T05, 'tree_view-mantine-v2-T06': MantineV2T06,
  'tree_view-mantine-v2-T07': MantineV2T07, 'tree_view-mantine-v2-T08': MantineV2T08,
};

export default function TreeViewTaskRunner({ task }: TreeViewTaskRunnerProps) {
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
