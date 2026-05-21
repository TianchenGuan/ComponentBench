'use client';

/**
 * date_picker_range-antd-T08: Cancel changes in a need-confirm RangePicker
 *
 * A settings page with a primary button 'Edit blackout dates'.
 * Clicking it opens a modal dialog (modal_flow). Inside the modal is a single Ant
 * Design RangePicker labeled 'Blackout dates' with needConfirm enabled, so the calendar
 * panel includes explicit action buttons (OK and Cancel). The RangePicker is prefilled
 * with '2026-07-10 ~ 2026-07-12'. The rest of the modal contains read-only text
 * explaining what blackout dates mean (non-interactive). The task is to open the
 * picker panel and use Cancel to ensure no new selection is applied.
 *
 * Success: Picker overlay closed after pressing Cancel, range remains 2026-07-10 to 2026-07-12
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, DatePicker, Button, Modal, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs('2026-07-10'),
    dayjs('2026-07-12'),
  ]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const cancelClickedRef = useRef(false);
  const wasPickerOpenRef = useRef(false);

  useEffect(() => {
    // Track when picker opens
    if (pickerOpen) {
      wasPickerOpenRef.current = true;
    }
    
    // Success: picker was opened, then closed (Cancel was clicked), and value remains unchanged
    if (
      wasPickerOpenRef.current &&
      !pickerOpen &&
      cancelClickedRef.current &&
      value &&
      value[0] &&
      value[1] &&
      value[0].format('YYYY-MM-DD') === '2026-07-10' &&
      value[1].format('YYYY-MM-DD') === '2026-07-12'
    ) {
      onSuccess();
    }
  }, [pickerOpen, value, onSuccess]);

  const handleOpenChange = (open: boolean) => {
    setPickerOpen(open);
    // If closing without applying, consider it a cancel
    if (!open && wasPickerOpenRef.current) {
      cancelClickedRef.current = true;
    }
  };

  return (
    <Card title="Maintenance Settings" style={{ width: 500 }}>
      <Paragraph type="secondary">
        Configure blackout dates when maintenance cannot be scheduled.
      </Paragraph>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong>Current blackout dates: </Text>
        <Text>{value && value[0] && value[1] ? `${value[0].format('YYYY-MM-DD')} ~ ${value[1].format('YYYY-MM-DD')}` : 'None'}</Text>
      </div>
      
      <Button type="primary" onClick={() => setModalOpen(true)} data-testid="edit-blackout-dates">
        Edit blackout dates
      </Button>

      <Modal
        title="Edit Blackout Dates"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={500}
      >
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          Blackout dates are periods when no maintenance activities can be scheduled.
          Use the calendar below to adjust the blackout window.
        </Paragraph>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Blackout dates
          </label>
          <RangePicker
            value={value}
            onChange={(dates) => setValue(dates)}
            format="YYYY-MM-DD"
            placeholder={['Start date', 'End date']}
            style={{ width: '100%' }}
            data-testid="blackout-dates-range"
            needConfirm
            open={pickerOpen}
            onOpenChange={handleOpenChange}
          />
        </div>
        
        <Paragraph type="secondary" style={{ fontSize: 12 }}>
          Note: Opening the calendar and clicking Cancel will keep the current dates unchanged.
        </Paragraph>
      </Modal>
    </Card>
  );
}
