'use client';

/**
 * text_input-antd-T05: Set backup host with two inputs
 * 
 * Scene is a settings_panel layout centered in the viewport titled "Server settings". There are two Ant
 * Design single-line Inputs (instances=2) stacked vertically with clear labels: "Primary host" and "Backup
 * host". Both inputs are enabled and visible without scrolling. Initial values: Primary host = "edge-01";
 * Backup host = "edge-99". There is no modal/popover. A small Save button exists in the panel footer as a
 * distractor, but saving is NOT required for success.
 * 
 * Success: The input labeled "Backup host" has value exactly "edge-02" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryHost, setPrimaryHost] = useState('edge-01');
  const [backupHost, setBackupHost] = useState('edge-99');

  useEffect(() => {
    if (backupHost.trim() === 'edge-02') {
      onSuccess();
    }
  }, [backupHost, onSuccess]);

  return (
    <Card title="Server settings" style={{ width: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <label htmlFor="primary-host" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Primary host
          </label>
          <Input
            id="primary-host"
            value={primaryHost}
            onChange={(e) => setPrimaryHost(e.target.value)}
            data-testid="primary-host-input"
          />
        </div>
        
        <div>
          <label htmlFor="backup-host" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Backup host
          </label>
          <Input
            id="backup-host"
            value={backupHost}
            onChange={(e) => setBackupHost(e.target.value)}
            data-testid="backup-host-input"
          />
        </div>
        
        <Button type="primary">Save</Button>
      </Space>
    </Card>
  );
}
