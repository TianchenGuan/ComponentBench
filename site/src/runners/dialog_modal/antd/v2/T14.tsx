'use client';

/**
 * dialog_modal-antd-v2-T14: Inspector → bottom-left band + Save layout
 *
 * Uses a simple draggable div instead of Ant Design Modal + react-draggable,
 * because modalRender's portal positioning makes getBoundingClientRect unreliable.
 */

import React, { useCallback, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Button, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

export default function T14({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  const pushState = useCallback((layoutSaved: boolean) => {
    const rect = nodeRef.current?.getBoundingClientRect() ?? null;
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Inspector',
      last_opened_instance: 'Inspector',
      last_drag_source: 'title_bar',
      layout_saved: layoutSaved,
      position: rect ? { x: rect.left, y: rect.top } : null,
      modal_bounds: rect
        ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
        : undefined,
    };
  }, []);

  const onDragStop = (_e: DraggableEvent, _data: DraggableData) => {
    pushState(false);
  };

  const handleSaveLayout = () => {
    if (!nodeRef.current || successCalledRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    if (rect.left > 100 || window.innerHeight - rect.bottom > 100) return;
    pushState(true);
    successCalledRef.current = true;
    setTimeout(() => onSuccess(), 100);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          setTimeout(() => pushState(false), 0);
        }}
        data-testid="cb-open-inspector"
      >
        Open inspector
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
            data-testid="modal-inspector"
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
              <Text strong>Inspector</Text>
              <span
                onClick={() => setOpen(false)}
                style={{ cursor: 'pointer', fontSize: 18, color: '#999', lineHeight: 1 }}
              >
                ×
              </span>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <Paragraph style={{ marginBottom: 0 }}>
                Drag near the bottom-left corner, then save.
              </Paragraph>
            </div>
            <div style={{ padding: '8px 16px 12px', borderTop: '1px solid #f0f0f0', textAlign: 'right' }}>
              <Button
                type="primary"
                onClick={handleSaveLayout}
                data-testid="cb-save-layout"
              >
                Save layout
              </Button>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
}
