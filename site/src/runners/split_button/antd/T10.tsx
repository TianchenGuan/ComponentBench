'use client';

/**
 * split_button-antd-T10: Table row: delete permanently via split-button menu with confirm
 *
 * Layout: table_cell scene showing a small data table with a highlighted row "Row 12".
 * The split button appears inside the last column of Row 12 and is labeled "Row 12 actions".
 *
 * Dropdown content (scroll required): ~18 actions, including "Delete permanently…" near bottom.
 * Inline confirmation: After clicking "Delete permanently…", a confirmation panel shows.
 *
 * Success: lastInvokedAction = "delete_permanently" after clicking Confirm
 */

import React, { useState } from 'react';
import { Card, Dropdown, Button, Table, Input, Checkbox } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const allMenuItems = [
  { key: 'view', label: 'View details' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'move', label: 'Move to folder…' },
  { key: 'export', label: 'Export' },
  { key: 'archive', label: 'Archive' },
  { key: 'disable', label: 'Disable' },
  { key: 'rename', label: 'Rename…' },
  { key: 'copy', label: 'Copy' },
  { key: 'share', label: 'Share…' },
  { key: 'download', label: 'Download' },
  { key: 'print', label: 'Print' },
  { key: 'refresh', label: 'Refresh' },
  { key: 'restore', label: 'Restore' },
  { key: 'permissions', label: 'Permissions…' },
  { key: 'history', label: 'View history' },
  { key: 'tags', label: 'Edit tags…' },
  { key: 'delete_permanently', label: 'Delete permanently…', danger: true },
  { key: 'destroy', label: 'Destroy' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [lastInvokedAction, setLastInvokedAction] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const handleItemClick = (key: string) => {
    if (key === 'delete_permanently') {
      setShowConfirm(true);
    } else {
      setMenuOpen(false);
    }
  };

  const handleConfirm = () => {
    setLastInvokedAction('delete_permanently');
    setShowConfirm(false);
    setMenuOpen(false);
    if (!hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setMenuOpen(false);
  };

  const dropdownRender = () => (
    <div style={{ 
      background: '#fff', 
      borderRadius: 8, 
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
      width: 200
    }}>
      {showConfirm ? (
        <div style={{ padding: 16 }} data-testid="inline-confirm">
          <div style={{ marginBottom: 12, fontWeight: 500 }}>Delete permanently?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              size="small" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              size="small" 
              danger 
              type="primary"
              onClick={handleConfirm}
              data-testid="confirm-btn"
            >
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ maxHeight: 240, overflowY: 'auto', padding: 4 }}>
          {allMenuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => handleItemClick(item.key)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: 4,
                color: item.danger ? '#ff4d4f' : '#333',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Table data
  const columns = [
    {
      title: <Checkbox disabled />,
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 40,
      render: () => <Checkbox disabled />,
    },
    { title: 'Row', dataIndex: 'row', key: 'row' },
    { title: 'Data', dataIndex: 'data', key: 'data' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: { key: string; row: string }) => {
        if (record.row === 'Row 12') {
          return (
            <div
              data-testid="split-button-root"
              data-last-invoked-action={lastInvokedAction}
              aria-label="Row 12 actions"
            >
              <Dropdown
                open={menuOpen}
                onOpenChange={setMenuOpen}
                dropdownRender={dropdownRender}
                trigger={['click']}
              >
                <Button.Group size="small">
                  <Button>Actions</Button>
                  <Button icon={<DownOutlined />} />
                </Button.Group>
              </Dropdown>
              {lastInvokedAction && (
                <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                  Last action: Delete permanently
                </div>
              )}
            </div>
          );
        }
        return <span style={{ color: '#999' }}>—</span>;
      },
    },
  ];

  const data = Array.from({ length: 15 }, (_, i) => ({
    key: String(i + 1),
    row: `Row ${i + 1}`,
    data: `Data item ${i + 1}`,
    status: i === 11 ? 'Highlighted' : 'Normal',
  }));

  return (
    <Card 
      title="Data table"
      style={{ width: 600 }}
    >
      {/* Header with disabled filter chips and search */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <Input 
          placeholder="Search..." 
          prefix={<SearchOutlined />} 
          style={{ width: 200 }} 
          disabled 
        />
        <span style={{ 
          padding: '2px 8px', 
          background: '#f0f0f0', 
          borderRadius: 4, 
          fontSize: 11,
          color: '#999'
        }}>
          All statuses
        </span>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        size="small"
        pagination={false}
        scroll={{ y: 300 }}
        rowClassName={(record) => record.row === 'Row 12' ? 'ant-table-row-selected' : ''}
      />
    </Card>
  );
}
