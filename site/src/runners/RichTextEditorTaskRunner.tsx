'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

import '@mantine/tiptap/styles.css';

// Import task-specific components for mantine
import MantineT01 from './rich_text_editor/mantine/T01';
import MantineT02 from './rich_text_editor/mantine/T02';
import MantineT03 from './rich_text_editor/mantine/T03';
import MantineT04 from './rich_text_editor/mantine/T04';
import MantineT05 from './rich_text_editor/mantine/T05';
import MantineT06 from './rich_text_editor/mantine/T06';
import MantineT07 from './rich_text_editor/mantine/T07';
import MantineT08 from './rich_text_editor/mantine/T08';
import MantineT09 from './rich_text_editor/mantine/T09';
import MantineT10 from './rich_text_editor/mantine/T10';
import MantineT11 from './rich_text_editor/mantine/T11';
import MantineT12 from './rich_text_editor/mantine/T12';
import MantineT13 from './rich_text_editor/mantine/T13';
import MantineT14 from './rich_text_editor/mantine/T14';
import MantineT15 from './rich_text_editor/mantine/T15';
import MantineT16 from './rich_text_editor/mantine/T16';
import MantineT17 from './rich_text_editor/mantine/T17';
import MantineT18 from './rich_text_editor/mantine/T18';
import MantineT19 from './rich_text_editor/mantine/T19';
import MantineT20 from './rich_text_editor/mantine/T20';
import MantineT21 from './rich_text_editor/mantine/T21';
import MantineT22 from './rich_text_editor/mantine/T22';
import MantineT23 from './rich_text_editor/mantine/T23';
import MantineT24 from './rich_text_editor/mantine/T24';
import MantineT25 from './rich_text_editor/mantine/T25';
import MantineT26 from './rich_text_editor/mantine/T26';
import MantineT27 from './rich_text_editor/mantine/T27';
import MantineT28 from './rich_text_editor/mantine/T28';
import MantineT29 from './rich_text_editor/mantine/T29';
import MantineT30 from './rich_text_editor/mantine/T30';

// Import v2 mantine tasks
import MantineV2T01 from './rich_text_editor/mantine/v2/T01';
import MantineV2T02 from './rich_text_editor/mantine/v2/T02';
import MantineV2T03 from './rich_text_editor/mantine/v2/T03';
import MantineV2T04 from './rich_text_editor/mantine/v2/T04';
import MantineV2T05 from './rich_text_editor/mantine/v2/T05';
import MantineV2T06 from './rich_text_editor/mantine/v2/T06';
import MantineV2T07 from './rich_text_editor/mantine/v2/T07';
import MantineV2T08 from './rich_text_editor/mantine/v2/T08';
import MantineV2T09 from './rich_text_editor/mantine/v2/T09';
import MantineV2T10 from './rich_text_editor/mantine/v2/T10';
import MantineV2T11 from './rich_text_editor/mantine/v2/T11';
import MantineV2T12 from './rich_text_editor/mantine/v2/T12';
import MantineV2T13 from './rich_text_editor/mantine/v2/T13';
import MantineV2T14 from './rich_text_editor/mantine/v2/T14';
import MantineV2T15 from './rich_text_editor/mantine/v2/T15';
import MantineV2T16 from './rich_text_editor/mantine/v2/T16';

// Import v2 mui tasks
import MuiV2T01 from './rich_text_editor/mui/v2/T01';
import MuiV2T02 from './rich_text_editor/mui/v2/T02';
import MuiV2T03 from './rich_text_editor/mui/v2/T03';
import MuiV2T04 from './rich_text_editor/mui/v2/T04';
import MuiV2T05 from './rich_text_editor/mui/v2/T05';
import MuiV2T06 from './rich_text_editor/mui/v2/T06';
import MuiV2T07 from './rich_text_editor/mui/v2/T07';
import MuiV2T08 from './rich_text_editor/mui/v2/T08';
import MuiV2T09 from './rich_text_editor/mui/v2/T09';
import MuiV2T10 from './rich_text_editor/mui/v2/T10';
import MuiV2T11 from './rich_text_editor/mui/v2/T11';
import MuiV2T12 from './rich_text_editor/mui/v2/T12';
import MuiV2T13 from './rich_text_editor/mui/v2/T13';
import MuiV2T14 from './rich_text_editor/mui/v2/T14';
import MuiV2T15 from './rich_text_editor/mui/v2/T15';
import MuiV2T16 from './rich_text_editor/mui/v2/T16';

// Import v2 antd tasks
import AntdV2T01 from './rich_text_editor/antd/v2/T01';
import AntdV2T02 from './rich_text_editor/antd/v2/T02';
import AntdV2T03 from './rich_text_editor/antd/v2/T03';
import AntdV2T04 from './rich_text_editor/antd/v2/T04';
import AntdV2T05 from './rich_text_editor/antd/v2/T05';
import AntdV2T06 from './rich_text_editor/antd/v2/T06';
import AntdV2T07 from './rich_text_editor/antd/v2/T07';
import AntdV2T08 from './rich_text_editor/antd/v2/T08';
import AntdV2T09 from './rich_text_editor/antd/v2/T09';
import AntdV2T10 from './rich_text_editor/antd/v2/T10';
import AntdV2T11 from './rich_text_editor/antd/v2/T11';
import AntdV2T12 from './rich_text_editor/antd/v2/T12';
import AntdV2T13 from './rich_text_editor/antd/v2/T13';
import AntdV2T14 from './rich_text_editor/antd/v2/T14';
import AntdV2T15 from './rich_text_editor/antd/v2/T15';
import AntdV2T16 from './rich_text_editor/antd/v2/T16';

