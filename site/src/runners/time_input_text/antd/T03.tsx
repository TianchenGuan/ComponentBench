'use client';

/**
 * time_input_text-antd-T03: Open the time picker panel
 * 
 * Layout: isolated_card centered, dark theme, comfortable spacing.
 * A single AntD TimePicker labeled "Reminder time" is shown.
 * - Configuration: format='HH:mm', needConfirm=true (panel includes a confirm button), allowClear=true.
 * - Initial state: panel closed; input is empty.
 * - Interaction: clicking the input (or the clock icon) opens a popup panel with hour/minute columns.
 * - Clutter=none; no other overlays on the page.
 * 
 * Success: The popup panel for the "Reminder time" TimePicker is open and visible on screen.
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      onSuccess();
    }
  }, [open, onSuccess]);

  const isDark = task.scene_context.theme === 'dark';

  return (
    <Card 
      title="Alerts" 
      style={{ 
        width: 400,
        background: isDark ? '#1f1f1f' : '#fff',
        color: isDark ? '#fff' : '#000',
      }}
      styles={{
        header: {
          background: isDark ? '#1f1f1f' : '#fff',
          color: isDark ? '#fff' : '#000',
          borderBottom: isDark ? '1px solid #333' : '1px solid #f0f0f0',
        },
        body: {
          background: isDark ? '#1f1f1f' : '#fff',
        },
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <label 
          htmlFor="reminder-time" 
          style={{ 
            fontWeight: 500, 
            marginBottom: 8, 
            display: 'block',
            color: isDark ? '#fff' : '#000',
          }}
        >
          Reminder time
        </label>
        <TimePicker
          id="reminder-time"
          value={value}
          onChange={(time) => setValue(time)}
          open={open}
          onOpenChange={setOpen}
          format="HH:mm"
          allowClear
          needConfirm
          style={{ width: '100%' }}
          data-testid="reminder-time"
        />
      </div>
    </Card>
  );
}
