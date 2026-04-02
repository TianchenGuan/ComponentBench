'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './listbox_single/antd/T01';
import AntdT02 from './listbox_single/antd/T02';
import AntdT03 from './listbox_single/antd/T03';
import AntdT04 from './listbox_single/antd/T04';
import AntdT05 from './listbox_single/antd/T05';
import AntdT06 from './listbox_single/antd/T06';
import AntdT07 from './listbox_single/antd/T07';
import AntdT08 from './listbox_single/antd/T08';
import AntdT09 from './listbox_single/antd/T09';
import AntdT10 from './listbox_single/antd/T10';

// Import task-specific components for mui
import MuiT01 from './listbox_single/mui/T01';
import MuiT02 from './listbox_single/mui/T02';
import MuiT03 from './listbox_single/mui/T03';
import MuiT04 from './listbox_single/mui/T04';
import MuiT05 from './listbox_single/mui/T05';
import MuiT06 from './listbox_single/mui/T06';
import MuiT07 from './listbox_single/mui/T07';
import MuiT08 from './listbox_single/mui/T08';
import MuiT09 from './listbox_single/mui/T09';
import MuiT10 from './listbox_single/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './listbox_single/mantine/T01';
import MantineT02 from './listbox_single/mantine/T02';
import MantineT03 from './listbox_single/mantine/T03';
import MantineT04 from './listbox_single/mantine/T04';
import MantineT05 from './listbox_single/mantine/T05';
import MantineT06 from './listbox_single/mantine/T06';
import MantineT07 from './listbox_single/mantine/T07';
import MantineT08 from './listbox_single/mantine/T08';
import MantineT09 from './listbox_single/mantine/T09';
import MantineT10 from './listbox_single/mantine/T10';

// v2 imports
import AntdV2T35 from './listbox_single/antd/v2/T35';
import AntdV2T36 from './listbox_single/antd/v2/T36';
import AntdV2T37 from './listbox_single/antd/v2/T37';
import AntdV2T38 from './listbox_single/antd/v2/T38';
import AntdV2T39 from './listbox_single/antd/v2/T39';
import MuiV2T40 from './listbox_single/mui/v2/T40';
import MuiV2T41 from './listbox_single/mui/v2/T41';
import MuiV2T42 from './listbox_single/mui/v2/T42';
import MuiV2T43 from './listbox_single/mui/v2/T43';
import MuiV2T44 from './listbox_single/mui/v2/T44';
import MantineV2T45 from './listbox_single/mantine/v2/T45';
import MantineV2T46 from './listbox_single/mantine/v2/T46';
import MantineV2T47 from './listbox_single/mantine/v2/T47';
import MantineV2T48 from './listbox_single/mantine/v2/T48';

interface ListboxSingleTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'listbox_single-antd-T01': AntdT01,
  'listbox_single-antd-T02': AntdT02,
  'listbox_single-antd-T03': AntdT03,
  'listbox_single-antd-T04': AntdT04,
  'listbox_single-antd-T05': AntdT05,
  'listbox_single-antd-T06': AntdT06,
  'listbox_single-antd-T07': AntdT07,
  'listbox_single-antd-T08': AntdT08,
  'listbox_single-antd-T09': AntdT09,
  'listbox_single-antd-T10': AntdT10,
  // MUI tasks
  'listbox_single-mui-T01': MuiT01,
  'listbox_single-mui-T02': MuiT02,
  'listbox_single-mui-T03': MuiT03,
  'listbox_single-mui-T04': MuiT04,
  'listbox_single-mui-T05': MuiT05,
  'listbox_single-mui-T06': MuiT06,
  'listbox_single-mui-T07': MuiT07,
  'listbox_single-mui-T08': MuiT08,
  'listbox_single-mui-T09': MuiT09,
  'listbox_single-mui-T10': MuiT10,
  // Mantine tasks
  'listbox_single-mantine-T01': MantineT01,
  'listbox_single-mantine-T02': MantineT02,
  'listbox_single-mantine-T03': MantineT03,
  'listbox_single-mantine-T04': MantineT04,
  'listbox_single-mantine-T05': MantineT05,
  'listbox_single-mantine-T06': MantineT06,
  'listbox_single-mantine-T07': MantineT07,
  'listbox_single-mantine-T08': MantineT08,
  'listbox_single-mantine-T09': MantineT09,
  'listbox_single-mantine-T10': MantineT10,
  // v2
  'listbox_single-antd-v2-T35': AntdV2T35,
  'listbox_single-antd-v2-T36': AntdV2T36,
  'listbox_single-antd-v2-T37': AntdV2T37,
  'listbox_single-antd-v2-T38': AntdV2T38,
  'listbox_single-antd-v2-T39': AntdV2T39,
  'listbox_single-mui-v2-T40': MuiV2T40,
  'listbox_single-mui-v2-T41': MuiV2T41,
  'listbox_single-mui-v2-T42': MuiV2T42,
  'listbox_single-mui-v2-T43': MuiV2T43,
  'listbox_single-mui-v2-T44': MuiV2T44,
  'listbox_single-mantine-v2-T45': MantineV2T45,
  'listbox_single-mantine-v2-T46': MantineV2T46,
  'listbox_single-mantine-v2-T47': MantineV2T47,
  'listbox_single-mantine-v2-T48': MantineV2T48,
};

export default function ListboxSingleTaskRunner({ task }: ListboxSingleTaskRunnerProps) {
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
