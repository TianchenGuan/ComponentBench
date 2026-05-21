'use client';

/**
 * inline_editable_text-antd-T03: Clear a status note to empty
 * 
 * A centered card titled "Status" contains one inline editable text row labeled "Status note".
 * Initial value: "Waiting for approval". The text is shown as Typography.Text with an edit icon.
 * 
 * When editing, the component shows a one-line input with a built-in clear (×) affordance
 * inside the input, plus inline "Save" and "Cancel" controls.
 * 
 * Success: The committed (display) value equals '' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Input, Button, Space } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Waiting for approval');
  const [editingValue, setEditingValue] = useState('Waiting for approval');
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
    // Success when NOT editing and value is exactly empty string
    if (!isEditing && value === '' && !successCalledRef.current) {
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
    <Card title="Status" style={{ width: 400 }} data-testid="status-card">
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Status note</div>
        <div 
          data-testid="editable-status-note"
          data-mode={isEditing ? 'editing' : 'display'}
          data-value={value}
        >
          {isEditing ? (
            <Space.Compact style={{ width: '100%' }}>
              <Input
                ref={inputRef}
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                allowClear
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
