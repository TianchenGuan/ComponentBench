'use client';

/**
 * date_picker_range-antd-T06: Navigate the calendar to August 2026
 *
 * Isolated card centered in the viewport with dark theme (dark
 * background, light text). One Ant Design RangePicker labeled 'Plan window' is
 * empty. A small helper badge above the input reads 'Target month: August 2026'
 * (visual reinforcement). Opening the RangePicker shows a popover with two month
 * panels and header navigation arrows. The initial visible months are near the current
 * reference month (February 2026). No dates need to be selected; the goal is purely
 * to navigate the visible month.
 *
 * Success: Calendar popover is open and shows 2026-08 as the left panel month.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, DatePicker, Tag } from 'antd';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const successFiredRef = useRef(false);

  // Poll for month changes while the picker is open
  useEffect(() => {
    if (!isOpen) return;

    const checkMonth = () => {
      if (successFiredRef.current) return;
      
      const headers = Array.from(document.querySelectorAll('.ant-picker-header-view'));
      for (const header of headers) {
        const label = header.textContent || '';
        if (label.includes('Aug') && label.includes('2026')) {
          successFiredRef.current = true;
          onSuccess();
          return;
        }
      }
    };

    checkMonth();
    const interval = setInterval(checkMonth, 200);

    return () => clearInterval(interval);
  }, [isOpen, onSuccess]);

  return (
    <Card title="Plan window" style={{ width: 500 }}>
      <div style={{ marginBottom: 16 }}>
        <Tag color="blue" data-testid="target-month-badge">Target month: August 2026</Tag>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="plan-window-range" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Plan window
        </label>
        <RangePicker
          id="plan-window-range"
          placeholder={['Start date', 'End date']}
          style={{ width: '100%' }}
          data-testid="plan-window-range"
          open={isOpen}
          onOpenChange={(open) => setIsOpen(open)}
        />
      </div>
    </Card>
  );
}
