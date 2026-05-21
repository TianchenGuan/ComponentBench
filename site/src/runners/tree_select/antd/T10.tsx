'use client';

/**
 * tree_select-antd-T10: Match the highlighted folder (visual reference)
 *
 * Layout: dashboard with multiple widgets (high clutter). The target widget is a small "Pinned folder" card near the center.
 * Target component: one AntD TreeSelect labeled "Pinned folder". It is empty on load.
 * Tree data:
 *   - Projects → Alpha → (Design, Engineering, QA), Beta → (Design, Engineering, QA)
 *   - Templates → (Onboarding, Offboarding)
 *   - Archive
 * Visual guidance: a separate "Reference" card shows a static image of an opened tree dropdown with ONE node highlighted.
 * The highlighted node corresponds to "Templates → Onboarding".
 * Clutter (high): surrounding dashboard includes a table, two filter dropdowns, and a notifications panel.
 *
 * Success: The Pinned folder TreeSelect selection matches the node highlighted in the Reference card.
 * Canonical target is the leaf path [Templates, Onboarding] with value 'folder_templates_onboarding'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TreeSelect, Table, Select, Badge, List, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const treeData = [
  {
    value: 'projects',
    title: 'Projects',
    selectable: false,
    children: [
      {
        value: 'projects_alpha',
        title: 'Alpha',
        selectable: false,
        children: [
          { value: 'folder_projects_alpha_design', title: 'Design' },
          { value: 'folder_projects_alpha_engineering', title: 'Engineering' },
          { value: 'folder_projects_alpha_qa', title: 'QA' },
        ],
      },
      {
        value: 'projects_beta',
        title: 'Beta',
        selectable: false,
        children: [
          { value: 'folder_projects_beta_design', title: 'Design' },
          { value: 'folder_projects_beta_engineering', title: 'Engineering' },
          { value: 'folder_projects_beta_qa', title: 'QA' },
        ],
      },
    ],
  },
  {
    value: 'templates',
    title: 'Templates',
    selectable: false,
    children: [
      { value: 'folder_templates_onboarding', title: 'Onboarding' },
      { value: 'folder_templates_offboarding', title: 'Offboarding' },
    ],
  },
  { value: 'folder_archive', title: 'Archive' },
];

// Dummy data for clutter
const tableData = [
  { key: '1', name: 'Report Q1', status: 'Complete' },
  { key: '2', name: 'Report Q2', status: 'Pending' },
];

const tableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const notifications = [
  'New comment on Report Q1',
  'Task assigned to you',
  'Meeting in 15 minutes',
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'folder_templates_onboarding') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 250px', gap: 16, maxWidth: 1000 }}>
      {/* Left column: Table + Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Reports" size="small">
          <Table dataSource={tableData} columns={tableColumns} pagination={false} size="small" />
        </Card>
        <div style={{ display: 'flex', gap: 8 }}>
          <Select placeholder="Status" style={{ width: 120 }} options={[{ value: 'all', label: 'All' }, { value: 'complete', label: 'Complete' }]} />
          <Select placeholder="Type" style={{ width: 120 }} options={[{ value: 'all', label: 'All' }, { value: 'report', label: 'Report' }]} />
        </div>
      </div>

      {/* Center column: Reference + Pinned folder */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Reference card with visual highlight */}
        <Card title="Reference" size="small" data-testid="reference-card">
          <div
            style={{
              background: '#fafafa',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              padding: 8,
              fontFamily: 'monospace',
              fontSize: 12,
            }}
            data-testid="reference-card-highlight-1"
          >
            <div style={{ color: '#999', marginBottom: 4 }}>▼ Templates</div>
            <div
              style={{
                background: '#1677ff',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: 2,
                marginLeft: 16,
              }}
            >
              📁 Onboarding
            </div>
            <div style={{ color: '#999', marginLeft: 16 }}>📁 Offboarding</div>
          </div>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 8, display: 'block' }}>
            Match the highlighted folder above
          </Text>
        </Card>

        {/* Target: Pinned folder */}
        <Card title="Pinned folder" size="small" data-testid="tree-select-card">
          <label htmlFor="pinned-folder" style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
            Pinned folder
          </label>
          <TreeSelect
            id="pinned-folder"
            data-testid="tree-select-pinned-folder"
            style={{ width: '100%' }}
            value={value}
            onChange={(val) => setValue(val)}
            treeData={treeData}
            placeholder="Select a folder"
            showSearch={false}
            treeDefaultExpandAll={false}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          />
        </Card>
      </div>

      {/* Right column: Notifications panel */}
      <Card title="Notifications" size="small">
        <List
          size="small"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item style={{ padding: '8px 0', fontSize: 12 }}>
              <Badge status="processing" />
              <span style={{ marginLeft: 8 }}>{item}</span>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
