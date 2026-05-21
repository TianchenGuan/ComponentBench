'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './cascader/antd/T01';
import AntdT02 from './cascader/antd/T02';
import AntdT03 from './cascader/antd/T03';
import AntdT04 from './cascader/antd/T04';
import AntdT05 from './cascader/antd/T05';
import AntdT06 from './cascader/antd/T06';
import AntdT07 from './cascader/antd/T07';
import AntdT08 from './cascader/antd/T08';
import AntdT09 from './cascader/antd/T09';
import AntdT10 from './cascader/antd/T10';
import AntdT11 from './cascader/antd/T11';
import AntdT12 from './cascader/antd/T12';
import AntdT13 from './cascader/antd/T13';
import AntdT14 from './cascader/antd/T14';
import AntdT15 from './cascader/antd/T15';
import AntdT16 from './cascader/antd/T16';
import AntdT17 from './cascader/antd/T17';
import AntdT18 from './cascader/antd/T18';
import AntdT19 from './cascader/antd/T19';
import AntdT20 from './cascader/antd/T20';
import AntdT21 from './cascader/antd/T21';
import AntdT22 from './cascader/antd/T22';
import AntdT23 from './cascader/antd/T23';
import AntdT24 from './cascader/antd/T24';
import AntdT25 from './cascader/antd/T25';
import AntdT26 from './cascader/antd/T26';
import AntdT27 from './cascader/antd/T27';
import AntdT28 from './cascader/antd/T28';
import AntdT29 from './cascader/antd/T29';
import AntdT30 from './cascader/antd/T30';

// v2 imports
import AntdV2T01 from './cascader/antd/v2/T01';
import AntdV2T02 from './cascader/antd/v2/T02';
import AntdV2T03 from './cascader/antd/v2/T03';
import AntdV2T04 from './cascader/antd/v2/T04';
import AntdV2T05 from './cascader/antd/v2/T05';
import AntdV2T06 from './cascader/antd/v2/T06';
import AntdV2T07 from './cascader/antd/v2/T07';
import AntdV2T08 from './cascader/antd/v2/T08';
import AntdV2T09 from './cascader/antd/v2/T09';
import AntdV2T10 from './cascader/antd/v2/T10';
import AntdV2T11 from './cascader/antd/v2/T11';
import AntdV2T12 from './cascader/antd/v2/T12';
import AntdV2T13 from './cascader/antd/v2/T13';
import AntdV2T14 from './cascader/antd/v2/T14';
import AntdV2T15 from './cascader/antd/v2/T15';
import AntdV2T16 from './cascader/antd/v2/T16';
import AntdV2T17 from './cascader/antd/v2/T17';
import AntdV2T18 from './cascader/antd/v2/T18';
import AntdV2T19 from './cascader/antd/v2/T19';
import AntdV2T20 from './cascader/antd/v2/T20';
import AntdV2T21 from './cascader/antd/v2/T21';
import AntdV2T22 from './cascader/antd/v2/T22';
import AntdV2T23 from './cascader/antd/v2/T23';
import AntdV2T24 from './cascader/antd/v2/T24';

interface CascaderTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks (T01-T30)
  'cascader-antd-T01': AntdT01,
  'cascader-antd-T02': AntdT02,
  'cascader-antd-T03': AntdT03,
  'cascader-antd-T04': AntdT04,
  'cascader-antd-T05': AntdT05,
  'cascader-antd-T06': AntdT06,
  'cascader-antd-T07': AntdT07,
  'cascader-antd-T08': AntdT08,
  'cascader-antd-T09': AntdT09,
  'cascader-antd-T10': AntdT10,
  'cascader-antd-T11': AntdT11,
  'cascader-antd-T12': AntdT12,
  'cascader-antd-T13': AntdT13,
  'cascader-antd-T14': AntdT14,
  'cascader-antd-T15': AntdT15,
  'cascader-antd-T16': AntdT16,
  'cascader-antd-T17': AntdT17,
  'cascader-antd-T18': AntdT18,
  'cascader-antd-T19': AntdT19,
  'cascader-antd-T20': AntdT20,
  'cascader-antd-T21': AntdT21,
  'cascader-antd-T22': AntdT22,
  'cascader-antd-T23': AntdT23,
  'cascader-antd-T24': AntdT24,
  'cascader-antd-T25': AntdT25,
  'cascader-antd-T26': AntdT26,
  'cascader-antd-T27': AntdT27,
  'cascader-antd-T28': AntdT28,
  'cascader-antd-T29': AntdT29,
  'cascader-antd-T30': AntdT30,
  // v2
  'cascader-antd-v2-T01': AntdV2T01, 'cascader-antd-v2-T02': AntdV2T02,
  'cascader-antd-v2-T03': AntdV2T03, 'cascader-antd-v2-T04': AntdV2T04,
  'cascader-antd-v2-T05': AntdV2T05, 'cascader-antd-v2-T06': AntdV2T06,
  'cascader-antd-v2-T07': AntdV2T07, 'cascader-antd-v2-T08': AntdV2T08,
  'cascader-antd-v2-T09': AntdV2T09, 'cascader-antd-v2-T10': AntdV2T10,
  'cascader-antd-v2-T11': AntdV2T11, 'cascader-antd-v2-T12': AntdV2T12,
  'cascader-antd-v2-T13': AntdV2T13, 'cascader-antd-v2-T14': AntdV2T14,
  'cascader-antd-v2-T15': AntdV2T15, 'cascader-antd-v2-T16': AntdV2T16,
  'cascader-antd-v2-T17': AntdV2T17, 'cascader-antd-v2-T18': AntdV2T18,
  'cascader-antd-v2-T19': AntdV2T19, 'cascader-antd-v2-T20': AntdV2T20,
  'cascader-antd-v2-T21': AntdV2T21, 'cascader-antd-v2-T22': AntdV2T22,
  'cascader-antd-v2-T23': AntdV2T23, 'cascader-antd-v2-T24': AntdV2T24,
};

export default function CascaderTaskRunner({ task }: CascaderTaskRunnerProps) {
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
