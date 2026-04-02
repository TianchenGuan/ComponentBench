'use client';

/**
 * hover_card-antd-T03: Pin a project hover card open
 *
 * Layout: isolated_card centered, light theme, comfortable spacing.
 *
 * The card shows three project badges: "Project Alpha", "Project Beta", and "Project Gamma".
 * - Only "Project Alpha" has an attached hover card; the other badges are inert distractors.
 * - Hovering "Project Alpha" opens an overlay card (AntD Popover) that contains a header with the project name and a small "Pin" icon button on the right.
 * - Clicking "Pin" toggles a pinned state:
 *   when pinned, the hover card remains open even if the pointer leaves the badge/overlay.
 * - The hover card body contains a short description and is otherwise static.
 *
 * Initial state: hover card is closed and unpinned.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Popover, Tag, Typography, Button } from 'antd';
import { PushpinOutlined, PushpinFilled } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && pinned && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, pinned, onSuccess]);

  const handlePinClick = () => {
    setPinned(true);
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
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text strong>Project Alpha</Text>
        <Button
          type="text"
          size="small"
          icon={pinned ? <PushpinFilled /> : <PushpinOutlined />}
          onClick={handlePinClick}
          data-testid="pin-button"
          aria-label="Pin"
        />
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
