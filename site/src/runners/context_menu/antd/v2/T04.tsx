'use client';

/**
 * context_menu-antd-v2-T04: Dashboard preview — Reset layout… → confirm Reset
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Button, Space, Slider, Switch, Tag } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (confirmed) {
      successFired.current = true;
      onSuccess();
    }
  }, [confirmed, onSuccess]);

  const overlay = (
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        minWidth: 200,
        padding: 4,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{ padding: '8px 12px', cursor: 'pointer' }}
        onClick={() => {}}
      >
        Add widget
      </div>
      <div
        style={{ padding: '8px 12px', cursor: 'pointer' }}
        onClick={() => {}}
      >
        Arrange automatically
      </div>
      <div
        style={{ padding: '8px 12px', cursor: 'pointer' }}
        onClick={() => setShowConfirm(true)}
        data-testid="reset-layout-item"
      >
        Reset layout…
      </div>
      {showConfirm && (
        <div
          style={{ borderTop: '1px solid #f0f0f0', padding: 12 }}
          data-testid="confirm-footer"
        >
          <div style={{ fontSize: 12, marginBottom: 8 }}>Reset dashboard layout?</div>
          <Space>
            <Button
              size="small"
              onClick={() => {
                setShowConfirm(false);
                setMenuOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              type="primary"
              danger
              data-testid="confirm-reset"
              onClick={() => {
                setConfirmed(true);
                setShowConfirm(false);
                setMenuOpen(false);
              }}
            >
              Reset
            </Button>
          </Space>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ width: 440, fontSize: 11 }}>
      <Space wrap style={{ marginBottom: 8 }}>
        <Tag>Widgets</Tag>
        <Tag color="blue">Live</Tag>
        <HolderOutlined />
      </Space>
      <div style={{ marginBottom: 6 }}>
        <span style={{ width: 80, display: 'inline-block' }}>Density</span>
        <Slider style={{ width: 200, display: 'inline-block', margin: '0 8px' }} defaultValue={40} />
      </div>
      <div style={{ marginBottom: 6 }}>
        <Switch size="small" defaultChecked /> <span style={{ marginLeft: 8 }}>Show grid</span>
      </div>
      <Dropdown
        open={menuOpen}
        onOpenChange={(o) => {
          setMenuOpen(o);
          if (o) setShowConfirm(false);
          if (!o) setShowConfirm(false);
        }}
        dropdownRender={() => overlay}
        trigger={['contextMenu']}
      >
        <div
          style={{
            height: 140,
            background: 'linear-gradient(135deg,#f0f5ff,#e6f4ff)',
            border: '1px dashed #91caff',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'context-menu',
            fontWeight: 600,
          }}
          data-testid="dashboard-preview"
        >
          Dashboard preview
        </div>
      </Dropdown>
      <div style={{ marginTop: 8, color: '#888' }} data-confirmed={confirmed}>
        {confirmed ? 'Layout reset confirmed' : 'Right-click preview for menu'}
      </div>
    </div>
  );
}
