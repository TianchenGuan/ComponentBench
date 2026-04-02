'use client';

/**
 * inline_editable_text-antd-T04: Set status label using mixed guidance
 * 
 * A centered card titled "Status Label" contains one inline editable text labeled "Status label".
 * The editable text currently shows "Idle". To the right of it, a non-interactive green preview
 * chip displays the desired label styling.
 * 
 * Success: The committed (display) value equals 'READY' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Input, Button, Space, Tag } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Idle');
  const [editingValue, setEditingValue] = useState('Idle');
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
    if (!isEditing && value === 'READY' && !successCalledRef.current) {
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
    <Card title="Status Label" style={{ width: 450 }} data-testid="status-label-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Status label</div>
          <div 
            data-testid="editable-status-label"
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
                <Text>{value}</Text>
                <EditOutlined style={{ color: '#1677ff', fontSize: 14 }} />
              </div>
            )}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 500, marginBottom: 8, color: '#666', fontSize: 12 }}>Preview</div>
          <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>READY</Tag>
        </div>
      </div>
    </Card>
  );
}
