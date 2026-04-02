'use client';

/**
 * inline_editable_text-antd-T05: Enter a formatted ticket code
 * 
 * A centered card titled "Support Ticket" contains one inline editable text labeled "Ticket code".
 * The current value is "TKT-1000". Clicking the value opens an input with Save/Cancel controls.
 * 
 * While editing, an inline validation hint appears under the input: "Format: TKT-####".
 * If the format is wrong (missing hyphen, wrong prefix, not four digits), the input shows
 * an error state and the Save control is disabled until valid.
 * 
 * Success: The committed (display) value equals 'TKT-1042' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Typography, Input, Button, Space } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const TICKET_PATTERN = /^TKT-\d{4}$/;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('TKT-1000');
  const [editingValue, setEditingValue] = useState('TKT-1000');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const successCalledRef = useRef(false);

  const isValid = useMemo(() => TICKET_PATTERN.test(editingValue), [editingValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value === 'TKT-1042' && !successCalledRef.current) {
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

  return (
    <Card title="Support Ticket" style={{ width: 400 }} data-testid="support-ticket-card">
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Ticket code</div>
        <div 
          data-testid="editable-ticket-code"
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
                Format: TKT-####
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
