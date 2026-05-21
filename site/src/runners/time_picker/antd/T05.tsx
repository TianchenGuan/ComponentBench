'use client';

/**
 * time_picker-antd-T05: Set quiet hours start to 22:00 (confirm required)
 *
 * A single isolated card is centered, but the page is rendered in a dark theme (dark background and inverted
 * text). The card contains one Ant Design TimePicker labeled "Quiet hours start", using HH:mm (24-hour) format. The dropdown
 * opens on click and shows scroll columns for hours and minutes. This instance is configured with needConfirm=true, so selecting
 * hour/minute does not finalize the value until the user clicks the "OK" button in the panel. The panel also contains a
 * "Now" shortcut (not needed for this task). No other controls are present.
 *
 * Scene: theme=dark
 *
 * Success: The TimePicker labeled "Quiet hours start" has canonical time value exactly 22:00 (HH:mm, 24-hour).
 *          Because needConfirm is enabled, the value must be committed via the panel's "OK" control.
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker, ConfigProvider, theme } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('HH:mm') === '22:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Card title="Quiet Hours" style={{ width: 400 }}>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="tp-quiet" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Quiet hours start
          </label>
          <TimePicker
            id="tp-quiet"
            value={value}
            onChange={(time) => setValue(time)}
            format="HH:mm"
            placeholder="Select a time"
            needConfirm={true}
            style={{ width: '100%' }}
            data-testid="tp-quiet"
          />
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
            (Choose 22:00 and confirm with OK)
          </div>
        </div>
      </Card>
    </ConfigProvider>
  );
}
