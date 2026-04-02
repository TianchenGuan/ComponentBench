'use client';

/**
 * listbox_single-antd-v2-T35: Drawer city list: scroll to São Paulo and save route
 *
 * A logistics dashboard has a "Route defaults" button. Clicking it opens an AntD Drawer with
 * a vertically scrollable Menu acting as a single-select listbox labeled "Destination city".
 * Cities are grouped by region; São Paulo is below the initial viewport under Americas.
 * The drawer footer has "Cancel" and "Save route defaults". Selection commits only on Save.
 *
 * Success: Destination city = "sao_paulo", "Save route defaults" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Drawer, Menu, Typography, Card, Space, Tag } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const cityGroups: MenuProps['items'] = [
  { type: 'group', label: 'Europe', children: [
    { key: 'london', label: 'London' },
    { key: 'paris', label: 'Paris' },
    { key: 'berlin', label: 'Berlin' },
    { key: 'madrid', label: 'Madrid' },
    { key: 'rome', label: 'Rome' },
  ]},
  { type: 'group', label: 'Asia', children: [
    { key: 'tokyo', label: 'Tokyo' },
    { key: 'seoul', label: 'Seoul' },
    { key: 'mumbai', label: 'Mumbai' },
    { key: 'bangkok', label: 'Bangkok' },
    { key: 'singapore', label: 'Singapore' },
  ]},
  { type: 'group', label: 'Africa', children: [
    { key: 'cairo', label: 'Cairo' },
    { key: 'lagos', label: 'Lagos' },
    { key: 'nairobi', label: 'Nairobi' },
  ]},
  { type: 'group', label: 'Americas', children: [
    { key: 'new_york', label: 'New York' },
    { key: 'bogota', label: 'Bogotá' },
    { key: 'buenos_aires', label: 'Buenos Aires' },
    { key: 'sao_paulo', label: 'São Paulo' },
    { key: 'lima', label: 'Lima' },
  ]},
];

export default function T35({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<string>('london');
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && selected === 'sao_paulo') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selected, onSuccess]);

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    setSelected(key);
    setCommitted(false);
  };

  const handleSave = () => {
    setCommitted(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ maxWidth: 520 }}>
        <Title level={4} style={{ margin: 0 }}>Logistics Dashboard</Title>
        <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>Manage route and shipment defaults</Text>
        <Space style={{ marginTop: 16 }}>
          <Tag color="blue">Region: Global</Tag>
          <Tag>Active routes: 47</Tag>
          <Tag color="green">On-time: 94%</Tag>
        </Space>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => setDrawerOpen(true)}>Route defaults</Button>
        </div>
      </Card>

      <Drawer
        title="Route defaults"
        placement="right"
        width={380}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save route defaults</Button>
          </div>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Destination city</Text>
        <div style={{ height: 220, overflow: 'auto', border: '1px solid #d9d9d9', borderRadius: 6 }}>
          <Menu
            data-cb-listbox-root
            data-cb-selected-value={selected}
            mode="inline"
            selectedKeys={[selected]}
            onSelect={handleSelect}
            items={cityGroups}
            style={{ border: 'none' }}
          />
        </div>
        <Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 12 }}>
          Choose the default destination for new shipments.
        </Text>
      </Drawer>
    </div>
  );
}
