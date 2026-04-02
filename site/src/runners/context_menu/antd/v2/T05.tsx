'use client';

/**
 * context_menu-antd-v2-T05: API key C9D1 — Revoke key… then Cancel (dark drawer)
 */

import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Dropdown, Button, Space } from 'antd';
import type { TaskComponentProps } from '../../types';

const KEYS = ['API key A1B2', 'API key B7E4', 'API key C9D1', 'API key D3K8'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [c9RevokeCancelled, setC9RevokeCancelled] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (c9RevokeCancelled) {
      successFired.current = true;
      onSuccess();
    }
  }, [c9RevokeCancelled, onSuccess]);

  const rowOverlay = (label: string) => (
    <div
      style={{
        background: '#1f1f1f',
        borderRadius: 8,
        boxShadow: '0 6px 16px rgba(0,0,0,0.45)',
        minWidth: 180,
        padding: 4,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ padding: '8px 12px', color: '#fff', cursor: 'pointer' }}>Copy key ID</div>
      <div style={{ padding: '8px 12px', color: '#fff', cursor: 'pointer' }}>Rename</div>
      <div
        style={{ padding: '8px 12px', color: '#ff7875', cursor: 'pointer' }}
        onClick={() => setShowConfirm(true)}
        data-testid="revoke-item"
      >
        Revoke key…
      </div>
      {showConfirm && activeRow === label && (
        <div style={{ borderTop: '1px solid #303030', padding: 12 }} data-testid="confirm-footer">
          <div style={{ fontSize: 12, color: '#fff', marginBottom: 8 }}>Revoke this key?</div>
          <Space>
            <Button
              size="small"
              onClick={() => {
                if (label === 'API key C9D1') setC9RevokeCancelled(true);
                setShowConfirm(false);
                setMenuOpen(false);
              }}
              data-testid="cancel-revoke"
            >
              Cancel
            </Button>
            <Button size="small" danger type="primary">
              Revoke
            </Button>
          </Space>
        </div>
      )}
    </div>
  );

  return (
    <Drawer
      title="Service tokens"
      placement="left"
      open
      closable={false}
      onClose={() => {}}
      width={320}
      mask={false}
      getContainer={false}
      styles={{
        header: { background: '#141414', color: '#fff', borderColor: '#303030' },
        body: { background: '#141414', color: '#fff' },
      }}
    >
      <div style={{ fontSize: 11 }}>
        {KEYS.map((k) => (
          <Dropdown
            key={k}
            open={menuOpen && activeRow === k}
            onOpenChange={(o) => {
              setMenuOpen(o);
              if (o) {
                setActiveRow(k);
                setShowConfirm(false);
              } else if (activeRow === k) {
                setActiveRow(null);
                setShowConfirm(false);
              }
            }}
            dropdownRender={() => rowOverlay(k)}
            trigger={['contextMenu']}
          >
            <div
              style={{
                padding: '10px 8px',
                borderBottom: '1px solid #303030',
                cursor: 'context-menu',
              }}
              data-instance-label={k}
              data-testid={`token-row-${k.replace(/\s/g, '-').toLowerCase()}`}
            >
              {k}
            </div>
          </Dropdown>
        ))}
      </div>
    </Drawer>
  );
}
