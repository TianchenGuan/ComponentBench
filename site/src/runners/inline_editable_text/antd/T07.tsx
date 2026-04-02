'use client';

/**
 * inline_editable_text-antd-T07: Match badge text from a visual reference
 * 
 * A centered card titled "Badge Designer" is split into two columns.
 * Left column: one inline editable text labeled "Badge text", currently "VISITOR".
 * Right column: a non-editable sample badge preview showing the desired text exactly
 * as it should appear (including punctuation and spacing).
 * 
 * The target text is not written in the instructions; it must be read from the sample badge preview.
 * 
 * Success: The committed (display) value equals 'STAFF — 2026' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Input, Button, Space } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('VISITOR');
  const [editingValue, setEditingValue] = useState('VISITOR');
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
    if (!isEditing && value === 'STAFF — 2026' && !successCalledRef.current) {
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
    <Card title="Badge Designer" style={{ width: 500 }} data-testid="badge-designer-card">
      <div style={{ display: 'flex', gap: 32 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Badge text</div>
          <div 
            data-testid="editable-badge-text"
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
          <div style={{ fontWeight: 500, marginBottom: 8, color: '#666', fontSize: 12 }}>Sample Badge</div>
          <div
            data-testid="sample-badge"
            style={{
              background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
              color: '#fff',
              padding: '16px 24px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: 1,
              textAlign: 'center',
              minWidth: 140,
            }}
          >
            STAFF — 2026
          </div>
        </div>
      </div>
    </Card>
  );
}
