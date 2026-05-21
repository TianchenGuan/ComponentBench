'use client';

/**
 * masked_input-antd-v2-T03: Server IPv4 offscreen inside nested network panel
 *
 * nested_scroll layout with outer + inner scroll regions. A "Network addresses"
 * card has its own scrollable area containing two fixed-width IPv4 inputs
 * (Primary IPv4 = 010.000.010.200, Backup IPv4 = empty but initially below the
 * fold) plus unrelated toggles/blocks. Mask: ___.___.___.___  (3 digits per
 * octet). A card-level "Save network" button commits. Only Backup IPv4 should
 * become 192.168.001.010.
 *
 * Success: Backup IPv4 committed = '192.168.001.010' via 'Save network',
 * Primary IPv4 unchanged.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Switch, Typography, Divider, Space, Tag } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 8px',
  fontSize: 13,
  lineHeight: 1.5,
  border: '1px solid #d9d9d9',
  borderRadius: 4,
  outline: 'none',
  fontFamily: 'monospace',
};

export default function T03({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [primaryDraft, setPrimaryDraft] = useState('010.000.010.200');
  const [backupDraft, setBackupDraft] = useState('');
  const [primarySaved, setPrimarySaved] = useState('010.000.010.200');
  const [backupSaved, setBackupSaved] = useState('');

  const handleSave = () => {
    setPrimarySaved(primaryDraft);
    setBackupSaved(backupDraft);
  };

  useEffect(() => {
    if (successFired.current) return;
    if (backupSaved === '192.168.001.010' && primarySaved === '010.000.010.200') {
      successFired.current = true;
      onSuccess();
    }
  }, [backupSaved, primarySaved, onSuccess]);

  return (
    <div style={{ padding: 16, maxWidth: 700, margin: '0 auto' }}>
      {/* outer page content */}
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space>
          <Tag color="blue">Region: US-East</Tag>
          <Tag color="green">Status: Active</Tag>
        </Space>
      </Card>

      <Card
        title="Network addresses"
        size="small"
        styles={{ body: { padding: 0 } }}
      >
        {/* inner scroll region */}
        <div style={{ maxHeight: 260, overflowY: 'auto', padding: '12px 16px' }} data-testid="network-scroll">
          <div style={{ marginBottom: 12 }}>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Primary IPv4</Text>
            <IMaskInput
              mask="000.000.000.000"
              definitions={{ '0': /[0-9]/ }}
              placeholder="___.___.___.___"
              value={primaryDraft}
              onAccept={(val: string) => setPrimaryDraft(val)}
              data-testid="primary-ipv4"
              style={inputStyle}
            />
          </div>

          {/* filler content to push Backup below fold */}
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12 }}>DNS Override</Text>
            <Switch size="small" style={{ marginLeft: 8 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12 }}>Enable IPv6 fallback</Text>
            <Switch size="small" style={{ marginLeft: 8 }} defaultChecked />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              MTU: 1500 &middot; TTL: 64 &middot; Protocol: TCP/UDP
            </Text>
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12 }}>Proxy mode</Text>
            <Switch size="small" style={{ marginLeft: 8 }} />
          </div>
          <div style={{ marginBottom: 12, padding: 8, background: '#fafafa', borderRadius: 4 }}>
            <Text style={{ fontSize: 11, color: '#666' }}>
              Note: Changing network addresses will trigger a connectivity check on save.
            </Text>
          </div>
          <Divider style={{ margin: '8px 0' }} />

          <div style={{ marginBottom: 12 }}>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Backup IPv4</Text>
            <IMaskInput
              mask="000.000.000.000"
              definitions={{ '0': /[0-9]/ }}
              placeholder="___.___.___.___"
              value={backupDraft}
              onAccept={(val: string) => setBackupDraft(val)}
              data-testid="backup-ipv4"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0', textAlign: 'right' }}>
          <Button type="primary" size="small" onClick={handleSave}>Save network</Button>
        </div>
      </Card>
    </div>
  );
}
