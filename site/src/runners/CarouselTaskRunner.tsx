'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './carousel/antd/T01';
import AntdT02 from './carousel/antd/T02';
import AntdT03 from './carousel/antd/T03';
import AntdT04 from './carousel/antd/T04';
import AntdT05 from './carousel/antd/T05';
import AntdT06 from './carousel/antd/T06';
import AntdT07 from './carousel/antd/T07';
import AntdT08 from './carousel/antd/T08';
import AntdT09 from './carousel/antd/T09';
import AntdT10 from './carousel/antd/T10';
import AntdT11 from './carousel/antd/T11';
import AntdT12 from './carousel/antd/T12';
import AntdT13 from './carousel/antd/T13';
import AntdT14 from './carousel/antd/T14';
import AntdT15 from './carousel/antd/T15';

// Import task-specific components for mantine
import MantineT01 from './carousel/mantine/T01';
import MantineT02 from './carousel/mantine/T02';
import MantineT03 from './carousel/mantine/T03';
import MantineT04 from './carousel/mantine/T04';
import MantineT05 from './carousel/mantine/T05';
import MantineT06 from './carousel/mantine/T06';
import MantineT07 from './carousel/mantine/T07';
import MantineT08 from './carousel/mantine/T08';
import MantineT09 from './carousel/mantine/T09';
import MantineT10 from './carousel/mantine/T10';
import MantineT11 from './carousel/mantine/T11';
import MantineT12 from './carousel/mantine/T12';
import MantineT13 from './carousel/mantine/T13';
import MantineT14 from './carousel/mantine/T14';
import MantineT15 from './carousel/mantine/T15';

interface CarouselTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'carousel-antd-T01': AntdT01,
  'carousel-antd-T02': AntdT02,
  'carousel-antd-T03': AntdT03,
  'carousel-antd-T04': AntdT04,
  'carousel-antd-T05': AntdT05,
  'carousel-antd-T06': AntdT06,
  'carousel-antd-T07': AntdT07,
  'carousel-antd-T08': AntdT08,
  'carousel-antd-T09': AntdT09,
  'carousel-antd-T10': AntdT10,
  'carousel-antd-T11': AntdT11,
  'carousel-antd-T12': AntdT12,
  'carousel-antd-T13': AntdT13,
  'carousel-antd-T14': AntdT14,
  'carousel-antd-T15': AntdT15,
  // Mantine tasks
  'carousel-mantine-T01': MantineT01,
  'carousel-mantine-T02': MantineT02,
  'carousel-mantine-T03': MantineT03,
  'carousel-mantine-T04': MantineT04,
  'carousel-mantine-T05': MantineT05,
  'carousel-mantine-T06': MantineT06,
  'carousel-mantine-T07': MantineT07,
  'carousel-mantine-T08': MantineT08,
  'carousel-mantine-T09': MantineT09,
  'carousel-mantine-T10': MantineT10,
  'carousel-mantine-T11': MantineT11,
  'carousel-mantine-T12': MantineT12,
  'carousel-mantine-T13': MantineT13,
  'carousel-mantine-T14': MantineT14,
  'carousel-mantine-T15': MantineT15,
};

export default function CarouselTaskRunner({ task }: CarouselTaskRunnerProps) {
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
