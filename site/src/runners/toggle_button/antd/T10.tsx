'use client';

/**
 * toggle_button-antd-T10: Scroll to Developer options and disable Beta banner (compact dashboard)
 *
 * Layout: dashboard page with compact spacing (dense cards and tighter padding). Theme is light, scale is default.
 *
 * The page starts with two summary cards ("Usage", "Status") and a long list of collapsible-looking cards below.
 * The target card header reads "Developer options" (it is NOT collapsed; it is simply further down the page).
 *
 * Inside "Developer options" there are four toggle-style AntD Buttons laid out in a vertical list:
 * - "Verbose logs"
 * - "Beta banner"  ← target
 * - "Mock data"
 * - "Trace network"
 *
 * Each row uses the same toggle semantics (aria-pressed true/false; filled styling when On).
 * Initial state: "Beta banner" is On (pressed); the other toggles have mixed initial states for distraction.
 *
 * Success depends only on setting the "Beta banner" toggle to Off (not pressed).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Statistic, Space } from 'antd';
import { CheckOutlined, BugOutlined, FlagOutlined, DatabaseOutlined, ApiOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

interface ToggleRow {
  key: string;
  label: string;
  icon: React.ReactNode;
  pressed: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [toggles, setToggles] = useState<ToggleRow[]>([
    { key: 'verbose-logs', label: 'Verbose logs', icon: <BugOutlined />, pressed: true },
    { key: 'beta-banner', label: 'Beta banner', icon: <FlagOutlined />, pressed: true }, // Target: starts On
    { key: 'mock-data', label: 'Mock data', icon: <DatabaseOutlined />, pressed: false },
    { key: 'trace-network', label: 'Trace network', icon: <ApiOutlined />, pressed: false },
  ]);

  const developerOptionsRef = useRef<HTMLDivElement>(null);

  const handleToggle = (key: string) => {
    setToggles(prev => prev.map(toggle => {
      if (toggle.key === key) {
        const newPressed = !toggle.pressed;
        // Success when Beta banner is turned OFF
        if (key === 'beta-banner' && !newPressed) {
          onSuccess();
        }
        return { ...toggle, pressed: newPressed };
      }
      return toggle;
    }));
  };

  return (
    <div style={{ 
      height: 500, 
      overflowY: 'auto', 
      padding: 16, 
      background: '#f5f5f5',
    }}>
      {/* Summary cards at top */}
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Space size={12} style={{ width: '100%' }}>
          <Card size="small" style={{ width: 200 }}>
            <Statistic title="Usage" value="78%" />
          </Card>
          <Card size="small" style={{ width: 200 }}>
            <Statistic title="Status" value="Active" />
          </Card>
        </Space>

        {/* Filler cards */}
        <Card size="small" title="General" style={{ width: '100%' }}>
          <div style={{ color: '#999', fontSize: 12 }}>General settings and configuration options.</div>
        </Card>

        <Card size="small" title="Notifications" style={{ width: '100%' }}>
          <div style={{ color: '#999', fontSize: 12 }}>Configure notification preferences.</div>
        </Card>

        <Card size="small" title="Appearance" style={{ width: '100%' }}>
          <div style={{ color: '#999', fontSize: 12 }}>Customize the look and feel.</div>
        </Card>

        <Card size="small" title="Security" style={{ width: '100%' }}>
          <div style={{ color: '#999', fontSize: 12 }}>Security and privacy settings.</div>
        </Card>

        {/* Developer options - TARGET SECTION */}
        <div ref={developerOptionsRef}>
          <Card size="small" title="Developer options" style={{ width: '100%' }} data-testid="developer-options-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {toggles.map(toggle => (
                <div key={toggle.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{toggle.label}</span>
                  <Button
                    type={toggle.pressed ? 'primary' : 'default'}
                    size="small"
                    icon={toggle.pressed ? <CheckOutlined /> : toggle.icon}
                    onClick={() => handleToggle(toggle.key)}
                    aria-pressed={toggle.pressed}
                    data-testid={`toggle-${toggle.key}`}
                  >
                    {toggle.pressed ? 'On' : 'Off'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* More filler at bottom */}
        <Card size="small" title="About" style={{ width: '100%' }}>
          <div style={{ color: '#999', fontSize: 12 }}>Version 2.1.0</div>
        </Card>
      </Space>
    </div>
  );
}
