'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './color_swatch_picker/antd/T01';
import AntdT02 from './color_swatch_picker/antd/T02';
import AntdT03 from './color_swatch_picker/antd/T03';
import AntdT04 from './color_swatch_picker/antd/T04';
import AntdT05 from './color_swatch_picker/antd/T05';
import AntdT06 from './color_swatch_picker/antd/T06';
import AntdT07 from './color_swatch_picker/antd/T07';
import AntdT08 from './color_swatch_picker/antd/T08';
import AntdT09 from './color_swatch_picker/antd/T09';
import AntdT10 from './color_swatch_picker/antd/T10';
import AntdT11 from './color_swatch_picker/antd/T11';
import AntdT12 from './color_swatch_picker/antd/T12';
import AntdT13 from './color_swatch_picker/antd/T13';
import AntdT14 from './color_swatch_picker/antd/T14';
import AntdT15 from './color_swatch_picker/antd/T15';

// Import task-specific components for mantine
import MantineT01 from './color_swatch_picker/mantine/T01';
import MantineT02 from './color_swatch_picker/mantine/T02';
import MantineT03 from './color_swatch_picker/mantine/T03';
import MantineT04 from './color_swatch_picker/mantine/T04';
import MantineT05 from './color_swatch_picker/mantine/T05';
import MantineT06 from './color_swatch_picker/mantine/T06';
import MantineT07 from './color_swatch_picker/mantine/T07';
import MantineT08 from './color_swatch_picker/mantine/T08';
import MantineT09 from './color_swatch_picker/mantine/T09';
import MantineT10 from './color_swatch_picker/mantine/T10';
import MantineT11 from './color_swatch_picker/mantine/T11';
import MantineT12 from './color_swatch_picker/mantine/T12';
import MantineT13 from './color_swatch_picker/mantine/T13';
import MantineT14 from './color_swatch_picker/mantine/T14';
import MantineT15 from './color_swatch_picker/mantine/T15';

import AntdV2T01 from './color_swatch_picker/antd/v2/T01';
import AntdV2T02 from './color_swatch_picker/antd/v2/T02';
import AntdV2T03 from './color_swatch_picker/antd/v2/T03';
import AntdV2T04 from './color_swatch_picker/antd/v2/T04';
import AntdV2T05 from './color_swatch_picker/antd/v2/T05';
import AntdV2T06 from './color_swatch_picker/antd/v2/T06';
import AntdV2T07 from './color_swatch_picker/antd/v2/T07';
import AntdV2T08 from './color_swatch_picker/antd/v2/T08';
import MantineV2T09 from './color_swatch_picker/mantine/v2/T09';
import MantineV2T10 from './color_swatch_picker/mantine/v2/T10';
import MantineV2T11 from './color_swatch_picker/mantine/v2/T11';
import MantineV2T12 from './color_swatch_picker/mantine/v2/T12';
import MantineV2T13 from './color_swatch_picker/mantine/v2/T13';
import MantineV2T14 from './color_swatch_picker/mantine/v2/T14';
import MantineV2T15 from './color_swatch_picker/mantine/v2/T15';
import MantineV2T16 from './color_swatch_picker/mantine/v2/T16';

interface ColorSwatchPickerTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'color_swatch_picker-antd-T01': AntdT01,
  'color_swatch_picker-antd-T02': AntdT02,
  'color_swatch_picker-antd-T03': AntdT03,
  'color_swatch_picker-antd-T04': AntdT04,
  'color_swatch_picker-antd-T05': AntdT05,
  'color_swatch_picker-antd-T06': AntdT06,
  'color_swatch_picker-antd-T07': AntdT07,
  'color_swatch_picker-antd-T08': AntdT08,
  'color_swatch_picker-antd-T09': AntdT09,
  'color_swatch_picker-antd-T10': AntdT10,
  'color_swatch_picker-antd-T11': AntdT11,
  'color_swatch_picker-antd-T12': AntdT12,
  'color_swatch_picker-antd-T13': AntdT13,
  'color_swatch_picker-antd-T14': AntdT14,
  'color_swatch_picker-antd-T15': AntdT15,
  // Mantine tasks
  'color_swatch_picker-mantine-T01': MantineT01,
  'color_swatch_picker-mantine-T02': MantineT02,
  'color_swatch_picker-mantine-T03': MantineT03,
  'color_swatch_picker-mantine-T04': MantineT04,
  'color_swatch_picker-mantine-T05': MantineT05,
  'color_swatch_picker-mantine-T06': MantineT06,
  'color_swatch_picker-mantine-T07': MantineT07,
  'color_swatch_picker-mantine-T08': MantineT08,
  'color_swatch_picker-mantine-T09': MantineT09,
  'color_swatch_picker-mantine-T10': MantineT10,
  'color_swatch_picker-mantine-T11': MantineT11,
  'color_swatch_picker-mantine-T12': MantineT12,
  'color_swatch_picker-mantine-T13': MantineT13,
  'color_swatch_picker-mantine-T14': MantineT14,
  'color_swatch_picker-mantine-T15': MantineT15,
  'color_swatch_picker-antd-v2-T01': AntdV2T01,
  'color_swatch_picker-antd-v2-T02': AntdV2T02,
  'color_swatch_picker-antd-v2-T03': AntdV2T03,
  'color_swatch_picker-antd-v2-T04': AntdV2T04,
  'color_swatch_picker-antd-v2-T05': AntdV2T05,
  'color_swatch_picker-antd-v2-T06': AntdV2T06,
  'color_swatch_picker-antd-v2-T07': AntdV2T07,
  'color_swatch_picker-antd-v2-T08': AntdV2T08,
  'color_swatch_picker-mantine-v2-T09': MantineV2T09,
  'color_swatch_picker-mantine-v2-T10': MantineV2T10,
  'color_swatch_picker-mantine-v2-T11': MantineV2T11,
  'color_swatch_picker-mantine-v2-T12': MantineV2T12,
  'color_swatch_picker-mantine-v2-T13': MantineV2T13,
  'color_swatch_picker-mantine-v2-T14': MantineV2T14,
  'color_swatch_picker-mantine-v2-T15': MantineV2T15,
  'color_swatch_picker-mantine-v2-T16': MantineV2T16,
};

export default function ColorSwatchPickerTaskRunner({ task }: ColorSwatchPickerTaskRunnerProps) {
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
