'use client';

/**
 * inline_editable_text-antd-T02: Enter edit mode (no text change)
 * 
 * A centered card titled "Project" shows a single inline editable text labeled "Project title".
 * The value is displayed as "Launch Plan" in Ant Design Typography.Text with an edit (pencil) icon.
 * 
 * Clicking the text (or the pencil icon) swaps the Typography view for a focused one-line input
 * plus inline "Save" and "Cancel" controls.
 * 
 * Success: The component is in editing mode (mode='editing').
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Input, Button, Space } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Launch Plan');
  const [editingValue, setEditingValue] = useState('Launch Plan');
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
    // Success when entering edit mode
    if (isEditing && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [isEditing, onSuccess]);

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
    <Card title="Project" style={{ width: 400 }} data-testid="project-card">
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Project title</div>
        <div 
          data-testid="editable-project-title"
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
    </Card>
  );
}
