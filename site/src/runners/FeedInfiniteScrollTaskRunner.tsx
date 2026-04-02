'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './feed_infinite_scroll/antd/T01';
import AntdT02 from './feed_infinite_scroll/antd/T02';
import AntdT03 from './feed_infinite_scroll/antd/T03';
import AntdT04 from './feed_infinite_scroll/antd/T04';
import AntdT05 from './feed_infinite_scroll/antd/T05';
import AntdT06 from './feed_infinite_scroll/antd/T06';
import AntdT07 from './feed_infinite_scroll/antd/T07';
import AntdT08 from './feed_infinite_scroll/antd/T08';
import AntdT09 from './feed_infinite_scroll/antd/T09';
import AntdT10 from './feed_infinite_scroll/antd/T10';

// Import v2 task-specific components for antd
import AntdV2T01 from './feed_infinite_scroll/antd/v2/T01';
import AntdV2T02 from './feed_infinite_scroll/antd/v2/T02';
import AntdV2T03 from './feed_infinite_scroll/antd/v2/T03';
import AntdV2T04 from './feed_infinite_scroll/antd/v2/T04';
import AntdV2T05 from './feed_infinite_scroll/antd/v2/T05';
import AntdV2T06 from './feed_infinite_scroll/antd/v2/T06';
import AntdV2T07 from './feed_infinite_scroll/antd/v2/T07';
import AntdV2T08 from './feed_infinite_scroll/antd/v2/T08';

// Import task-specific components for mui
import MuiT01 from './feed_infinite_scroll/mui/T01';
import MuiT02 from './feed_infinite_scroll/mui/T02';
import MuiT03 from './feed_infinite_scroll/mui/T03';
import MuiT04 from './feed_infinite_scroll/mui/T04';
import MuiT05 from './feed_infinite_scroll/mui/T05';
import MuiT06 from './feed_infinite_scroll/mui/T06';
import MuiT07 from './feed_infinite_scroll/mui/T07';
import MuiT08 from './feed_infinite_scroll/mui/T08';
import MuiT09 from './feed_infinite_scroll/mui/T09';
import MuiT10 from './feed_infinite_scroll/mui/T10';

// Import v2 task-specific components for mui
import MuiV2T01 from './feed_infinite_scroll/mui/v2/T01';
import MuiV2T02 from './feed_infinite_scroll/mui/v2/T02';
import MuiV2T03 from './feed_infinite_scroll/mui/v2/T03';
import MuiV2T04 from './feed_infinite_scroll/mui/v2/T04';
import MuiV2T05 from './feed_infinite_scroll/mui/v2/T05';
import MuiV2T06 from './feed_infinite_scroll/mui/v2/T06';
import MuiV2T07 from './feed_infinite_scroll/mui/v2/T07';
import MuiV2T08 from './feed_infinite_scroll/mui/v2/T08';

// Import task-specific components for mantine
import MantineT01 from './feed_infinite_scroll/mantine/T01';
import MantineT02 from './feed_infinite_scroll/mantine/T02';
import MantineT03 from './feed_infinite_scroll/mantine/T03';
import MantineT04 from './feed_infinite_scroll/mantine/T04';
import MantineT05 from './feed_infinite_scroll/mantine/T05';
import MantineT06 from './feed_infinite_scroll/mantine/T06';
import MantineT07 from './feed_infinite_scroll/mantine/T07';
import MantineT08 from './feed_infinite_scroll/mantine/T08';
import MantineT09 from './feed_infinite_scroll/mantine/T09';
import MantineT10 from './feed_infinite_scroll/mantine/T10';

// Import v2 task-specific components for mantine
import MantineV2T01 from './feed_infinite_scroll/mantine/v2/T01';
import MantineV2T02 from './feed_infinite_scroll/mantine/v2/T02';
import MantineV2T03 from './feed_infinite_scroll/mantine/v2/T03';
import MantineV2T04 from './feed_infinite_scroll/mantine/v2/T04';
import MantineV2T05 from './feed_infinite_scroll/mantine/v2/T05';
import MantineV2T06 from './feed_infinite_scroll/mantine/v2/T06';
import MantineV2T07 from './feed_infinite_scroll/mantine/v2/T07';
import MantineV2T08 from './feed_infinite_scroll/mantine/v2/T08';

