'use client';

import React from 'react';
import { message } from 'antd';
import { finishTask } from '@/utils/finishTask';
import type { TaskSpec } from '@/types';
import { ThemeWrapper } from './ThemeWrapper';
import { PlacementWrapper } from './PlacementWrapper';

// Import task-specific components for external (uiw/react-md-editor)
import ExternalT01 from './markdown_editor/external/T01';
import ExternalT02 from './markdown_editor/external/T02';
import ExternalT03 from './markdown_editor/external/T03';
import ExternalT04 from './markdown_editor/external/T04';
import ExternalT05 from './markdown_editor/external/T05';
import ExternalT06 from './markdown_editor/external/T06';
import ExternalT07 from './markdown_editor/external/T07';
import ExternalT08 from './markdown_editor/external/T08';
import ExternalT09 from './markdown_editor/external/T09';
import ExternalT10 from './markdown_editor/external/T10';
import ExternalT11 from './markdown_editor/external/T11';
import ExternalT12 from './markdown_editor/external/T12';
import ExternalT13 from './markdown_editor/external/T13';
import ExternalT14 from './markdown_editor/external/T14';
import ExternalT15 from './markdown_editor/external/T15';
import ExternalT16 from './markdown_editor/external/T16';
import ExternalT17 from './markdown_editor/external/T17';
import ExternalT18 from './markdown_editor/external/T18';
import ExternalT19 from './markdown_editor/external/T19';
import ExternalT20 from './markdown_editor/external/T20';
import ExternalT21 from './markdown_editor/external/T21';
import ExternalT22 from './markdown_editor/external/T22';
import ExternalT23 from './markdown_editor/external/T23';
import ExternalT24 from './markdown_editor/external/T24';
import ExternalT25 from './markdown_editor/external/T25';
import ExternalT26 from './markdown_editor/external/T26';
import ExternalT27 from './markdown_editor/external/T27';
import ExternalT28 from './markdown_editor/external/T28';
import ExternalT29 from './markdown_editor/external/T29';
import ExternalT30 from './markdown_editor/external/T30';

// Import v2 task-specific components
import ExternalV2T01 from './markdown_editor/external/v2/T01';
import ExternalV2T02 from './markdown_editor/external/v2/T02';
import ExternalV2T03 from './markdown_editor/external/v2/T03';
import ExternalV2T04 from './markdown_editor/external/v2/T04';
import ExternalV2T05 from './markdown_editor/external/v2/T05';
import ExternalV2T06 from './markdown_editor/external/v2/T06';
import ExternalV2T07 from './markdown_editor/external/v2/T07';
import ExternalV2T08 from './markdown_editor/external/v2/T08';
import ExternalV2T09 from './markdown_editor/external/v2/T09';
import ExternalV2T10 from './markdown_editor/external/v2/T10';
import ExternalV2T11 from './markdown_editor/external/v2/T11';
import ExternalV2T12 from './markdown_editor/external/v2/T12';
import ExternalV2T13 from './markdown_editor/external/v2/T13';
import ExternalV2T14 from './markdown_editor/external/v2/T14';
import ExternalV2T15 from './markdown_editor/external/v2/T15';
import ExternalV2T16 from './markdown_editor/external/v2/T16';

interface MarkdownEditorTaskRunnerProps {
  task: TaskSpec;
}

// Map of task IDs to their specific components
const taskComponentMap: Record<string, React.ComponentType<{ task: TaskSpec; onSuccess: () => void }>> = {
  // External (uiw/react-md-editor) tasks
  'markdown_editor-external-T01': ExternalT01,
  'markdown_editor-external-T02': ExternalT02,
  'markdown_editor-external-T03': ExternalT03,
  'markdown_editor-external-T04': ExternalT04,
  'markdown_editor-external-T05': ExternalT05,
  'markdown_editor-external-T06': ExternalT06,
  'markdown_editor-external-T07': ExternalT07,
  'markdown_editor-external-T08': ExternalT08,
  'markdown_editor-external-T09': ExternalT09,
  'markdown_editor-external-T10': ExternalT10,
  'markdown_editor-external-T11': ExternalT11,
  'markdown_editor-external-T12': ExternalT12,
  'markdown_editor-external-T13': ExternalT13,
  'markdown_editor-external-T14': ExternalT14,
  'markdown_editor-external-T15': ExternalT15,
  'markdown_editor-external-T16': ExternalT16,
  'markdown_editor-external-T17': ExternalT17,
  'markdown_editor-external-T18': ExternalT18,
  'markdown_editor-external-T19': ExternalT19,
  'markdown_editor-external-T20': ExternalT20,
  'markdown_editor-external-T21': ExternalT21,
  'markdown_editor-external-T22': ExternalT22,
  'markdown_editor-external-T23': ExternalT23,
  'markdown_editor-external-T24': ExternalT24,
  'markdown_editor-external-T25': ExternalT25,
  'markdown_editor-external-T26': ExternalT26,
  'markdown_editor-external-T27': ExternalT27,
  'markdown_editor-external-T28': ExternalT28,
  'markdown_editor-external-T29': ExternalT29,
  'markdown_editor-external-T30': ExternalT30,
  // v2 External tasks
  'markdown_editor-external-v2-T01': ExternalV2T01,
  'markdown_editor-external-v2-T02': ExternalV2T02,
  'markdown_editor-external-v2-T03': ExternalV2T03,
  'markdown_editor-external-v2-T04': ExternalV2T04,
  'markdown_editor-external-v2-T05': ExternalV2T05,
  'markdown_editor-external-v2-T06': ExternalV2T06,
  'markdown_editor-external-v2-T07': ExternalV2T07,
  'markdown_editor-external-v2-T08': ExternalV2T08,
  'markdown_editor-external-v2-T09': ExternalV2T09,
  'markdown_editor-external-v2-T10': ExternalV2T10,
  'markdown_editor-external-v2-T11': ExternalV2T11,
  'markdown_editor-external-v2-T12': ExternalV2T12,
  'markdown_editor-external-v2-T13': ExternalV2T13,
  'markdown_editor-external-v2-T14': ExternalV2T14,
  'markdown_editor-external-v2-T15': ExternalV2T15,
  'markdown_editor-external-v2-T16': ExternalV2T16,
};

export default function MarkdownEditorTaskRunner({ task }: MarkdownEditorTaskRunnerProps) {
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
