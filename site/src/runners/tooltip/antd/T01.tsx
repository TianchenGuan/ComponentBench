'use client';

/**
 * tooltip-antd-T01: Show tooltip on Save button (hover)
 *
 * Light theme, comfortable spacing, isolated card centered in the viewport.
 * The card contains a single primary Ant Design button labeled "Save". The button is wrapped in an AntD Tooltip.
 * - Tooltip title: "Save changes"
 * - Trigger: default (hover; focus may also work depending on browser focus behavior)
 * - Arrow: default
 * Initial state: tooltip is not visible. There are no other tooltip instances or interactive distractors.
 */

import React, { useEffect, useRef } from 'react';
import { Button, Card, Tooltip } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    // Check for tooltip visibility
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('.ant-tooltip:not(.ant-tooltip-hidden)');
      if (tooltipContent && tooltipContent.textContent?.includes('Save changes')) {
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
    <Card title="Actions" style={{ width: 300 }}>
      <Tooltip title="Save changes">
        <Button
          type="primary"
          data-testid="tooltip-trigger-save"
        >
          Save
        </Button>
      </Tooltip>
    </Card>
  );
}
