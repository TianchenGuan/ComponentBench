'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for antd
import AntdT01 from './data_grid_editable/antd/T01';
import AntdT02 from './data_grid_editable/antd/T02';
import AntdT03 from './data_grid_editable/antd/T03';
import AntdT04 from './data_grid_editable/antd/T04';
import AntdT05 from './data_grid_editable/antd/T05';
import AntdT06 from './data_grid_editable/antd/T06';
import AntdT07 from './data_grid_editable/antd/T07';
import AntdT08 from './data_grid_editable/antd/T08';
import AntdT09 from './data_grid_editable/antd/T09';
import AntdT10 from './data_grid_editable/antd/T10';
import AntdT11 from './data_grid_editable/antd/T11';
import AntdT12 from './data_grid_editable/antd/T12';
import AntdT13 from './data_grid_editable/antd/T13';
import AntdT14 from './data_grid_editable/antd/T14';
import AntdT15 from './data_grid_editable/antd/T15';

// Import task-specific components for mui
import MuiT01 from './data_grid_editable/mui/T01';
import MuiT02 from './data_grid_editable/mui/T02';
import MuiT03 from './data_grid_editable/mui/T03';
import MuiT04 from './data_grid_editable/mui/T04';
import MuiT05 from './data_grid_editable/mui/T05';
import MuiT06 from './data_grid_editable/mui/T06';
import MuiT07 from './data_grid_editable/mui/T07';
import MuiT08 from './data_grid_editable/mui/T08';
import MuiT09 from './data_grid_editable/mui/T09';
import MuiT10 from './data_grid_editable/mui/T10';

// v2 antd
import AntdV2T01 from './data_grid_editable/antd/v2/T01'; import AntdV2T02 from './data_grid_editable/antd/v2/T02';
import AntdV2T03 from './data_grid_editable/antd/v2/T03'; import AntdV2T04 from './data_grid_editable/antd/v2/T04';
import AntdV2T05 from './data_grid_editable/antd/v2/T05'; import AntdV2T06 from './data_grid_editable/antd/v2/T06';
import AntdV2T07 from './data_grid_editable/antd/v2/T07'; import AntdV2T08 from './data_grid_editable/antd/v2/T08';
import AntdV2T09 from './data_grid_editable/antd/v2/T09'; import AntdV2T10 from './data_grid_editable/antd/v2/T10';
import AntdV2T11 from './data_grid_editable/antd/v2/T11'; import AntdV2T12 from './data_grid_editable/antd/v2/T12';
import AntdV2T13 from './data_grid_editable/antd/v2/T13'; import AntdV2T14 from './data_grid_editable/antd/v2/T14';
import AntdV2T15 from './data_grid_editable/antd/v2/T15'; import AntdV2T16 from './data_grid_editable/antd/v2/T16';
import AntdV2T17 from './data_grid_editable/antd/v2/T17'; import AntdV2T18 from './data_grid_editable/antd/v2/T18';
import AntdV2T19 from './data_grid_editable/antd/v2/T19'; import AntdV2T20 from './data_grid_editable/antd/v2/T20';
import AntdV2T21 from './data_grid_editable/antd/v2/T21'; import AntdV2T22 from './data_grid_editable/antd/v2/T22';
import AntdV2T23 from './data_grid_editable/antd/v2/T23'; import AntdV2T24 from './data_grid_editable/antd/v2/T24';
// v2 mui
import MuiV2T01 from './data_grid_editable/mui/v2/T01'; import MuiV2T02 from './data_grid_editable/mui/v2/T02';
import MuiV2T03 from './data_grid_editable/mui/v2/T03'; import MuiV2T04 from './data_grid_editable/mui/v2/T04';
import MuiV2T05 from './data_grid_editable/mui/v2/T05'; import MuiV2T06 from './data_grid_editable/mui/v2/T06';
import MuiV2T07 from './data_grid_editable/mui/v2/T07'; import MuiV2T08 from './data_grid_editable/mui/v2/T08';
import MuiV2T09 from './data_grid_editable/mui/v2/T09'; import MuiV2T10a from './data_grid_editable/mui/v2/T10';
import MuiV2T11 from './data_grid_editable/mui/v2/T11'; import MuiV2T12 from './data_grid_editable/mui/v2/T12';
import MuiV2T13 from './data_grid_editable/mui/v2/T13'; import MuiV2T14 from './data_grid_editable/mui/v2/T14';
import MuiV2T15 from './data_grid_editable/mui/v2/T15'; import MuiV2T16 from './data_grid_editable/mui/v2/T16';
import MuiV2T17 from './data_grid_editable/mui/v2/T17'; import MuiV2T18 from './data_grid_editable/mui/v2/T18';
import MuiV2T19 from './data_grid_editable/mui/v2/T19'; import MuiV2T20 from './data_grid_editable/mui/v2/T20';
import MuiV2T21 from './data_grid_editable/mui/v2/T21'; import MuiV2T22 from './data_grid_editable/mui/v2/T22';
import MuiV2T23 from './data_grid_editable/mui/v2/T23'; import MuiV2T24 from './data_grid_editable/mui/v2/T24';
import MuiT11 from './data_grid_editable/mui/T11';
import MuiT12 from './data_grid_editable/mui/T12';
import MuiT13 from './data_grid_editable/mui/T13';
import MuiT14 from './data_grid_editable/mui/T14';
import MuiT15 from './data_grid_editable/mui/T15';

