'use client';

/**
 * collapsible_disclosure-antd-T10: Settings table cell: expand SMTP advanced options
 * 
 * The page is a compact settings table where the disclosure control is embedded in a table cell.
 * 
 * - Layout: table_cell (the target component is inside a table row).
 * - The table has multiple rows of text and switches, but only one collapsible disclosure component.
 * - Target component: an AntD Collapse with a SINGLE panel titled "SMTP advanced options" placed in the rightmost cell of the "Email delivery" row.
 * - Initial state: the "SMTP advanced options" panel is collapsed (no advanced content visible).
 * - The cell is narrow, so the clickable header is smaller and surrounded by other table content (labels, toggles).
 * 
 * Success: expanded_panel includes "SMTP advanced options"
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Switch, Collapse } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const [switches, setSwitches] = useState({
    notifications: true,
    email: true,
    sync: false,
  });

  useEffect(() => {
    if (activeKey.includes('smtp_advanced')) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  const columns = [
    {
      title: 'Setting',
      dataIndex: 'setting',
      key: 'setting',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_: unknown, record: { key: string; switch?: boolean }) => {
        if (record.switch !== undefined) {
          return (
            <Switch 
              size="small"
              checked={switches[record.key as keyof typeof switches]} 
              onChange={(checked) => setSwitches(prev => ({ ...prev, [record.key]: checked }))}
            />
          );
        }
        return null;
      },
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (_: unknown, record: { key: string; collapse?: boolean }) => {
        if (record.collapse) {
          return (
            <Collapse
              size="small"
              activeKey={activeKey}
              onChange={(key) => setActiveKey(key as string[])}
              style={{ width: 180 }}
              items={[
                {
                  key: 'smtp_advanced',
                  label: 'SMTP advanced options',
                  children: (
                    <div style={{ fontSize: 12 }}>
                      <p style={{ margin: '0 0 4px' }}>Port: 587</p>
                      <p style={{ margin: '0 0 4px' }}>TLS: Enabled</p>
                      <p style={{ margin: 0 }}>Auth: PLAIN</p>
                    </div>
                  ),
                },
              ]}
            />
          );
        }
        return <span style={{ color: '#999', fontSize: 12 }}>—</span>;
      },
    },
  ];

  const data = [
    { key: 'notifications', setting: 'Notifications', switch: true },
    { key: 'email', setting: 'Email delivery', switch: true, collapse: true },
    { key: 'sync', setting: 'Data sync', switch: false },
  ];

  return (
    <Card title="Email delivery settings" style={{ width: 500 }} data-row-id="email-delivery">
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false}
        size="small"
      />
    </Card>
  );
}
