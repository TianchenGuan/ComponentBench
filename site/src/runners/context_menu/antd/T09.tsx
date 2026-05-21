'use client';

/**
 * context_menu-antd-T09: Confirm Delete inside context menu
 *
 * Scene: theme=dark, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: a single file row labeled "Invoice-013.pdf".
 * Right-clicking the row opens a custom context menu.
 *
 * Context menu: AntD Dropdown trigger=['contextMenu'] renders an AntD Menu in a popover overlay.
 * Menu items: Open, Rename, Delete… (ellipsis indicates a confirmation step).
 *
 * Confirmation behavior: clicking "Delete…" does NOT immediately finish the action.
 * Instead, the menu stays open and a confirmation row appears at the bottom of the same overlay
 * with two buttons: "Cancel" and "Delete".
 *
 * Success: The context menu records that the pending action ['Delete'] was confirmed via the 'Delete' confirmation control.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown, Card, Button, Space } from 'antd';
import { FileOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<'confirmed' | 'cancelled' | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (confirmationResult === 'confirmed' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [confirmationResult, successTriggered, onSuccess]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'Delete') {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    setConfirmationResult('confirmed');
    setShowConfirm(false);
    setMenuOpen(false);
  };

  const handleCancel = () => {
    setConfirmationResult('cancelled');
    setShowConfirm(false);
    setMenuOpen(false);
  };

  const menuItems: MenuProps['items'] = [
    { key: 'Open', label: 'Open' },
    { key: 'Rename', label: 'Rename' },
    { key: 'Delete', label: 'Delete…', danger: true },
  ];

  // Custom dropdown content with confirmation
  const menuContent = (
    <div
      style={{
        background: '#1f1f1f',
        borderRadius: 8,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.32)',
        padding: 4,
        minWidth: 160,
      }}
    >
      <div
        style={{ padding: '5px 12px', cursor: 'pointer', borderRadius: 4 }}
        onClick={() => { /* no-op for Open */ }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#303030')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        Open
      </div>
      <div
        style={{ padding: '5px 12px', cursor: 'pointer', borderRadius: 4 }}
        onClick={() => { /* no-op for Rename */ }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#303030')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        Rename
      </div>
      <div
        style={{ padding: '5px 12px', cursor: 'pointer', borderRadius: 4, color: '#ff4d4f' }}
        onClick={() => setShowConfirm(true)}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#303030')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        data-testid="delete-menu-item"
      >
        Delete…
      </div>
      {showConfirm && (
        <div
          style={{
            borderTop: '1px solid #303030',
            marginTop: 4,
            paddingTop: 8,
            padding: '8px 12px',
          }}
          data-testid="confirm-footer"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            <span style={{ fontSize: 12 }}>Delete this file?</span>
          </div>
          <Space>
            <Button size="small" onClick={handleCancel} data-testid="cancel-button">
              Cancel
            </Button>
            <Button size="small" type="primary" danger onClick={handleConfirm} data-testid="confirm-delete-button">
              Delete
            </Button>
          </Space>
        </div>
      )}
    </div>
  );

  return (
    <Card
      title="Files"
      style={{ width: 400, background: '#1f1f1f', borderColor: '#303030' }}
      styles={{
        header: { background: '#1f1f1f', borderColor: '#303030', color: '#fff' },
        body: { background: '#1f1f1f' },
      }}
    >
      <Dropdown
        dropdownRender={() => menuContent}
        trigger={['contextMenu']}
        open={menuOpen}
        onOpenChange={(open) => {
          if (!open && !showConfirm) {
            setMenuOpen(false);
          } else {
            setMenuOpen(open);
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 16,
            background: '#262626',
            border: '1px solid #303030',
            borderRadius: 8,
            cursor: 'context-menu',
            color: '#fff',
          }}
          data-testid="file-row"
          data-confirmation-result={confirmationResult}
        >
          <FileOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
          <div>
            <div style={{ fontWeight: 500 }}>Invoice-013.pdf</div>
            <div style={{ fontSize: 12, color: '#999' }}>2.4 MB • Modified today</div>
          </div>
        </div>
      </Dropdown>
      <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
        Confirmation result: <strong data-testid="confirmation-result">{confirmationResult || 'None'}</strong>
      </div>
    </Card>
  );
}
