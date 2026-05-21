'use client';

/**
 * listbox_single-antd-v2-T38: Service row visibility: set Gateway to Private and save row
 *
 * A compact services table with four rows. Each row has a "Visibility" column rendered as a
 * tiny AntD Menu listbox (Public, Team-only, Private). Gateway starts at Team-only.
 * Each row has a row-local Save button. Table includes headers, badges, and a filter input.
 *
 * Success: Gateway Visibility = "private", "Save" in Gateway row clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Menu, Button, Typography, Input, Tag, Space } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

interface ServiceRow {
  name: string;
  status: string;
  statusColor: string;
  visibility: string;
}

const visibilityOptions = [
  { key: 'public', label: 'Public' },
  { key: 'team_only', label: 'Team-only' },
  { key: 'private', label: 'Private' },
];

const initialServices: ServiceRow[] = [
  { name: 'Auth', status: 'Healthy', statusColor: 'green', visibility: 'public' },
  { name: 'Gateway', status: 'Healthy', statusColor: 'green', visibility: 'team_only' },
  { name: 'Billing', status: 'Degraded', statusColor: 'orange', visibility: 'private' },
  { name: 'Analytics', status: 'Healthy', statusColor: 'green', visibility: 'public' },
];

export default function T38({ onSuccess }: TaskComponentProps) {
  const [services, setServices] = useState(initialServices);
  const [savedRows, setSavedRows] = useState<Record<string, boolean>>({});
  const successFired = useRef(false);

  const gatewayRow = services.find(s => s.name === 'Gateway')!;

  useEffect(() => {
    if (successFired.current) return;
    if (savedRows['Gateway'] && gatewayRow.visibility === 'private') {
      successFired.current = true;
      onSuccess();
    }
  }, [savedRows, gatewayRow.visibility, onSuccess]);

  const handleVisibilityChange = (serviceName: string, key: string) => {
    setServices(prev => prev.map(s =>
      s.name === serviceName ? { ...s, visibility: key } : s
    ));
    setSavedRows(prev => ({ ...prev, [serviceName]: false }));
  };

  const handleRowSave = (serviceName: string) => {
    setSavedRows(prev => ({ ...prev, [serviceName]: true }));
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Services</Title>
          <Space>
            <Input placeholder="Filter services…" style={{ width: 160 }} size="small" />
            <Tag color="blue">4 total</Tag>
          </Space>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#888' }}>Service</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#888' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#888' }}>Visibility</th>
              <th style={{ padding: '8px 12px' }}></th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '8px 12px' }}>
                  <Text strong>{service.name}</Text>
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <Tag color={service.statusColor}>{service.status}</Tag>
                </td>
                <td style={{ padding: '4px 8px' }}>
                  <Menu
                    data-cb-listbox-root
                    data-cb-instance={`${service.name} / Visibility`}
                    data-cb-selected-value={service.visibility}
                    mode="inline"
                    selectedKeys={[service.visibility]}
                    onSelect={({ key }: { key: string }) => handleVisibilityChange(service.name, key)}
                    items={visibilityOptions.map(opt => ({
                      key: opt.key,
                      label: <span style={{ fontSize: 12 }}>{opt.label}</span>,
                      'data-cb-option-value': opt.key,
                    }))}
                    style={{ border: '1px solid #d9d9d9', borderRadius: 4, minWidth: 120 }}
                  />
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleRowSave(service.name)}
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
