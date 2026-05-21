'use client';

/**
 * tooltip-antd-T06: Show a delayed tooltip in compact settings
 *
 * Light theme, COMPACT spacing, settings_panel layout centered.
 * The panel shows several setting rows (read-only text + a small info icon). Only one row has a tooltip.
 * Target row: "Data retention" with a small circular info icon on the right.
 * The icon is wrapped in AntD Tooltip with:
 * - Tooltip title: "Logs are kept for 30 days."
 * - mouseEnterDelay: 0.8s (tooltip appears after a noticeable delay while hovering)
 * - Trigger: hover
 * Scale: small (icons and row height are reduced). Initial state: tooltip hidden. Other rows are distractors but do not have tooltips.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Tooltip, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('.ant-tooltip:not(.ant-tooltip-hidden)');
      if (tooltipContent && tooltipContent.textContent?.includes('Logs are kept for 30 days.')) {
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

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    fontSize: 13,
    borderBottom: '1px solid #f0f0f0',
  };

  return (
    <Card title="Settings" style={{ width: 320 }} size="small">
      <div style={rowStyle}>
        <span>Time zone</span>
        <span style={{ color: '#666' }}>UTC-5</span>
      </div>
      <div style={rowStyle}>
        <span>Language</span>
        <span style={{ color: '#666' }}>English</span>
      </div>
      <div style={rowStyle}>
        <span>Data retention</span>
        <Tooltip title="Logs are kept for 30 days." mouseEnterDelay={0.8}>
          <Button
            type="text"
            size="small"
            icon={<InfoCircleOutlined style={{ fontSize: 14 }} />}
            style={{ padding: 2, height: 'auto', minWidth: 'auto' }}
            data-testid="tooltip-trigger-data-retention"
          />
        </Tooltip>
      </div>
      <div style={rowStyle}>
        <span>Backup frequency</span>
        <span style={{ color: '#666' }}>Daily</span>
      </div>
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <span>Storage location</span>
        <span style={{ color: '#666' }}>US East</span>
      </div>
    </Card>
  );
}
