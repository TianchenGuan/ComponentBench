'use client';

/**
 * dialog_modal-antd-v2-T18: Toast preview → left + vertical center band
 *
 * Uses a simple draggable div instead of Ant Design Modal + react-draggable,
 * because modalRender's portal positioning makes getBoundingClientRect unreliable.
 */

import React, { useCallback, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Button, Card, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

export default function T18({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  const pushState = useCallback(() => {
    const rect = nodeRef.current?.getBoundingClientRect() ?? null;
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Toast preview',
      last_opened_instance: 'Toast preview',
      last_drag_source: 'title_bar',
      position: rect ? { x: rect.left, y: rect.top } : null,
      modal_bounds: rect
        ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
        : undefined,
    };
  }, []);

  const onDragStop = (_e: DraggableEvent, _data: DraggableData) => {
    pushState();
    if (!nodeRef.current || successCalledRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const midY = window.innerHeight / 2;
    if (rect.left < 100 && Math.abs((rect.top + rect.bottom) / 2 - midY) < midY * 0.7) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <Card size="small" title="Notifications" style={{ maxWidth: 440 }}>
      <div style={{ marginBottom: 8 }}>
        <Tag>Email</Tag> <Tag>Push</Tag>
      </div>
      <Paragraph type="secondary" style={{ fontSize: 12 }}>
        Preview how toasts render in the shell.
      </Paragraph>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          setTimeout(pushState, 0);
        }}
        data-testid="cb-open-toast-preview"
      >
        Open toast preview
      </Button>

      {open && (
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
            data-testid="modal-toast-preview"
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
              <Text strong>Toast preview</Text>
              <span
                onClick={() => setOpen(false)}
                style={{ cursor: 'pointer', fontSize: 18, color: '#999', lineHeight: 1 }}
              >
                ×
              </span>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Move near the left edge at mid viewport height.
              </Text>
            </div>
          </div>
        </Draggable>
      )}
    </Card>
  );
}
