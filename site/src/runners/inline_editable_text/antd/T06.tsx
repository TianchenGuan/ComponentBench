'use client';

/**
 * inline_editable_text-antd-T06: Save a tagline with asynchronous feedback
 * 
 * A centered card titled "Team" contains one inline editable text labeled "Team tagline".
 * The tagline is displayed as Typography.Text with an edit icon. Initial value: "Ship it".
 * 
 * When you click Save, the component shows a brief loading state (Save control disabled
 * and a small spinner appears) before returning to the read-only view.
 * A toast message "Saved" appears in the top-right of the page after the commit.
 * If the text exceeds 20 characters, an inline error appears and the value is not committed.
 * 
 * Success: The committed (display) value equals 'Built to ship.' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Typography, Input, Button, Space, message, Spin } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Ship it');
  const [editingValue, setEditingValue] = useState('Ship it');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<any>(null);
  const successCalledRef = useRef(false);

  const isValid = useMemo(() => editingValue.length <= 20, [editingValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value.trim() === 'Built to ship.' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [value, isEditing, onSuccess]);

  const handleEdit = () => {
    setEditingValue(value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!isValid) return;
    
    setIsSaving(true);
    // Simulate async save
    await new Promise(resolve => setTimeout(resolve, 500));
    setValue(editingValue);
    setIsSaving(false);
    setIsEditing(false);
    message.success('Saved');
  };

  const handleCancel = () => {
    setEditingValue(value);
    setIsEditing(false);
  };

  return (
    <Card title="Team" style={{ width: 400 }} data-testid="team-card">
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Team tagline</div>
        <div 
          data-testid="editable-team-tagline"
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
                  status={!isValid ? 'error' : undefined}
                  style={{ flex: 1 }}
                  data-testid="editable-input"
                  disabled={isSaving}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isValid && !isSaving) handleSave();
                    if (e.key === 'Escape' && !isSaving) handleCancel();
                  }}
                />
                <Button
                  type="primary"
                  icon={isSaving ? <LoadingOutlined /> : <CheckOutlined />}
                  onClick={handleSave}
                  disabled={!isValid || isSaving}
                  data-testid="save-button"
                  aria-label="Save"
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  disabled={isSaving}
                  data-testid="cancel-button"
                  aria-label="Cancel"
                />
              </Space.Compact>
              {!isValid && (
                <Text type="danger" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                  Maximum 20 characters allowed
                </Text>
              )}
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
