'use client';

/**
 * tree_select-antd-T07: Enable three apps (checkable multi-select)
 *
 * Layout: form_section centered titled "App access" with a few related settings (distractors).
 * Target component: one AntD TreeSelect labeled "Enabled apps" configured in checkable mode:
 *   - Checkboxes are shown next to nodes (`treeCheckable=true`), enabling multiple selection.
 *   - Selected items appear as tags/chips inside the input.
 *   - Search is enabled.
 * Tree data:
 *   - Workspace → (Gmail, Calendar, Drive, Chat)
 *   - Developer tools → (GitHub, Jira)
 * Initial state: nothing selected.
 * Clutter (low): there is a separate toggle "Notify user" and a disabled "Save" button.
 *
 * Success: Enabled apps TreeSelect has selected set exactly {Workspace/Gmail, Workspace/Calendar, Workspace/Drive}.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TreeSelect, Switch, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const treeData = [
  {
    value: 'workspace',
    title: 'Workspace',
    children: [
      { value: 'app_workspace_gmail', title: 'Gmail' },
      { value: 'app_workspace_calendar', title: 'Calendar' },
      { value: 'app_workspace_drive', title: 'Drive' },
      { value: 'app_workspace_chat', title: 'Chat' },
    ],
  },
  {
    value: 'devtools',
    title: 'Developer tools',
    children: [
      { value: 'app_devtools_github', title: 'GitHub' },
      { value: 'app_devtools_jira', title: 'Jira' },
    ],
  },
];

const TARGET_VALUES = ['app_workspace_gmail', 'app_workspace_calendar', 'app_workspace_drive'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const [notifyUser, setNotifyUser] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(value, TARGET_VALUES)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="App access" style={{ width: 500 }} data-testid="tree-select-card">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <label htmlFor="enabled-apps" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Enabled apps
          </label>
          <TreeSelect
            id="enabled-apps"
            data-testid="tree-select-enabled-apps"
            style={{ width: '100%' }}
            value={value}
            onChange={(val) => setValue(val as string[])}
            treeData={treeData}
            placeholder="Select apps to enable"
            treeCheckable={true}
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            showSearch={true}
            treeNodeFilterProp="title"
            treeDefaultExpandAll={false}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            maxTagCount="responsive"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch checked={notifyUser} onChange={setNotifyUser} />
          <span>Notify user</span>
        </div>
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
          <Button type="primary" disabled>Save</Button>
        </div>
      </Space>
    </Card>
  );
}
