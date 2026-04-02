'use client';

/**
 * masked_input-antd-v2-T02: EIN inside right drawer with in-field Apply
 *
 * Dark drawer_flow layout. A button opens a right Drawer titled "Tax details"
 * with two masked EIN inputs: Primary EIN (12-3456789) and Backup EIN (empty).
 * Pattern ##-#######. Each field has tiny in-field checkmark (Apply) and X
 * (Cancel) icons. Clicking checkmark commits that field only.
 * Only Backup EIN should change to 58-3947201.
 *
 * Success: Backup EIN committed value equals '58-3947201' via Apply,
 * Primary EIN unchanged at '12-3456789'.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Card, Drawer, Typography, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '2px 8px',
  fontSize: 13,
  lineHeight: 1.5,
  border: '1px solid #434343',
  borderRadius: 4,
  outline: 'none',
  background: '#141414',
  color: '#fff',
  fontFamily: 'monospace',
};

interface EinFieldProps {
  label: string;
  value: string;
  savedValue: string;
  onChange: (v: string) => void;
  onApply: () => void;
  onCancel: () => void;
  testId: string;
}

function EinField({ label, value, savedValue, onChange, onApply, onCancel, testId }: EinFieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Text strong style={{ display: 'block', marginBottom: 4, color: '#e0e0e0' }}>{label}</Text>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <IMaskInput
          mask="00-0000000"
          definitions={{ '0': /[0-9]/ }}
          placeholder="##-#######"
          value={value}
          onAccept={(val: string) => onChange(val)}
          data-testid={testId}
          style={inputStyle}
        />
        <Button
          type="text"
          size="small"
          icon={<CheckOutlined style={{ color: '#52c41a', fontSize: 12 }} />}
          onClick={onApply}
          aria-label="Apply"
        />
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />}
          onClick={onCancel}
          aria-label="Cancel"
        />
      </div>
      <Text style={{ fontSize: 11, color: '#888' }}>
        {savedValue ? `Saved: ${savedValue}` : 'Not saved'}
      </Text>
    </div>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [primaryDraft, setPrimaryDraft] = useState('12-3456789');
  const [backupDraft, setBackupDraft] = useState('');
  const [primarySaved, setPrimarySaved] = useState('12-3456789');
  const [backupSaved, setBackupSaved] = useState('');

  const applyPrimary = useCallback(() => setPrimarySaved(primaryDraft), [primaryDraft]);
  const applyBackup = useCallback(() => setBackupSaved(backupDraft), [backupDraft]);
  const cancelPrimary = useCallback(() => setPrimaryDraft(primarySaved), [primarySaved]);
  const cancelBackup = useCallback(() => setBackupDraft(backupSaved), [backupSaved]);

  useEffect(() => {
    if (successFired.current) return;
    if (backupSaved === '58-3947201' && primarySaved === '12-3456789') {
      successFired.current = true;
      onSuccess();
    }
  }, [backupSaved, primarySaved, onSuccess]);

  return (
    <div style={{ padding: 24, background: '#1a1a1a', minHeight: '100vh' }}>
      <Card style={{ maxWidth: 400, background: '#262626', borderColor: '#303030' }}>
        <Text style={{ color: '#e0e0e0' }}>Tax settings require a drawer for editing.</Text>
        <div style={{ marginTop: 12 }}>
          <Button type="primary" onClick={() => setDrawerOpen(true)}>Edit tax details</Button>
        </div>
      </Card>

      <Drawer
        title="Tax details"
        placement="right"
        width={380}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{ header: { background: '#1f1f1f', color: '#fff', borderColor: '#303030' }, body: { background: '#1f1f1f' } }}
      >
        <EinField
          label="Primary EIN"
          value={primaryDraft}
          savedValue={primarySaved}
          onChange={setPrimaryDraft}
          onApply={applyPrimary}
          onCancel={cancelPrimary}
          testId="primary-ein"
        />
        <EinField
          label="Backup EIN"
          value={backupDraft}
          savedValue={backupSaved}
          onChange={setBackupDraft}
          onApply={applyBackup}
          onCancel={cancelBackup}
          testId="backup-ein"
        />
        <Text style={{ fontSize: 11, color: '#666' }}>
          Applied value will show status: Saved
        </Text>
      </Drawer>
    </div>
  );
}
