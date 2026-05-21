'use client';

/**
 * inline_editable_text-antd-T10: Edit a specific table cell (compact, corner placement)
 * 
 * A compact-density table card is anchored near the bottom-right of the viewport.
 * The card title is "Orders". The table has three rows (Alpha, Beta, Gamma) and
 * columns: Order, Owner, Status.
 * 
 * Only one cell uses the inline editable text component: the Owner cell in the Gamma row.
 * That cell shows "Unassigned" as Typography.Text and reveals a small pencil icon when hovered.
 * 
 * Success: The committed (display) value in the Gamma/Owner cell equals 'M. Rivera' exactly,
 * and the cell is not in editing mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Input, Button, Space, Table, Tag } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface OrderRow {
  key: string;
  order: string;
  owner: string;
  status: string;
  editable: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [gammaOwner, setGammaOwner] = useState('Unassigned');
  const [editingValue, setEditingValue] = useState('Unassigned');
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
    if (!isEditing && gammaOwner === 'M. Rivera' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [gammaOwner, isEditing, onSuccess]);

  const handleEdit = () => {
    setEditingValue(gammaOwner);
    setIsEditing(true);
  };

  const handleSave = () => {
    setGammaOwner(editingValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingValue(gammaOwner);
    setIsEditing(false);
  };

  const data: OrderRow[] = [
    { key: 'alpha', order: 'Alpha', owner: 'J. Smith', status: 'Shipped', editable: false },
    { key: 'beta', order: 'Beta', owner: 'K. Johnson', status: 'Processing', editable: false },
    { key: 'gamma', order: 'Gamma', owner: gammaOwner, status: 'Pending', editable: true },
  ];

  const columns: ColumnsType<OrderRow> = [
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 100,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 180,
      render: (owner: string, record: OrderRow) => {
        if (!record.editable) {
          return <Text>{owner}</Text>;
        }
        
        return (
          <div 
            data-testid="editable-cell-gamma-owner"
            data-mode={isEditing ? 'editing' : 'display'}
            data-value={gammaOwner}
          >
            {isEditing ? (
              <Space.Compact size="small" style={{ width: '100%' }}>
                <Input
                  ref={inputRef}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  size="small"
                  style={{ flex: 1 }}
                  data-testid="editable-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={handleSave}
                  data-testid="save-button"
                  aria-label="Save"
                />
                <Button
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  data-testid="cancel-button"
                  aria-label="Cancel"
                />
              </Space.Compact>
            ) : (
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                onClick={handleEdit}
                data-testid="display-text"
              >
                <Text>{owner}</Text>
                <EditOutlined style={{ color: '#1677ff', fontSize: 12 }} />
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const color = status === 'Shipped' ? 'green' : status === 'Processing' ? 'blue' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <Card 
      title="Orders" 
      size="small"
      style={{ width: 420 }} 
      data-testid="orders-card"
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        data-testid="orders-table"
      />
    </Card>
  );
}
