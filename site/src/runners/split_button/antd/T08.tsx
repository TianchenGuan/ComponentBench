'use client';

/**
 * split_button-antd-T08: Dashboard: set Billing report export to CSV (detailed)
 *
 * Layout: dashboard with two side-by-side cards (clutter=medium).
 * - Left card: "User report"
 * - Right card: "Billing report" ← target
 *
 * Each card contains a visually similar Ant Design `Dropdown.Button` split button.
 * Menu items (same for both): "CSV (summary)", "CSV (detailed)", "PDF", "Excel"
 * Initial state: Both split buttons start selected on "CSV (summary)".
 *
 * Success: Only the "Billing report export" instance has selectedAction = "csv_detailed"
 */

import React, { useState } from 'react';
import { Card, Dropdown, Button, Table } from 'antd';
import { DownOutlined, ReloadOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const menuItems: MenuProps['items'] = [
  { key: 'csv_summary', label: 'CSV (summary)' },
  { key: 'csv_detailed', label: 'CSV (detailed)' },
  { key: 'pdf', label: 'PDF' },
  { key: 'excel', label: 'Excel' },
];

const getActionLabel = (key: string) => {
  const labels: Record<string, string> = {
    'csv_summary': 'CSV (summary)',
    'csv_detailed': 'CSV (detailed)',
    'pdf': 'PDF',
    'excel': 'Excel',
  };
  return labels[key] || key;
};

function ReportCard({ 
  title, 
  instance, 
  selectedAction, 
  onActionChange,
  isTarget,
}: { 
  title: string; 
  instance: string;
  selectedAction: string;
  onActionChange: (key: string) => void;
  isTarget: boolean;
}) {
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    onActionChange(e.key);
  };

  // Mini table preview
  const columns = [
    { title: 'Item', dataIndex: 'item', key: 'item' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];
  const data = [
    { key: '1', item: 'Total', value: '$12,345' },
    { key: '2', item: 'Count', value: '156' },
  ];

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{title}</span>
          <Button icon={<ReloadOutlined />} size="small" disabled />
        </div>
      }
      style={{ flex: 1 }}
    >
      {/* Filters (non-interactive) */}
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <span style={{ 
          padding: '2px 8px', 
          background: '#f0f0f0', 
          borderRadius: 4, 
          fontSize: 11 
        }}>
          Last 30 days
        </span>
        <span style={{ 
          padding: '2px 8px', 
          background: '#f0f0f0', 
          borderRadius: 4, 
          fontSize: 11 
        }}>
          All regions
        </span>
      </div>

      {/* Mini table preview */}
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false} 
        size="small"
        style={{ marginBottom: 16 }}
      />

      <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
        {title} export
      </div>

      <div
        data-testid="split-button-root"
        data-instance={instance}
        data-selected-action={selectedAction}
        aria-label={`${title} export`}
      >
        <Dropdown.Button
          menu={{ items: menuItems, onClick: handleMenuClick }}
          icon={<DownOutlined />}
        >
          {getActionLabel(selectedAction)}
        </Dropdown.Button>
      </div>
    </Card>
  );
}

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [userReportAction, setUserReportAction] = useState('csv_summary');
  const [billingReportAction, setBillingReportAction] = useState('csv_summary');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const handleBillingChange = (key: string) => {
    setBillingReportAction(key);
    if (key === 'csv_detailed' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 800 }}>
      <ReportCard 
        title="User report"
        instance="user"
        selectedAction={userReportAction}
        onActionChange={setUserReportAction}
        isTarget={false}
      />
      <ReportCard 
        title="Billing report"
        instance="billing"
        selectedAction={billingReportAction}
        onActionChange={handleBillingChange}
        isTarget={true}
      />
    </div>
  );
}
