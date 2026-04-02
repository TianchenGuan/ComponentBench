'use client';

/**
 * dialog_modal-antd-v2-T16: Nested draggable child Palette → top-right gutter
 *
 * Uses a simple draggable div for the child Palette panel instead of Modal + modalRender,
 * because modalRender's portal positioning makes getBoundingClientRect unreliable.
 */

import React, { useCallback, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Button, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

export default function T16({ onSuccess }: TaskComponentProps) {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  const pushState = useCallback(() => {
    const rect = nodeRef.current?.getBoundingClientRect() ?? null;
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Palette',
      last_opened_instance: 'Palette',
      last_drag_source: 'title_bar',
      related_instances: { 'Layout settings': { open: parentOpen } },
      position: rect ? { x: rect.left, y: rect.top } : null,
      modal_bounds: rect
        ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
        : undefined,
    };
  }, [parentOpen]);

  const onDragStop = (_e: DraggableEvent, _data: DraggableData) => {
    pushState();
    if (!nodeRef.current || successCalledRef.current || !parentOpen) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const rightGap = window.innerWidth - rect.right;
    const topGap = rect.top;
    if (rightGap < 100 && topGap < 250) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setParentOpen(true);
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: null,
            modal_instance: 'Layout settings',
            last_opened_instance: 'Layout settings',
            related_instances: { 'Layout settings': { open: true } },
          };
        }}
        data-testid="cb-open-layout-settings-t16"
      >
        Open layout settings
      </Button>
      <Modal
        title="Layout settings"
        open={parentOpen}
        onCancel={() => {
          setParentOpen(false);
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'cancel',
            modal_instance: 'Layout settings',
            last_opened_instance: 'Layout settings',
            related_instances: { 'Layout settings': { open: false } },
          };
        }}
        zIndex={1000}
        footer={null}
        maskClosable={!childOpen}
        keyboard={!childOpen}
        data-testid="modal-layout-settings-t16"
      >
        <Paragraph>Theme tokens.</Paragraph>
        <Button
          onClick={() => {
            setChildOpen(true);
            setTimeout(pushState, 0);
          }}
          data-testid="cb-open-palette-child"
        >
          Open palette
        </Button>
      </Modal>

      {childOpen && (
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
              zIndex: 1100,
            }}
            data-testid="modal-palette-nested"
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
              <Text strong>Palette</Text>
              <span
                onClick={() => setChildOpen(false)}
                style={{ cursor: 'pointer', fontSize: 18, color: '#999', lineHeight: 1 }}
              >
                ×
              </span>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <Paragraph style={{ marginBottom: 0 }}>Drag this child toward the top-right gutter.</Paragraph>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
}
