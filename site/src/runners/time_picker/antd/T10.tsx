'use client';

/**
 * time_picker-antd-T10: Set log time to 13:07:30 (seconds) in a modal
 *
 * The page contains a primary button labeled "Edit log settings". Clicking it opens a modal dialog titled
 * "Log Settings". Inside the modal are a few non-target settings (e.g., a text input "Log label" and a select "Log level")
 * creating low clutter. The target is an Ant Design TimePicker labeled "Log time", configured with format HH:mm:ss (hours,
 * minutes, and seconds columns visible) and secondStep=1. The picker is configured with needConfirm=true, so after selecting
 * hour/minute/second the user must click the "OK" button inside the TimePicker panel to commit the value. The initial value
 * is 13:00:00. This task involves layered overlays: a modal plus the TimePicker dropdown panel.
 *
 * Scene: layout=modal_flow, clutter=low
 *
 * Success: The TimePicker labeled "Log time" (inside the "Log Settings" modal) has canonical time value exactly 13:07:30 (HH:mm:ss).
 *          The value must be committed via the TimePicker panel's "OK" control (needConfirm enabled).
 */

import React, { useState, useEffect } from 'react';
import { Button, Modal, TimePicker, Input, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logTime, setLogTime] = useState<Dayjs | null>(dayjs('13:00:00', 'HH:mm:ss'));

  useEffect(() => {
    if (logTime && logTime.format('HH:mm:ss') === '13:07:30') {
      onSuccess();
    }
  }, [logTime, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Edit log settings
      </Button>

      <Modal
        title="Log Settings"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={400}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* Clutter fields */}
          <div>
            <label htmlFor="log-label" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              Log label
            </label>
            <Input id="log-label" placeholder="Enter label" defaultValue="system" />
          </div>

          <div>
            <label htmlFor="log-level" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              Log level
            </label>
            <Select
              id="log-level"
              defaultValue="info"
              style={{ width: '100%' }}
              options={[
                { value: 'debug', label: 'Debug' },
                { value: 'info', label: 'Info' },
                { value: 'warn', label: 'Warning' },
                { value: 'error', label: 'Error' },
              ]}
            />
          </div>

          {/* Target field */}
          <div>
            <label htmlFor="tp-log" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              Log time
            </label>
            <TimePicker
              id="tp-log"
              value={logTime}
              onChange={(time) => setLogTime(time)}
              format="HH:mm:ss"
              needConfirm={true}
              style={{ width: '100%' }}
              data-testid="tp-log"
            />
            <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
              (Set to 13:07:30 and confirm with OK)
            </div>
          </div>
        </Space>
      </Modal>
    </div>
  );
}
