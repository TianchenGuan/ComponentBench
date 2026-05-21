'use client';

/**
 * select_custom_single-antd-v2-T06: Archive folder — non-searchable long menu in nested panel
 *
 * Vertically scrollable settings shell. Lower "Storage rules" panel with two Ant Design Selects:
 * "Current folder" (Active cases, must stay) and "Archive folder" (~60 folders, non-searchable).
 * Target "Legacy contracts" is late in the list, not visible on first open.
 * Panel footer: "Discard" / "Save storage rules". Dropdown scrolls independently.
 *
 * Success: Archive folder = "Legacy contracts", Current folder still "Active cases",
 * "Save storage rules" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, Select, Typography, Space, Divider, Input, Tag,
} from 'antd';
import { FolderOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const FOLDERS = [
  'Accounting records', 'Active cases', 'Archived audits', 'Board minutes',
  'Budget proposals', 'Client correspondence', 'Compliance filings', 'Contract drafts',
  'Corporate policies', 'Customer feedback', 'Data exports', 'Design assets',
  'Employee records', 'Engineering specs', 'Event planning', 'Executive memos',
  'Facility reports', 'Financial statements', 'Grant applications', 'HR policies',
  'Incident logs', 'Insurance claims', 'Internal audits', 'Investor relations',
  'IT tickets', 'Job descriptions', 'Knowledge base', 'Lab notebooks',
  'Legal briefs', 'Legacy contracts', 'Legacy invoices', 'License agreements',
  'Marketing campaigns', 'Meeting notes', 'Merger documents', 'Network diagrams',
  'Office supplies', 'Operations manual', 'Patent filings', 'Payroll records',
  'Performance reviews', 'Press releases', 'Product roadmaps', 'Project plans',
  'Purchase orders', 'Quality reports', 'Regulatory submissions', 'Research papers',
  'Safety procedures', 'Sales proposals', 'Service agreements', 'Shipping logs',
  'Strategic plans', 'Tax returns', 'Training materials', 'Travel receipts',
  'Vendor contracts', 'Warranty claims', 'Work orders', 'Year-end reports',
];

const folderOptions = FOLDERS.map((f) => ({
  value: f,
  label: (
    <Space size={4}>
      <FolderOutlined style={{ fontSize: 12 }} />
      {f}
    </Space>
  ),
}));

export default function T06({ onSuccess }: TaskComponentProps) {
  const [currentFolder, setCurrentFolder] = useState<string>('Active cases');
  const [archiveFolder, setArchiveFolder] = useState<string>('Accounting records');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && archiveFolder === 'Legacy contracts' && currentFolder === 'Active cases') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, archiveFolder, currentFolder, onSuccess]);

  return (
    <div style={{ padding: 16, maxHeight: '100vh', overflowY: 'auto' }}>
      <Title level={4}><SettingOutlined /> System Settings</Title>

      <Card title="General" size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>System name</Text>
            <Input size="small" defaultValue="Production" style={{ width: 200 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Region</Text>
            <Tag color="blue">US-East-1</Tag>
          </div>
        </Space>
      </Card>

      <Card title="Notifications" size="small" style={{ marginBottom: 16 }}>
        <Text type="secondary">Email alerts are enabled for all critical events.</Text>
      </Card>

      <Card title="Storage rules" size="small">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Current folder</Text>
            <Select
              style={{ width: '100%' }}
              value={currentFolder}
              onChange={(val) => { setCurrentFolder(val); setSaved(false); }}
              options={folderOptions}
              listHeight={200}
              virtual
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Archive folder</Text>
            <Select
              style={{ width: '100%' }}
              value={archiveFolder}
              onChange={(val) => { setArchiveFolder(val); setSaved(false); }}
              options={folderOptions}
              listHeight={200}
              virtual
            />
          </div>

          <Divider style={{ margin: '4px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => { setArchiveFolder('Accounting records'); setSaved(false); }}>Discard</Button>
            <Button type="primary" onClick={() => setSaved(true)}>Save storage rules</Button>
          </div>
        </Space>
      </Card>

      <Card size="small" style={{ marginTop: 16 }}>
        <Space>
          <Tag>Retention: 7 years</Tag>
          <Text type="secondary">Last backup: 12h ago</Text>
          <SearchOutlined style={{ color: '#999' }} />
        </Space>
      </Card>
    </div>
  );
}
