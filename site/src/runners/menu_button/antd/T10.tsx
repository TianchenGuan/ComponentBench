'use client';

/**
 * menu_button-antd-T10: Set Billing cycle to Quarterly in dark dashboard
 * 
 * Layout: dashboard scene with dark theme.
 * A top toolbar contains three similar menu buttons (instances=3), each an AntD Button with Dropdown:
 * "Billing cycle: Monthly", "Report cycle: Monthly", "Backup cycle: Monthly".
 * Each menu contains the same three options: "Monthly", "Quarterly", "Yearly".
 * 
 * Clutter is high: the dashboard also shows charts, filters, and a table (simplified).
 * Initial state: all three cycles are Monthly.
 * Selecting an option closes that dropdown and updates only that button's label.
 * 
 * Success: The menu button labeled "Billing cycle" has selected value "Quarterly".
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown, Table } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const cycleOptions = ['Monthly', 'Quarterly', 'Yearly'];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [reportCycle, setReportCycle] = useState('Monthly');
  const [backupCycle, setBackupCycle] = useState('Monthly');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (billingCycle === 'Quarterly' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [billingCycle, successTriggered, onSuccess]);

  const createMenuItems = (currentValue: string, setValue: (v: string) => void) => ({
    items: cycleOptions.map(opt => ({ key: opt, label: opt })),
    onClick: ({ key }: { key: string }) => setValue(key),
    selectable: true,
    selectedKeys: [currentValue],
  });

  // Mock data for clutter
  const mockTableData = [
    { key: '1', metric: 'Revenue', value: '$12,450' },
    { key: '2', metric: 'Users', value: '1,234' },
    { key: '3', metric: 'Growth', value: '+15%' },
  ];

  const tableColumns = [
    { title: 'Metric', dataIndex: 'metric', key: 'metric' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      {/* Toolbar with menu buttons */}
      <Card styles={{ body: { padding: '12px 16px' } }} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Dropdown menu={createMenuItems(billingCycle, setBillingCycle)} trigger={['click']}>
            <Button data-testid="menu-button-billing-cycle">
              Billing cycle: {billingCycle} <DownOutlined />
            </Button>
          </Dropdown>

          <Dropdown menu={createMenuItems(reportCycle, setReportCycle)} trigger={['click']}>
            <Button data-testid="menu-button-report-cycle">
              Report cycle: {reportCycle} <DownOutlined />
            </Button>
          </Dropdown>

          <Dropdown menu={createMenuItems(backupCycle, setBackupCycle)} trigger={['click']}>
            <Button data-testid="menu-button-backup-cycle">
              Backup cycle: {backupCycle} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </Card>

      {/* Clutter: Dashboard content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Quick Stats" size="small">
          <Table
            dataSource={mockTableData}
            columns={tableColumns}
            pagination={false}
            size="small"
          />
        </Card>

        <Card title="Filters" size="small">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button type="text" size="small">All time</Button>
            <Button type="text" size="small">Last 30 days</Button>
            <Button type="text" size="small">Last 7 days</Button>
          </div>
        </Card>

        <Card title="Chart Placeholder" size="small" style={{ gridColumn: '1 / -1' }}>
          <div style={{ height: 100, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            [Chart visualization would appear here]
          </div>
        </Card>
      </div>
    </div>
  );
}
