'use client';

/**
 * switch-antd-T10: Scroll to Diagnostics and disable telemetry
 *
 * Layout: settings_panel anchored near the top-right of the viewport with its own internal scrollbar (the whole page does not need to scroll).
 * Spacing: compact; Scale: small — switches use AntD size="small" and rows have reduced vertical padding.
 * The panel contains multiple sections ("General", "Notifications", "Diagnostics"), each with several labeled switches (3+ switches visible per section).
 * The target switch is in the "Diagnostics" section labeled "Share anonymous usage data" with a short description ("Helps improve the product").
 * Initial state: the target switch is ON.
 * Clutter: medium — section headers and a couple of text links ("Learn more", "Privacy policy") appear, but only switch state matters.
 * Feedback: toggling the switch updates immediately; there is no Save button.
 */

import React, { useState } from 'react';
import { Card, Switch, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title, Text, Link } = Typography;

interface SwitchState {
  darkMode: boolean;
  compactView: boolean;
  autoSave: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  crashReports: boolean;
  shareUsageData: boolean;
  performanceMetrics: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [switches, setSwitches] = useState<SwitchState>({
    darkMode: false,
    compactView: true,
    autoSave: true,
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    crashReports: true,
    shareUsageData: true,
    performanceMetrics: false,
  });

  const handleChange = (key: keyof SwitchState, value: boolean) => {
    setSwitches(prev => ({ ...prev, [key]: value }));
    if (key === 'shareUsageData' && !value) {
      onSuccess();
    }
  };

  const SwitchRow = ({ 
    label, 
    description, 
    switchKey, 
    testId 
  }: { 
    label: string; 
    description?: string; 
    switchKey: keyof SwitchState;
    testId: string;
  }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
      <div>
        <div style={{ fontSize: 13 }}>{label}</div>
        {description && <div style={{ fontSize: 11, color: '#999' }}>{description}</div>}
      </div>
      <Switch
        size="small"
        checked={switches[switchKey]}
        onChange={(checked) => handleChange(switchKey, checked)}
        data-testid={testId}
        aria-checked={switches[switchKey]}
      />
    </div>
  );

  return (
    <Card 
      title="Settings" 
      style={{ width: 350, maxHeight: 350, overflow: 'hidden' }}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ height: 280, overflowY: 'auto', padding: '12px 16px' }}>
        <Title level={5} style={{ fontSize: 13, marginBottom: 8 }}>General</Title>
        <SwitchRow label="Dark mode" switchKey="darkMode" testId="dark-mode-switch" />
        <SwitchRow label="Compact view" switchKey="compactView" testId="compact-view-switch" />
        <SwitchRow label="Auto-save" description="Save changes automatically" switchKey="autoSave" testId="auto-save-switch" />
        
        <Title level={5} style={{ fontSize: 13, marginTop: 16, marginBottom: 8 }}>Notifications</Title>
        <SwitchRow label="Email notifications" switchKey="emailNotifications" testId="email-notifications-switch" />
        <SwitchRow label="Push notifications" switchKey="pushNotifications" testId="push-notifications-switch" />
        <SwitchRow label="Weekly digest" description="Receive weekly summary" switchKey="weeklyDigest" testId="weekly-digest-switch" />
        
        <Title level={5} style={{ fontSize: 13, marginTop: 16, marginBottom: 8 }}>Diagnostics</Title>
        <SwitchRow label="Crash reports" description="Send crash data" switchKey="crashReports" testId="crash-reports-switch" />
        <SwitchRow 
          label="Share anonymous usage data" 
          description="Helps improve the product" 
          switchKey="shareUsageData" 
          testId="share-usage-data-switch" 
        />
        <SwitchRow label="Performance metrics" switchKey="performanceMetrics" testId="performance-metrics-switch" />
        
        <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
          <Link style={{ fontSize: 11 }}>Learn more</Link>
          <Link style={{ fontSize: 11 }}>Privacy policy</Link>
        </div>
      </div>
    </Card>
  );
}
