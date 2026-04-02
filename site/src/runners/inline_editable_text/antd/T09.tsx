'use client';

/**
 * inline_editable_text-antd-T09: Enter account code in dark theme
 * 
 * A single card is centered on a dark-themed page (dark background, light text) titled "Account".
 * It contains one inline editable text labeled "Account code" with initial value "ACCT-1020".
 * 
 * Editing opens a one-line input with Save/Cancel controls. A small helper text under the
 * input states: "Format: ACCT-#### (uppercase)".
 * 
 * If the entry does not match the format, the input shows an error state and Save is disabled.
 * 
 * Success: The committed (display) value equals 'ACCT-2049' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Typography, Input, Button, Space, ConfigProvider, theme } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const ACCT_PATTERN = /^ACCT-\d{4}$/;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('ACCT-1020');
  const [editingValue, setEditingValue] = useState('ACCT-1020');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const successCalledRef = useRef(false);

  const isValid = useMemo(() => ACCT_PATTERN.test(editingValue), [editingValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value === 'ACCT-2049' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [value, isEditing, onSuccess]);

  const handleEdit = () => {
    setEditingValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (isValid) {
      setValue(editingValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditingValue(value);
    setIsEditing(false);
  };

  // Note: Dark theme is handled by ThemeWrapper at the task page level
  // This component uses standard AntD which will inherit the theme

  return (
    <Card title="Account" style={{ width: 400 }} data-testid="account-card">
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Account code</div>
        <div 
          data-testid="editable-account-code"
          data-mode={isEditing ? 'editing' : 'display'}
          data-value={value}
        >
          {isEditing ? (
            <div>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  ref={inputRef}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  status={!isValid && editingValue ? 'error' : undefined}
                  style={{ flex: 1 }}
                  data-testid="editable-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isValid) handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleSave}
                  disabled={!isValid}
                  data-testid="save-button"
                  aria-label="Save"
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  data-testid="cancel-button"
                  aria-label="Cancel"
                />
              </Space.Compact>
              <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                Format: ACCT-#### (uppercase)
              </Text>
            </div>
          ) : (
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              onClick={handleEdit}
              data-testid="display-text"
            >
              <Text>{value}</Text>
              <EditOutlined style={{ color: '#1677ff', fontSize: 14 }} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
