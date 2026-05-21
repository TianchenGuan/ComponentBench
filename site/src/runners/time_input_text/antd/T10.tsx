'use client';

/**
 * time_input_text-antd-T10: Set time in a drawer and press Save
 * 
 * Layout: drawer_flow. The main page shows a single button labeled "Edit reporting schedule".
 * When clicked, a right-side drawer opens (the drawer stays open after saving).
 * Inside the drawer:
 * - One AntD TimePicker labeled "Cutover time" (prefilled 16:00), format='HH:mm', allowClear=true, needConfirm=false.
 * - Two footer buttons: "Cancel" and "Save changes".
 * - Low clutter: one non-required toggle ("Email summary") and a short helper paragraph.
 * Important behavior: changing the TimePicker updates the field immediately, but the task requires clicking "Save changes" to count as complete.
 * 
 * Success: The TimePicker labeled "Cutover time" has value 17:00 (24-hour).
 *          The drawer footer button labeled "Save changes" must be clicked after the value is set.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, TimePicker, Switch, Typography, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cutoverTime, setCutoverTime] = useState<Dayjs | null>(dayjs('16:00', 'HH:mm'));
  const [emailSummary, setEmailSummary] = useState(false);
  const hasSucceeded = useRef(false);

  const handleSave = () => {
    if (!hasSucceeded.current && cutoverTime && cutoverTime.format('HH:mm') === '17:00') {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  const handleCancel = () => {
    setDrawerOpen(false);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setDrawerOpen(true)} data-testid="edit-reporting-btn">
        Edit reporting schedule
      </Button>

      <Drawer
        title="Reporting schedule"
        placement="right"
        width={400}
        open={drawerOpen}
        onClose={handleCancel}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSave} data-testid="reporting-save">
              Save changes
            </Button>
          </Space>
        }
      >
        <Paragraph type="secondary">
          Configure when reports are generated and distributed.
        </Paragraph>

        <div style={{ marginBottom: 24 }}>
          <label htmlFor="cutover-time" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Cutover time
          </label>
          <TimePicker
            id="cutover-time"
            value={cutoverTime}
            onChange={(time) => setCutoverTime(time)}
            format="HH:mm"
            allowClear
            needConfirm={false}
            style={{ width: '100%' }}
            data-testid="cutover-time"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch 
            checked={emailSummary} 
            onChange={setEmailSummary}
            data-testid="email-summary-toggle"
          />
          <Text>Email summary</Text>
        </div>
      </Drawer>
    </div>
  );
}
