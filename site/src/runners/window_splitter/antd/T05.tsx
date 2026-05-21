'use client';

/**
 * window_splitter-antd-T05: Vertical split: make chart area 65% height
 * 
 * The page is a settings_panel layout with a left navigation column (non-functional) 
 * and a main content area. In the main area, a card titled "Primary splitter" contains 
 * an Ant Design Splitter configured in vertical layout (top/bottom panes). The top pane 
 * is labeled "Chart" and the bottom pane is labeled "Table". A horizontal splitter bar 
 * separates them. A readout beneath the component shows: "Chart: 50% height • Table: 50% height".
 * 
 * Success: Chart (top) pane is 65% ±3%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card, Menu } from 'antd';
import { SettingOutlined, DashboardOutlined, UserOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([50, 50]);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const topFraction = sizes[0] / 100;
    // Success: top pane is 65% ±3% (0.62 to 0.68)
    if (!successFiredRef.current && topFraction >= 0.62 && topFraction <= 0.68) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [sizes, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 24, minHeight: 500 }}>
      {/* Left navigation (non-functional) */}
      <div style={{ width: 200 }}>
        <Menu
          mode="vertical"
          defaultSelectedKeys={['settings']}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
            { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
          ]}
          style={{ height: '100%' }}
        />
      </div>
      
      {/* Main content area */}
      <div style={{ flex: 1 }}>
        <Card title="Primary splitter" style={{ width: '100%' }}>
          <Splitter
            layout="vertical"
            style={{ height: 400, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
            onResize={(newSizes) => {
              const total = newSizes.reduce((a, b) => a + b, 0);
              if (total > 0) {
                setSizes(newSizes.map(s => (s / total) * 100));
              }
            }}
            data-testid="splitter-primary"
          >
            <Splitter.Panel defaultSize="50%" min="20%" max="80%">
              <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                <span style={{ fontWeight: 500 }}>Chart</span>
              </div>
            </Splitter.Panel>
            <Splitter.Panel>
              <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
                <span style={{ fontWeight: 500 }}>Table</span>
              </div>
            </Splitter.Panel>
          </Splitter>
          <div style={{ marginTop: 12, textAlign: 'center', color: '#666', fontSize: 14 }}>
            Chart: {sizes[0].toFixed(0)}% height • Table: {sizes[1].toFixed(0)}% height
          </div>
        </Card>
      </div>
    </div>
  );
}