interface FeedInfiniteScrollTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'feed_infinite_scroll-antd-T01': AntdT01,
  'feed_infinite_scroll-antd-T02': AntdT02,
  'feed_infinite_scroll-antd-T03': AntdT03,
  'feed_infinite_scroll-antd-T04': AntdT04,
  'feed_infinite_scroll-antd-T05': AntdT05,
  'feed_infinite_scroll-antd-T06': AntdT06,
  'feed_infinite_scroll-antd-T07': AntdT07,
  'feed_infinite_scroll-antd-T08': AntdT08,
  'feed_infinite_scroll-antd-T09': AntdT09,
  'feed_infinite_scroll-antd-T10': AntdT10,
  // Antd v2 tasks
  'feed_infinite_scroll-antd-v2-T01': AntdV2T01,
  'feed_infinite_scroll-antd-v2-T02': AntdV2T02,
  'feed_infinite_scroll-antd-v2-T03': AntdV2T03,
  'feed_infinite_scroll-antd-v2-T04': AntdV2T04,
  'feed_infinite_scroll-antd-v2-T05': AntdV2T05,
  'feed_infinite_scroll-antd-v2-T06': AntdV2T06,
  'feed_infinite_scroll-antd-v2-T07': AntdV2T07,
  'feed_infinite_scroll-antd-v2-T08': AntdV2T08,
  // MUI tasks
  'feed_infinite_scroll-mui-T01': MuiT01,
  'feed_infinite_scroll-mui-T02': MuiT02,
  'feed_infinite_scroll-mui-T03': MuiT03,
  'feed_infinite_scroll-mui-T04': MuiT04,
  'feed_infinite_scroll-mui-T05': MuiT05,
  'feed_infinite_scroll-mui-T06': MuiT06,
  'feed_infinite_scroll-mui-T07': MuiT07,
  'feed_infinite_scroll-mui-T08': MuiT08,
  'feed_infinite_scroll-mui-T09': MuiT09,
  'feed_infinite_scroll-mui-T10': MuiT10,
  // MUI v2 tasks
  'feed_infinite_scroll-mui-v2-T01': MuiV2T01,
  'feed_infinite_scroll-mui-v2-T02': MuiV2T02,
  'feed_infinite_scroll-mui-v2-T03': MuiV2T03,
  'feed_infinite_scroll-mui-v2-T04': MuiV2T04,
  'feed_infinite_scroll-mui-v2-T05': MuiV2T05,
  'feed_infinite_scroll-mui-v2-T06': MuiV2T06,
  'feed_infinite_scroll-mui-v2-T07': MuiV2T07,
  'feed_infinite_scroll-mui-v2-T08': MuiV2T08,
  // Mantine tasks
  'feed_infinite_scroll-mantine-T01': MantineT01,
  'feed_infinite_scroll-mantine-T02': MantineT02,
  'feed_infinite_scroll-mantine-T03': MantineT03,
  'feed_infinite_scroll-mantine-T04': MantineT04,
  'feed_infinite_scroll-mantine-T05': MantineT05,
  'feed_infinite_scroll-mantine-T06': MantineT06,
  'feed_infinite_scroll-mantine-T07': MantineT07,
  'feed_infinite_scroll-mantine-T08': MantineT08,
  'feed_infinite_scroll-mantine-T09': MantineT09,
  'feed_infinite_scroll-mantine-T10': MantineT10,
  // Mantine v2 tasks
  'feed_infinite_scroll-mantine-v2-T01': MantineV2T01,
  'feed_infinite_scroll-mantine-v2-T02': MantineV2T02,
  'feed_infinite_scroll-mantine-v2-T03': MantineV2T03,
  'feed_infinite_scroll-mantine-v2-T04': MantineV2T04,
  'feed_infinite_scroll-mantine-v2-T05': MantineV2T05,
  'feed_infinite_scroll-mantine-v2-T06': MantineV2T06,
  'feed_infinite_scroll-mantine-v2-T07': MantineV2T07,
  'feed_infinite_scroll-mantine-v2-T08': MantineV2T08,
};

export default function FeedInfiniteScrollTaskRunner({ task }: FeedInfiniteScrollTaskRunnerProps) {
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