interface RichTextEditorTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // Mantine tasks
  'rich_text_editor-mantine-T01': MantineT01,
  'rich_text_editor-mantine-T02': MantineT02,
  'rich_text_editor-mantine-T03': MantineT03,
  'rich_text_editor-mantine-T04': MantineT04,
  'rich_text_editor-mantine-T05': MantineT05,
  'rich_text_editor-mantine-T06': MantineT06,
  'rich_text_editor-mantine-T07': MantineT07,
  'rich_text_editor-mantine-T08': MantineT08,
  'rich_text_editor-mantine-T09': MantineT09,
  'rich_text_editor-mantine-T10': MantineT10,
  'rich_text_editor-mantine-T11': MantineT11,
  'rich_text_editor-mantine-T12': MantineT12,
  'rich_text_editor-mantine-T13': MantineT13,
  'rich_text_editor-mantine-T14': MantineT14,
  'rich_text_editor-mantine-T15': MantineT15,
  'rich_text_editor-mantine-T16': MantineT16,
  'rich_text_editor-mantine-T17': MantineT17,
  'rich_text_editor-mantine-T18': MantineT18,
  'rich_text_editor-mantine-T19': MantineT19,
  'rich_text_editor-mantine-T20': MantineT20,
  'rich_text_editor-mantine-T21': MantineT21,
  'rich_text_editor-mantine-T22': MantineT22,
  'rich_text_editor-mantine-T23': MantineT23,
  'rich_text_editor-mantine-T24': MantineT24,
  'rich_text_editor-mantine-T25': MantineT25,
  'rich_text_editor-mantine-T26': MantineT26,
  'rich_text_editor-mantine-T27': MantineT27,
  'rich_text_editor-mantine-T28': MantineT28,
  'rich_text_editor-mantine-T29': MantineT29,
  'rich_text_editor-mantine-T30': MantineT30,
  // v2 Mantine tasks
  'rich_text_editor-mantine-v2-T01': MantineV2T01,
  'rich_text_editor-mantine-v2-T02': MantineV2T02,
  'rich_text_editor-mantine-v2-T03': MantineV2T03,
  'rich_text_editor-mantine-v2-T04': MantineV2T04,
  'rich_text_editor-mantine-v2-T05': MantineV2T05,
  'rich_text_editor-mantine-v2-T06': MantineV2T06,
  'rich_text_editor-mantine-v2-T07': MantineV2T07,
  'rich_text_editor-mantine-v2-T08': MantineV2T08,
  'rich_text_editor-mantine-v2-T09': MantineV2T09,
  'rich_text_editor-mantine-v2-T10': MantineV2T10,
  'rich_text_editor-mantine-v2-T11': MantineV2T11,
  'rich_text_editor-mantine-v2-T12': MantineV2T12,
  'rich_text_editor-mantine-v2-T13': MantineV2T13,
  'rich_text_editor-mantine-v2-T14': MantineV2T14,
  'rich_text_editor-mantine-v2-T15': MantineV2T15,
  'rich_text_editor-mantine-v2-T16': MantineV2T16,
  // v2 MUI tasks
  'rich_text_editor-mui-v2-T01': MuiV2T01,
  'rich_text_editor-mui-v2-T02': MuiV2T02,
  'rich_text_editor-mui-v2-T03': MuiV2T03,
  'rich_text_editor-mui-v2-T04': MuiV2T04,
  'rich_text_editor-mui-v2-T05': MuiV2T05,
  'rich_text_editor-mui-v2-T06': MuiV2T06,
  'rich_text_editor-mui-v2-T07': MuiV2T07,
  'rich_text_editor-mui-v2-T08': MuiV2T08,
  'rich_text_editor-mui-v2-T09': MuiV2T09,
  'rich_text_editor-mui-v2-T10': MuiV2T10,
  'rich_text_editor-mui-v2-T11': MuiV2T11,
  'rich_text_editor-mui-v2-T12': MuiV2T12,
  'rich_text_editor-mui-v2-T13': MuiV2T13,
  'rich_text_editor-mui-v2-T14': MuiV2T14,
  'rich_text_editor-mui-v2-T15': MuiV2T15,
  'rich_text_editor-mui-v2-T16': MuiV2T16,
  // v2 Antd tasks
  'rich_text_editor-antd-v2-T01': AntdV2T01,
  'rich_text_editor-antd-v2-T02': AntdV2T02,
  'rich_text_editor-antd-v2-T03': AntdV2T03,
  'rich_text_editor-antd-v2-T04': AntdV2T04,
  'rich_text_editor-antd-v2-T05': AntdV2T05,
  'rich_text_editor-antd-v2-T06': AntdV2T06,
  'rich_text_editor-antd-v2-T07': AntdV2T07,
  'rich_text_editor-antd-v2-T08': AntdV2T08,
  'rich_text_editor-antd-v2-T09': AntdV2T09,
  'rich_text_editor-antd-v2-T10': AntdV2T10,
  'rich_text_editor-antd-v2-T11': AntdV2T11,
  'rich_text_editor-antd-v2-T12': AntdV2T12,
  'rich_text_editor-antd-v2-T13': AntdV2T13,
  'rich_text_editor-antd-v2-T14': AntdV2T14,
  'rich_text_editor-antd-v2-T15': AntdV2T15,
  'rich_text_editor-antd-v2-T16': AntdV2T16,
};

export default function RichTextEditorTaskRunner({ task }: RichTextEditorTaskRunnerProps) {
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