interface DataGridEditableTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Antd tasks
  'data_grid_editable-antd-T01': AntdT01,
  'data_grid_editable-antd-T02': AntdT02,
  'data_grid_editable-antd-T03': AntdT03,
  'data_grid_editable-antd-T04': AntdT04,
  'data_grid_editable-antd-T05': AntdT05,
  'data_grid_editable-antd-T06': AntdT06,
  'data_grid_editable-antd-T07': AntdT07,
  'data_grid_editable-antd-T08': AntdT08,
  'data_grid_editable-antd-T09': AntdT09,
  'data_grid_editable-antd-T10': AntdT10,
  'data_grid_editable-antd-T11': AntdT11,
  'data_grid_editable-antd-T12': AntdT12,
  'data_grid_editable-antd-T13': AntdT13,
  'data_grid_editable-antd-T14': AntdT14,
  'data_grid_editable-antd-T15': AntdT15,
  // MUI tasks
  'data_grid_editable-mui-T01': MuiT01,
  'data_grid_editable-mui-T02': MuiT02,
  'data_grid_editable-mui-T03': MuiT03,
  'data_grid_editable-mui-T04': MuiT04,
  'data_grid_editable-mui-T05': MuiT05,
  'data_grid_editable-mui-T06': MuiT06,
  'data_grid_editable-mui-T07': MuiT07,
  'data_grid_editable-mui-T08': MuiT08,
  'data_grid_editable-mui-T09': MuiT09,
  'data_grid_editable-mui-T10': MuiT10,
  'data_grid_editable-mui-T11': MuiT11,
  'data_grid_editable-mui-T12': MuiT12,
  'data_grid_editable-mui-T13': MuiT13,
  'data_grid_editable-mui-T14': MuiT14,
  'data_grid_editable-mui-T15': MuiT15,
  // v2 antd
  'data_grid_editable-antd-v2-T01': AntdV2T01, 'data_grid_editable-antd-v2-T02': AntdV2T02,
  'data_grid_editable-antd-v2-T03': AntdV2T03, 'data_grid_editable-antd-v2-T04': AntdV2T04,
  'data_grid_editable-antd-v2-T05': AntdV2T05, 'data_grid_editable-antd-v2-T06': AntdV2T06,
  'data_grid_editable-antd-v2-T07': AntdV2T07, 'data_grid_editable-antd-v2-T08': AntdV2T08,
  'data_grid_editable-antd-v2-T09': AntdV2T09, 'data_grid_editable-antd-v2-T10': AntdV2T10,
  'data_grid_editable-antd-v2-T11': AntdV2T11, 'data_grid_editable-antd-v2-T12': AntdV2T12,
  'data_grid_editable-antd-v2-T13': AntdV2T13, 'data_grid_editable-antd-v2-T14': AntdV2T14,
  'data_grid_editable-antd-v2-T15': AntdV2T15, 'data_grid_editable-antd-v2-T16': AntdV2T16,
  'data_grid_editable-antd-v2-T17': AntdV2T17, 'data_grid_editable-antd-v2-T18': AntdV2T18,
  'data_grid_editable-antd-v2-T19': AntdV2T19, 'data_grid_editable-antd-v2-T20': AntdV2T20,
  'data_grid_editable-antd-v2-T21': AntdV2T21, 'data_grid_editable-antd-v2-T22': AntdV2T22,
  'data_grid_editable-antd-v2-T23': AntdV2T23, 'data_grid_editable-antd-v2-T24': AntdV2T24,
  // v2 mui
  'data_grid_editable-mui-v2-T01': MuiV2T01, 'data_grid_editable-mui-v2-T02': MuiV2T02,
  'data_grid_editable-mui-v2-T03': MuiV2T03, 'data_grid_editable-mui-v2-T04': MuiV2T04,
  'data_grid_editable-mui-v2-T05': MuiV2T05, 'data_grid_editable-mui-v2-T06': MuiV2T06,
  'data_grid_editable-mui-v2-T07': MuiV2T07, 'data_grid_editable-mui-v2-T08': MuiV2T08,
  'data_grid_editable-mui-v2-T09': MuiV2T09, 'data_grid_editable-mui-v2-T10': MuiV2T10a,
  'data_grid_editable-mui-v2-T11': MuiV2T11, 'data_grid_editable-mui-v2-T12': MuiV2T12,
  'data_grid_editable-mui-v2-T13': MuiV2T13, 'data_grid_editable-mui-v2-T14': MuiV2T14,
  'data_grid_editable-mui-v2-T15': MuiV2T15, 'data_grid_editable-mui-v2-T16': MuiV2T16,
  'data_grid_editable-mui-v2-T17': MuiV2T17, 'data_grid_editable-mui-v2-T18': MuiV2T18,
  'data_grid_editable-mui-v2-T19': MuiV2T19, 'data_grid_editable-mui-v2-T20': MuiV2T20,
  'data_grid_editable-mui-v2-T21': MuiV2T21, 'data_grid_editable-mui-v2-T22': MuiV2T22,
  'data_grid_editable-mui-v2-T23': MuiV2T23, 'data_grid_editable-mui-v2-T24': MuiV2T24,
};

export default function DataGridEditableTaskRunner({ task }: DataGridEditableTaskRunnerProps) {
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
