'use client';

/**
 * tooltip-antd-T03: Toggle tooltip open via click trigger
 *
 * Light theme, comfortable spacing, isolated card centered.
 * A small "Help" label with a question-mark icon button (focusable) sits in the card header.
 * The question-mark icon is wrapped in AntD Tooltip configured for click trigger:
 * - Tooltip title: "Need assistance? Contact support."
 * - Trigger: click (trigger='click') so the tooltip stays open after clicking
 * Initial state: tooltip hidden. No other tooltip instances. Clicking outside closes it, but the task ends as soon as it is open.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Tooltip, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('.ant-tooltip:not(.ant-tooltip-hidden)');
      if (tooltipContent && tooltipContent.textContent?.includes('Need assistance? Contact support.')) {
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
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Help</span>
          <Tooltip title="Need assistance? Contact support." trigger="click">
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<QuestionCircleOutlined />}
              data-testid="tooltip-trigger-help"
            />
          </Tooltip>
        </div>
      }
      style={{ width: 300 }}
    >
      <p>Click the help icon for more information.</p>
    </Card>
  );
}
