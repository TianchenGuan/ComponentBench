'use client';

/**
 * date_picker_single-antd-T08: Select an enabled weekday with weekends disabled
 *
 * Scene: A settings panel layout (settings_panel) with a left-hand label column and right-hand controls.
 * Theme is light, spacing is comfortable, scale is default.
 * The panel includes several unrelated toggles and dropdowns (clutter=medium).
 *
 * Target component: One Ant Design DatePicker labeled "Follow-up date".
 * - Initial state: empty.
 * - Constraint: Weekends (Saturday and Sunday) are disabled via `disabledDate` and appear greyed out and non-clickable.
 * - The current month shown on open is January 2026.
 *
 * Distractors: Other controls include: "Priority" select, "Auto-close after (days)" numeric input, and a toggle "Email notifications". None affect success.
 *
 * Feedback: Clicking a disabled day has no effect; clicking an enabled day sets the value and closes the popover.
 *
 * Success: Date picker must have selected date = 2026-01-15.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Select, InputNumber, Switch, Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [followUpDate, setFollowUpDate] = useState<Dayjs | null>(null);
  const [priority, setPriority] = useState('medium');
  const [autoClose, setAutoClose] = useState(7);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    if (followUpDate && followUpDate.format('YYYY-MM-DD') === '2026-01-15') {
      onSuccess();
    }
  }, [followUpDate, onSuccess]);

  // Disable weekends (Saturday = 6, Sunday = 0)
  const disabledDate = (current: Dayjs) => {
    const day = current.day();
    return day === 0 || day === 6;
  };

  return (
    <Card title="Support ticket settings" style={{ width: 450 }}>
      <Form layout="horizontal" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="Priority">
          <Select
            value={priority}
            onChange={(val) => setPriority(val)}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            data-testid="priority-select"
          />
        </Form.Item>
        
        <Form.Item label="Auto-close after (days)">
          <InputNumber
            value={autoClose}
            onChange={(val) => setAutoClose(val ?? 7)}
            min={1}
            max={30}
            data-testid="auto-close-days"
          />
        </Form.Item>
        
        <Form.Item label="Follow-up date">
          <DatePicker
            value={followUpDate}
            onChange={(date) => setFollowUpDate(date)}
            format="YYYY-MM-DD"
            placeholder="Select date"
            style={{ width: '100%' }}
            data-testid="follow-up-date"
            disabledDate={disabledDate}
            defaultPickerValue={dayjs('2026-01-01')}
          />
        </Form.Item>
        
        <Form.Item label="Email notifications">
          <Switch
            checked={emailNotifications}
            onChange={(checked) => setEmailNotifications(checked)}
            data-testid="email-notifications"
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
