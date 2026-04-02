'use client';

/**
 * dialog_modal-antd-T09: Drag a draggable modal to a target corner
 *
 * Layout: isolated_card centered. The page loads with a draggable Ant Design Modal open.
 *
 * Modal configuration:
 * - Title: "Notes"
 * - Body: short static text; no form fields
 * - Footer: hidden
 * - The modal is DRAGGABLE by its header area (title bar).
 *
 * Initial state: modal is open and centered.
 * Target: the modal should end up in the top-right region of the viewport.
 * Success: The 'Notes' modal remains open and positioned near top-right corner.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text } = Typography;

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const successCalledRef = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Notes',
      position: { x: 0, y: 0 },
    };
  }, []);

  const checkPosition = useCallback(() => {
    if (!modalRef.current || successCalledRef.current) return;
    
    const modal = modalRef.current.closest('.ant-modal') as HTMLElement;
    if (!modal) return;

    const rect = modal.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Target: top-right corner with margin
    const targetX = viewportWidth - 24;
    const targetY = 24;
    const toleranceX = 100;
    const toleranceY = 100;
    
    const modalRight = rect.right;
    const modalTop = rect.top;
    
    // Check if modal is near top-right
    const isNearTopRight = 
      Math.abs(modalRight - targetX) <= toleranceX &&
      Math.abs(modalTop - targetY) <= toleranceY;

    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Notes',
      position: { x: rect.left, y: rect.top },
    };

    if (isNearTopRight && !successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  }, [onSuccess]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag on the title bar
    const target = e.target as HTMLElement;
    if (!target.closest('.ant-modal-header')) return;
    
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    setPosition({
      x: dragRef.current.initialX + dx,
      y: dragRef.current.initialY + dy,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      checkPosition();
    }
  }, [isDragging, checkPosition]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <>
      <Card title="Workspace" style={{ width: 400 }}>
        <Paragraph>
          Your notes are displayed in a draggable modal. Move it to the top-right corner.
        </Paragraph>
      </Card>

      <Modal
        title={
          <div 
            style={{ cursor: 'move', userSelect: 'none' }}
            onMouseDown={handleMouseDown}
          >
            Notes
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        mask={false}
        maskClosable={false}
        style={{ 
          position: 'absolute',
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        modalRender={(modal) => (
          <div ref={modalRef}>
            {modal}
          </div>
        )}
        data-testid="modal-notes"
      >
        <Paragraph>
          This is your notes modal. Drag it by the header to reposition it.
        </Paragraph>
        <Text type="secondary">Drag by the header</Text>
      </Modal>
    </>
  );
}
