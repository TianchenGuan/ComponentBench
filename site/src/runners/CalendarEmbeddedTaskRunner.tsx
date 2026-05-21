'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './calendar_embedded/antd/T01';
import AntdT02 from './calendar_embedded/antd/T02';
import AntdT03 from './calendar_embedded/antd/T03';
import AntdT04 from './calendar_embedded/antd/T04';
import AntdT05 from './calendar_embedded/antd/T05';
import AntdT06 from './calendar_embedded/antd/T06';
import AntdT07 from './calendar_embedded/antd/T07';
import AntdT08 from './calendar_embedded/antd/T08';
import AntdT09 from './calendar_embedded/antd/T09';
import AntdT10 from './calendar_embedded/antd/T10';

// Import task-specific components for mui
import MuiT01 from './calendar_embedded/mui/T01';
import MuiT02 from './calendar_embedded/mui/T02';
import MuiT03 from './calendar_embedded/mui/T03';
import MuiT04 from './calendar_embedded/mui/T04';
import MuiT05 from './calendar_embedded/mui/T05';
import MuiT06 from './calendar_embedded/mui/T06';
import MuiT07 from './calendar_embedded/mui/T07';
import MuiT08 from './calendar_embedded/mui/T08';
import MuiT09 from './calendar_embedded/mui/T09';
import MuiT10 from './calendar_embedded/mui/T10';

// Import task-specific components for mantine
import MantineT01 from './calendar_embedded/mantine/T01';
import MantineT02 from './calendar_embedded/mantine/T02';
import MantineT03 from './calendar_embedded/mantine/T03';
import MantineT04 from './calendar_embedded/mantine/T04';
import MantineT05 from './calendar_embedded/mantine/T05';
import MantineT06 from './calendar_embedded/mantine/T06';
import MantineT07 from './calendar_embedded/mantine/T07';
import MantineT08 from './calendar_embedded/mantine/T08';
import MantineT09 from './calendar_embedded/mantine/T09';
import MantineT10 from './calendar_embedded/mantine/T10';

import AntdV2T41 from './calendar_embedded/antd/v2/T41';
import AntdV2T42 from './calendar_embedded/antd/v2/T42';
import MuiV2T43 from './calendar_embedded/mui/v2/T43';
import MuiV2T44 from './calendar_embedded/mui/v2/T44';
import MuiV2T45 from './calendar_embedded/mui/v2/T45';
import MantineV2T46 from './calendar_embedded/mantine/v2/T46';
import MantineV2T47 from './calendar_embedded/mantine/v2/T47';
import MantineV2T48 from './calendar_embedded/mantine/v2/T48';

interface CalendarEmbeddedTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'calendar_embedded-antd-T01': AntdT01,
  'calendar_embedded-antd-T02': AntdT02,
  'calendar_embedded-antd-T03': AntdT03,
  'calendar_embedded-antd-T04': AntdT04,
  'calendar_embedded-antd-T05': AntdT05,
  'calendar_embedded-antd-T06': AntdT06,
  'calendar_embedded-antd-T07': AntdT07,
  'calendar_embedded-antd-T08': AntdT08,
  'calendar_embedded-antd-T09': AntdT09,
  'calendar_embedded-antd-T10': AntdT10,
  // MUI tasks
  'calendar_embedded-mui-T01': MuiT01,
  'calendar_embedded-mui-T02': MuiT02,
  'calendar_embedded-mui-T03': MuiT03,
  'calendar_embedded-mui-T04': MuiT04,
  'calendar_embedded-mui-T05': MuiT05,
  'calendar_embedded-mui-T06': MuiT06,
  'calendar_embedded-mui-T07': MuiT07,
  'calendar_embedded-mui-T08': MuiT08,
  'calendar_embedded-mui-T09': MuiT09,
  'calendar_embedded-mui-T10': MuiT10,
  // Mantine tasks
  'calendar_embedded-mantine-T01': MantineT01,
  'calendar_embedded-mantine-T02': MantineT02,
  'calendar_embedded-mantine-T03': MantineT03,
  'calendar_embedded-mantine-T04': MantineT04,
  'calendar_embedded-mantine-T05': MantineT05,
  'calendar_embedded-mantine-T06': MantineT06,
  'calendar_embedded-mantine-T07': MantineT07,
  'calendar_embedded-mantine-T08': MantineT08,
  'calendar_embedded-mantine-T09': MantineT09,
  'calendar_embedded-mantine-T10': MantineT10,
  'calendar_embedded-antd-v2-T41': AntdV2T41,
  'calendar_embedded-antd-v2-T42': AntdV2T42,
  'calendar_embedded-mui-v2-T43': MuiV2T43,
  'calendar_embedded-mui-v2-T44': MuiV2T44,
  'calendar_embedded-mui-v2-T45': MuiV2T45,
  'calendar_embedded-mantine-v2-T46': MantineV2T46,
  'calendar_embedded-mantine-v2-T47': MantineV2T47,
  'calendar_embedded-mantine-v2-T48': MantineV2T48,
};

export default function CalendarEmbeddedTaskRunner({ task }: CalendarEmbeddedTaskRunnerProps) {
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
