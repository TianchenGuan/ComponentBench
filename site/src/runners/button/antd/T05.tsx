'use client';

/**
 * button-antd-T05: Save settings at bottom (scroll to find)
 * 
 * Settings panel with internal scroll region.
 * Multiple setting rows with toggles. "Save changes" button in sticky footer
 * at the bottom (not visible initially - requires scrolling).
 */

import React, { useState } from 'react';
import { Button, Card, Switch, Spin } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (saving || saved) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      onSuccess();
    }, 500);
  };

  // Settings items to create scrollable content
  const settings = [
    { key: 'notifications', label: 'Email notifications', desc: 'Receive updates via email' },
    { key: 'marketing', label: 'Marketing emails', desc: 'Promotional content and offers' },
    { key: 'analytics', label: 'Usage analytics', desc: 'Help improve our product' },
    { key: 'location', label: 'Location services', desc: 'Enable location-based features' },
    { key: 'auto-update', label: 'Auto-update', desc: 'Automatically install updates' },
    { key: 'beta', label: 'Beta features', desc: 'Try experimental features' },
    { key: 'sync', label: 'Cloud sync', desc: 'Sync data across devices' },
    { key: 'backup', label: 'Auto backup', desc: 'Backup data automatically' },
    { key: 'dark-mode', label: 'Dark mode', desc: 'Use dark color scheme' },
    { key: 'compact', label: 'Compact view', desc: 'Show more items on screen' },
  ];

  return (
    <Card
      title="Settings"
      style={{ width: 400, height: 400, display: 'flex', flexDirection: 'column' }}
      styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: 0 } }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
        }}
      >
        {settings.map((setting) => (
          <div
            key={setting.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <div>
              <div style={{ fontWeight: 500 }}>{setting.label}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{setting.desc}</div>
            </div>
            <Switch defaultChecked={Math.random() > 0.5} />
          </div>
        ))}
      </div>
      
      <div
        style={{
          padding: 16,
          borderTop: '1px solid #f0f0f0',
          background: '#fafafa',
        }}
      >
        <Button
          type="primary"
          block
          onClick={handleSave}
          disabled={saved}
          loading={saving}
          data-testid="antd-btn-save-changes"
        >
          {saved ? 'Saved' : 'Save changes'}
        </Button>
      </div>
    </Card>
  );
}
