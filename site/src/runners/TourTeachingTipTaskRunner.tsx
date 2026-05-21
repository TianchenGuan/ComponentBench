'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './tour_teaching_tip/antd/T01';
import AntdT02 from './tour_teaching_tip/antd/T02';
import AntdT03 from './tour_teaching_tip/antd/T03';
import AntdT04 from './tour_teaching_tip/antd/T04';
import AntdT05 from './tour_teaching_tip/antd/T05';
import AntdT06 from './tour_teaching_tip/antd/T06';
import AntdT07 from './tour_teaching_tip/antd/T07';
import AntdT08 from './tour_teaching_tip/antd/T08';
import AntdT09 from './tour_teaching_tip/antd/T09';
import AntdT10 from './tour_teaching_tip/antd/T10';
import AntdT11 from './tour_teaching_tip/antd/T11';
import AntdT12 from './tour_teaching_tip/antd/T12';
import AntdT13 from './tour_teaching_tip/antd/T13';
import AntdT14 from './tour_teaching_tip/antd/T14';
import AntdT15 from './tour_teaching_tip/antd/T15';
import AntdT16 from './tour_teaching_tip/antd/T16';
import AntdT17 from './tour_teaching_tip/antd/T17';
import AntdT18 from './tour_teaching_tip/antd/T18';
import AntdT19 from './tour_teaching_tip/antd/T19';
import AntdT20 from './tour_teaching_tip/antd/T20';
import AntdT21 from './tour_teaching_tip/antd/T21';
import AntdT22 from './tour_teaching_tip/antd/T22';
import AntdT23 from './tour_teaching_tip/antd/T23';
import AntdT24 from './tour_teaching_tip/antd/T24';
import AntdT25 from './tour_teaching_tip/antd/T25';
import AntdT26 from './tour_teaching_tip/antd/T26';
import AntdT27 from './tour_teaching_tip/antd/T27';
import AntdT28 from './tour_teaching_tip/antd/T28';
import AntdT29 from './tour_teaching_tip/antd/T29';
import AntdT30 from './tour_teaching_tip/antd/T30';

interface TourTeachingTipTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'tour_teaching_tip-antd-T01': AntdT01,
  'tour_teaching_tip-antd-T02': AntdT02,
  'tour_teaching_tip-antd-T03': AntdT03,
  'tour_teaching_tip-antd-T04': AntdT04,
  'tour_teaching_tip-antd-T05': AntdT05,
  'tour_teaching_tip-antd-T06': AntdT06,
  'tour_teaching_tip-antd-T07': AntdT07,
  'tour_teaching_tip-antd-T08': AntdT08,
  'tour_teaching_tip-antd-T09': AntdT09,
  'tour_teaching_tip-antd-T10': AntdT10,
  'tour_teaching_tip-antd-T11': AntdT11,
  'tour_teaching_tip-antd-T12': AntdT12,
  'tour_teaching_tip-antd-T13': AntdT13,
  'tour_teaching_tip-antd-T14': AntdT14,
  'tour_teaching_tip-antd-T15': AntdT15,
  'tour_teaching_tip-antd-T16': AntdT16,
  'tour_teaching_tip-antd-T17': AntdT17,
  'tour_teaching_tip-antd-T18': AntdT18,
  'tour_teaching_tip-antd-T19': AntdT19,
  'tour_teaching_tip-antd-T20': AntdT20,
  'tour_teaching_tip-antd-T21': AntdT21,
  'tour_teaching_tip-antd-T22': AntdT22,
  'tour_teaching_tip-antd-T23': AntdT23,
  'tour_teaching_tip-antd-T24': AntdT24,
  'tour_teaching_tip-antd-T25': AntdT25,
  'tour_teaching_tip-antd-T26': AntdT26,
  'tour_teaching_tip-antd-T27': AntdT27,
  'tour_teaching_tip-antd-T28': AntdT28,
  'tour_teaching_tip-antd-T29': AntdT29,
  'tour_teaching_tip-antd-T30': AntdT30,
};

export default function TourTeachingTipTaskRunner({ task }: TourTeachingTipTaskRunnerProps) {
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
