'use client';

/**
 * dialog_modal-antd-v2-T17: Gateway row floating preview → bottom-right + Pin here
 *
 * Uses a simple draggable div for the Gateway panel instead of Modal + modalRender,
 * because modalRender's portal positioning makes getBoundingClientRect unreliable.
 */

import React, { useCallback, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Button, Modal, Table, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

export default function T17({ onSuccess }: TaskComponentProps) {
  const [gw, setGw] = useState(false);
  const [bill, setBill] = useState(false);
  const [search, setSearch] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  const open = (row: 'gw' | 'bill' | 'search') => {
    setGw(row === 'gw');
    setBill(row === 'bill');
    setSearch(row === 'search');
    const title =
      row === 'gw' ? 'Gateway preview' : row === 'bill' ? 'Billing preview' : 'Search preview';
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: title,
      last_opened_instance: title,
    };
  };

  const pushState = useCallback((saved: boolean) => {
    const rect = nodeRef.current?.getBoundingClientRect() ?? null;
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Gateway preview',
      last_opened_instance: 'Gateway preview',
      last_drag_source: 'title_bar',
      layout_saved: saved,
      position: rect ? { x: rect.left, y: rect.top } : null,
      modal_bounds: rect
        ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
        : undefined,
    };
  }, []);

  const onDragStop = (_e: DraggableEvent, _data: DraggableData) => {
    if (!gw) return;
    pushState(false);
  };

  const handlePinHere = () => {
    if (!nodeRef.current || successCalledRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const rightGap = window.innerWidth - rect.right;
    const bottomGap = window.innerHeight - rect.bottom;
    if (rightGap > 100 || bottomGap > 100) return;
    pushState(true);
    successCalledRef.current = true;
    setTimeout(() => onSuccess(), 100);
  };

  const columns = [
    { title: 'Service', dataIndex: 'name', key: 'name', width: 90 },
    {
      title: '',
      key: 'a',
      render: (_: unknown, r: { key: string }) => (
        <Button
          size="small"
          type="link"
          onClick={() => open(r.key as 'gw' | 'bill' | 'search')}
          data-testid={`cb-floating-${r.key}`}
        >
          Open floating preview
        </Button>
      ),
    },
  ];

  const dataSource = [
    { key: 'gw', name: 'Gateway' },
    { key: 'bill', name: 'Billing' },
    { key: 'search', name: 'Search' },
  ];

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ marginBottom: 8 }}>
        <Tag>Shard</Tag> <Tag color="blue">Live</Tag> <Tag>Errors 0</Tag>
      </div>
      <Table size="small" pagination={false} dataSource={dataSource} columns={columns} bordered />

      {gw && (
        <Draggable handle=".cb-drag-handle" onStop={onDragStop} nodeRef={nodeRef}>
          <div
            ref={nodeRef}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
              zIndex: 1000,
            }}
            data-testid="modal-gateway-floating"
          >
            <div
              className="cb-drag-handle"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'move',
                userSelect: 'none',
              }}
            >
              <Text strong>Gateway preview</Text>
              <span
                onClick={() => setGw(false)}
                style={{ cursor: 'pointer', fontSize: 18, color: '#999', lineHeight: 1 }}
              >
                ×
              </span>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <Paragraph style={{ marginBottom: 0 }}>Gateway edge status snapshot.</Paragraph>
            </div>
            <div style={{ padding: '8px 16px 12px', borderTop: '1px solid #f0f0f0', textAlign: 'right' }}>
              <Button
                type="primary"
                size="small"
                onClick={handlePinHere}
                data-testid="cb-pin-here"
              >
                Pin here
              </Button>
            </div>
          </div>
        </Draggable>
      )}

      <Modal
        title="Billing preview"
        open={bill}
        onCancel={() => setBill(false)}
        footer={null}
        data-testid="modal-billing-floating"
      >
        <Paragraph>Billing queue.</Paragraph>
      </Modal>
      <Modal
        title="Search preview"
        open={search}
        onCancel={() => setSearch(false)}
        footer={null}
        data-testid="modal-search-floating"
      >
        <Paragraph>Search replicas.</Paragraph>
      </Modal>
    </div>
  );
}
