'use client';

/**
 * dialog_modal-antd-v2-T13: Draggable Notes → top-right band
 *
 * Uses a simple draggable div instead of Ant Design Modal + react-draggable,
 * because modalRender's portal positioning makes getBoundingClientRect unreliable.
 */

import React, { useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Button, Card, Flex, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

export default function T13({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const successRef = useRef(false);

  const onDragStop = (_e: DraggableEvent, _data: DraggableData) => {
    if (successRef.current || !nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const rightGap = window.innerWidth - rect.right;
    const topGap = rect.top;
    if (rightGap < 100 && topGap < 250) {
      successRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 500 }}>
      <Card size="small" title="Notes" style={{ maxWidth: 520 }}>
        <Flex wrap="wrap" gap={6} style={{ marginBottom: 10 }}>
          <Tag>Sync</Tag>
          <Tag color="blue">Drafts 2</Tag>
          <Tag>Shared</Tag>
        </Flex>
        <Paragraph type="secondary" style={{ fontSize: 12 }}>
          Floating note panel for quick edits.
        </Paragraph>
        <Button type="primary" onClick={() => setOpen(true)} data-testid="cb-open-floating-note">
          Open floating note
        </Button>
      </Card>

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
              <Text strong>Notes</Text>
              <span
                onClick={() => setOpen(false)}
                style={{ cursor: 'pointer', fontSize: 18, color: '#999', lineHeight: 1 }}
              >
                ×
              </span>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <Paragraph style={{ marginBottom: 4 }}>Drag this dialog by the title bar only.</Paragraph>
              <Text type="secondary" style={{ fontSize: 12 }}>Body is not a drag handle.</Text>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
}
