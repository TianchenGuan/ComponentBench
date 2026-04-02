'use client';

/**
 * dialog_modal-antd-v2-T15: Visual match → Palette draggable → top-right
 *
 * Uses a simple draggable div for the Palette panel instead of Modal + modalRender,
 * because modalRender's portal positioning makes getBoundingClientRect unreliable.
 */

import React, { useCallback, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Button, Card, Flex, Modal, Space, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

export default function T15({ onSuccess }: TaskComponentProps) {
  const [logs, setLogs] = useState(false);
  const [palette, setPalette] = useState(false);
  const [queue, setQueue] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  const openOne = (which: 'logs' | 'palette' | 'queue') => {
    setLogs(which === 'logs');
    setPalette(which === 'palette');
    setQueue(which === 'queue');
    const title = which === 'logs' ? 'Logs' : which === 'palette' ? 'Palette' : 'Queue';
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: title,
      last_opened_instance: title,
    };
  };

  const pushState = useCallback(() => {
    const rect = nodeRef.current?.getBoundingClientRect() ?? null;
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Palette',
      last_opened_instance: 'Palette',
      last_drag_source: 'title_bar',
      position: rect ? { x: rect.left, y: rect.top } : null,
      modal_bounds: rect
        ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
        : undefined,
    };
  }, []);

  const onDragStop = (_e: DraggableEvent, _data: DraggableData) => {
    if (!palette) return;
    pushState();
    if (!nodeRef.current || successCalledRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const rightGap = window.innerWidth - rect.right;
    const topGap = rect.top;
    if (rightGap < 100 && topGap < 250) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space align="center">
          <div
            style={{
              width: 28,
              height: 20,
              borderRadius: 4,
              backgroundColor: '#722ed1',
            }}
          />
          <Text strong>Target floating panel</Text>
          <Tag color="purple">purple accent</Tag>
        </Space>
      </Card>
      <Flex wrap="wrap" gap={6} style={{ marginBottom: 10 }}>
        <Tag>Build</Tag>
        <Tag>Runtime</Tag>
      </Flex>
      <Flex gap={12} wrap>
        <Card size="small" title="Panel A" style={{ minWidth: 160 }}>
          <Button size="small" onClick={() => openOne('logs')} data-testid="cb-open-logs">
            Open
          </Button>
        </Card>
        <Card size="small" title="Panel B" style={{ minWidth: 160 }}>
          <Button size="small" onClick={() => openOne('palette')} data-testid="cb-open-palette">
            Open
          </Button>
        </Card>
        <Card size="small" title="Panel C" style={{ minWidth: 160 }}>
          <Button size="small" onClick={() => openOne('queue')} data-testid="cb-open-queue">
            Open
          </Button>
        </Card>
      </Flex>

      <Modal
        title="Logs"
        open={logs}
        onCancel={() => setLogs(false)}
        footer={null}
        maskClosable={false}
        data-testid="modal-logs"
      >
        <Paragraph>Log stream tail.</Paragraph>
      </Modal>

      {palette && (
        <Draggable handle=".cb-drag-handle" onStop={onDragStop} nodeRef={nodeRef}>
          <div
            ref={nodeRef}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 280,
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
              zIndex: 1000,
            }}
            data-testid="modal-palette"
          >
            <div
              className="cb-drag-handle"
              style={{
                borderTop: '4px solid #722ed1',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'move',
                userSelect: 'none',
              }}
            >
              <Text strong>Palette</Text>
              <span
                onClick={() => setPalette(false)}
                style={{ cursor: 'pointer', fontSize: 18, color: '#999', lineHeight: 1 }}
              >
                ×
              </span>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <Paragraph>Color tokens for this workspace.</Paragraph>
            </div>
          </div>
        </Draggable>
      )}

      <Modal
        title="Queue"
        open={queue}
        onCancel={() => setQueue(false)}
        footer={null}
        maskClosable={false}
        data-testid="modal-queue"
      >
        <Paragraph>Job queue depth.</Paragraph>
      </Modal>
    </div>
  );
}
