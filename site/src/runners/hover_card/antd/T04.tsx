'use client';

/**
 * hover_card-antd-T04: Unpin and close a pinned hover card
 *
 * Layout: isolated_card centered, light theme, comfortable spacing.
 *
 * This page is the same project badge panel as the previous scenario, but it starts in a non-default state:
 * - The "Project Alpha" hover card is already visible on page load.
 * - The hover card shows a filled "Pin" icon (indicating pinned=true) and also has a close "×" button in the top-right corner.
 * - The pinned hover card remains visible even if you move the pointer away.
 *
 * Initial state: open=true, pinned=true for "Project Alpha".
 * Distractors: "Project Beta" and "Project Gamma" badges remain inert.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Popover, Tag, Typography, Button } from 'antd';
import { PushpinOutlined, PushpinFilled, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [pinned, setPinned] = useState(true);
  const [open, setOpen] = useState(true);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!open && !pinned && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, pinned, onSuccess]);

  const handlePinClick = () => {
    setPinned(!pinned);
  };

  const handleClose = () => {
    setPinned(false);
    setOpen(false);
  };

  const handleOpenChange = (visible: boolean) => {
    if (!pinned) {
      setOpen(visible);
    }
  };

  const hoverCardContent = (
    <div 
      style={{ width: 250 }} 
      data-testid="hover-card-content"
      data-cb-instance="Project Alpha"
      data-pinned={pinned}
      data-open={open}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text strong>Project Alpha</Text>
        <div style={{ display: 'flex', gap: 4 }}>
          <Button
            type="text"
            size="small"
            icon={pinned ? <PushpinFilled /> : <PushpinOutlined />}
            onClick={handlePinClick}
            data-testid="pin-button"
            aria-label={pinned ? "Unpin" : "Pin"}
          />
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={handleClose}
            data-testid="close-button"
            aria-label="Close"
          />
        </div>
      </div>
      <Text type="secondary">
        A flagship project focused on user experience improvements and performance optimization.
      </Text>
    </div>
  );

  return (
    <Card title="Projects" style={{ width: 400 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Popover 
          content={hoverCardContent}
          trigger="hover"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <Tag
            color="blue"
            data-testid="project-alpha-trigger"
            data-cb-instance="Project Alpha"
            style={{ cursor: 'pointer', padding: '4px 12px', fontSize: 14 }}
          >
            Project Alpha
          </Tag>
        </Popover>
        <Tag
          color="green"
          style={{ padding: '4px 12px', fontSize: 14 }}
        >
          Project Beta
        </Tag>
        <Tag
          color="orange"
          style={{ padding: '4px 12px', fontSize: 14 }}
        >
          Project Gamma
        </Tag>
      </div>
    </Card>
  );
}
