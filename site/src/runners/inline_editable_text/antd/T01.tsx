'use client';

/**
 * inline_editable_text-antd-T01: Rename display name (single field)
 * 
 * A single centered card titled "Profile" contains one inline editable text row labeled "Display name".
 * The value is shown as Ant Design Typography.Text with a pencil edit icon on hover.
 * Initial value: "Ava Li".
 * 
 * Clicking the text or the pencil icon turns it into a one-line input with two inline controls:
 * "Save" (check icon) and "Cancel" (close icon).
 * 
 * Success: The committed (display) value equals 'Ava Chen' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Input, Button, Space } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Ava Li');
  const [editingValue, setEditingValue] = useState('Ava Li');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    // Only trigger success when NOT editing and value matches target
    if (!isEditing && value === 'Ava Chen' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [value, isEditing, onSuccess]);

  const handleEdit = () => {
    setEditingValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    setValue(editingValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingValue(value);
    setIsEditing(false);
  };

  return (
    <Card title="Profile" style={{ width: 400 }} data-testid="profile-card">
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Display name</div>
        <div 
          data-testid="editable-display-name"
          data-mode={isEditing ? 'editing' : 'display'}
          data-value={value}
        >
          {isEditing ? (
            <Space.Compact style={{ width: '100%' }}>
              <Input
                ref={inputRef}
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                style={{ flex: 1 }}
                data-testid="editable-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
              />
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleSave}
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
          ) : (
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              onClick={handleEdit}
              data-testid="display-text"
            >
              <Text>{value || <span style={{ color: '#999' }}>(empty)</span>}</Text>
              <EditOutlined style={{ color: '#1677ff', fontSize: 14 }} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
