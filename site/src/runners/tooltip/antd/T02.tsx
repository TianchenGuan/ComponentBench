'use client';

/**
 * tooltip-antd-T02: Show tooltip via keyboard focus (focus trigger)
 *
 * Light theme, comfortable spacing, isolated card centered.
 * The card shows a small label "Keyboard shortcut" with a circular info icon to its right (the icon is a focusable button).
 * The icon is wrapped in AntD Tooltip configured for keyboard accessibility:
 * - Tooltip title: "Press Ctrl+K to search"
 * - Trigger: focus only (trigger='focus')
 * Initial state: tooltip hidden. No other tooltips on the page. The icon is small compared to a full button.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Tooltip, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('.ant-tooltip:not(.ant-tooltip-hidden)');
      if (tooltipContent && tooltipContent.textContent?.includes('Press Ctrl+K to search')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTooltip);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  return (
    <Card style={{ width: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Keyboard shortcut</span>
        <Tooltip title="Press Ctrl+K to search" trigger="focus">
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<InfoCircleOutlined />}
            data-testid="tooltip-trigger-keyboard"
          />
        </Tooltip>
      </div>
    </Card>
  );
}
