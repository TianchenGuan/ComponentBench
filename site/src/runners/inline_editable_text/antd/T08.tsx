'use client';

/**
 * inline_editable_text-antd-T08: Edit the Billing note among two fields
 * 
 * The page shows a centered "Checkout Settings" form section with several read-only fields
 * (e.g., Company, Region) and a "Notes" subsection.
 * Inside "Notes" there are two inline editable text rows of the same component type:
 *   • "Shipping note" (initial: "Leave at front desk")
 *   • "Billing note" (initial: "Net 30")
 * 
 * Success: The editable text instance labeled 'Billing note' has committed value
 * 'Send invoice by email' exactly, and is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Input, Button, Space, Divider } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface InlineEditableProps {
  label: string;
  initialValue: string;
  testId: string;
  onValueCommit?: (value: string, isEditing: boolean) => void;
}

function InlineEditable({ label, initialValue, testId, onValueCommit }: InlineEditableProps) {
  const [value, setValue] = useState(initialValue);
  const [editingValue, setEditingValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    onValueCommit?.(value, isEditing);
  }, [value, isEditing, onValueCommit]);

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
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 14 }}>{label}</div>
      <div 
        data-testid={testId}
        data-mode={isEditing ? 'editing' : 'display'}
        data-value={value}
        aria-label={label}
      >
        {isEditing ? (
          <Space.Compact style={{ width: '100%' }}>
            <Input
              ref={inputRef}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              style={{ flex: 1 }}
              data-testid={`${testId}-input`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleSave}
              data-testid={`${testId}-save`}
              aria-label="Save"
            />
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancel}
              data-testid={`${testId}-cancel`}
              aria-label="Cancel"
            />
          </Space.Compact>
        ) : (
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            onClick={handleEdit}
            data-testid={`${testId}-display`}
          >
            <Text>{value}</Text>
            <EditOutlined style={{ color: '#1677ff', fontSize: 14 }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  const handleBillingNoteChange = (value: string, isEditing: boolean) => {
    if (!isEditing && value === 'Send invoice by email' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  };

  return (
    <Card title="Checkout Settings" style={{ width: 450 }} data-testid="checkout-settings-card">
      {/* Read-only fields */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 14 }}>Company</div>
        <Text type="secondary">Acme Corp</Text>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 14 }}>Region</div>
        <Text type="secondary">North America</Text>
      </div>
      
      <Divider style={{ margin: '16px 0' }} />
      
      <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 16 }}>Notes</div>
      
      <InlineEditable
        label="Shipping note"
        initialValue="Leave at front desk"
        testId="editable-shipping-note"
      />
      
      <InlineEditable
        label="Billing note"
        initialValue="Net 30"
        testId="editable-billing-note"
        onValueCommit={handleBillingNoteChange}
      />
    </Card>
  );
}
