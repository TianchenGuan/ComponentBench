'use client';

/**
 * tooltip-antd-T10: Disambiguate tooltips on KPI cards in a dense dashboard
 *
 * Light theme, comfortable spacing, dashboard layout centered in the viewport.
 * The dashboard contains multiple widgets: a date range selector, two KPI cards, and a small chart (all non-functional clutter).
 * There are TWO AntD Tooltip instances, one on each KPI card title:
 * - Card: "Net Revenue" → info icon tooltip "Revenue after refunds, net of fees." (TARGET)
 * - Card: "Active Users" → info icon tooltip "Unique users active in the selected period."
 * Clutter: high (many UI elements on screen). Initial state: no tooltip visible. The KPI cards are visually similar, increasing disambiguation.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Tooltip, Button, DatePicker, Statistic, Progress } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('.ant-tooltip:not(.ant-tooltip-hidden)');
      if (tooltipContent && tooltipContent.textContent?.includes('Revenue after refunds, net of fees.')) {
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
    <div style={{ width: 600 }}>
      {/* Date range selector */}
      <div style={{ marginBottom: 16 }}>
        <RangePicker style={{ width: '100%' }} />
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontWeight: 500 }}>Net Revenue</span>
            <Tooltip title="Revenue after refunds, net of fees.">
              <InfoCircleOutlined
                style={{ color: '#999', cursor: 'pointer' }}
                data-testid="tooltip-trigger-net-revenue"
              />
            </Tooltip>
          </div>
          <Statistic value={45231} prefix="$" />
        </Card>

        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontWeight: 500 }}>Active Users</span>
            <Tooltip title="Unique users active in the selected period.">
              <InfoCircleOutlined
                style={{ color: '#999', cursor: 'pointer' }}
                data-testid="tooltip-trigger-active-users"
              />
            </Tooltip>
          </div>
          <Statistic value={2847} />
        </Card>
      </div>

      {/* Chart placeholder */}
      <Card title="Trend" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
          {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                background: '#1677ff',
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      </Card>

      {/* Progress indicator */}
      <Card size="small">
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Monthly goal progress</div>
        <Progress percent={68} />
      </Card>
    </div>
  );
}
