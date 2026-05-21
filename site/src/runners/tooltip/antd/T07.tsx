'use client';

/**
 * tooltip-antd-T07: Match a tooltip to a visual reference
 *
 * Light theme, comfortable spacing, isolated card centered.
 * The card contains three icon buttons in a row, each wrapped in an AntD Tooltip (hover trigger):
 * - Import icon → tooltip "Import data from CSV"
 * - Export icon → tooltip "Export current view"
 * - Refresh icon → tooltip "Refresh dashboard"
 * On the right side of the card there is a non-interactive "Reference" box that visually shows a tooltip bubble with the target text (the page does NOT print the target text in the instruction itself).
 * Instances: 3 tooltips. Initial state: none visible.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Tooltip, Button } from 'antd';
import { ImportOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('.ant-tooltip:not(.ant-tooltip-hidden)');
      if (tooltipContent && tooltipContent.textContent?.includes('Import data from CSV')) {
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
    <Card style={{ width: 450 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Actions</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Tooltip title="Import data from CSV">
              <Button icon={<ImportOutlined />} data-testid="tooltip-trigger-import" />
            </Tooltip>
            <Tooltip title="Export current view">
              <Button icon={<ExportOutlined />} data-testid="tooltip-trigger-export" />
            </Tooltip>
            <Tooltip title="Refresh dashboard">
              <Button icon={<ReloadOutlined />} data-testid="tooltip-trigger-refresh" />
            </Tooltip>
          </div>
        </div>

        <div
          id="reference-tooltip-1"
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            color: '#fff',
            padding: '6px 8px',
            borderRadius: 6,
            fontSize: 14,
            position: 'relative',
          }}
        >
          <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Reference</div>
          Import data from CSV
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: -4,
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid rgba(0, 0, 0, 0.85)',
            }}
          />
        </div>
      </div>
    </Card>
  );
}
