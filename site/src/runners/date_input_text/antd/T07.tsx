'use client';

/**
 * date_input_text-antd-T07: AntD date input inside a modal with Save/Cancel
 * 
 * Layout: modal_flow. The base page shows a small reservation summary card and a primary button "Edit reservation".
 * When "Edit reservation" is clicked, an Ant Design Modal opens in the center of the screen.
 * Inside the modal is a short form with:
 *   - "Guest name" (prefilled text input; not required)
 *   - "Check-in date" (Ant Design DatePicker; format YYYY-MM-DD; manual typing enabled)
 * Initial state: modal is closed; "Check-in date" is empty once the modal opens.
 * Actions: modal footer has two buttons: "Cancel" (secondary) and "Save reservation" (primary).
 * Feedback: clicking "Save reservation" closes the modal and shows a small inline success message under the reservation summary ("Saved").
 * 
 * Success: The "Check-in date" value in the modal form equals 2026-07-04 AND the user has clicked "Save reservation".
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Modal, DatePicker, Input, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('John Smith');
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [saved, setSaved] = useState(false);
  const successTriggered = useRef(false);

  const handleSave = () => {
    if (checkInDate && checkInDate.format('YYYY-MM-DD') === '2026-07-04' && !successTriggered.current) {
      successTriggered.current = true;
      setSaved(true);
      setModalOpen(false);
      onSuccess();
    } else {
      // Still close the modal even if the date is wrong
      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    // Reset the date when cancelled
    setCheckInDate(null);
  };

  return (
    <>
      <Card title="Reservation Summary" style={{ width: 400 }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Guest:</Text> {guestName}
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Check-in:</Text> {saved && checkInDate ? checkInDate.format('YYYY-MM-DD') : 'Not set'}
        </div>
        
        <Button
          type="primary"
          onClick={() => setModalOpen(true)}
          data-testid="edit-reservation"
        >
          Edit reservation
        </Button>

        {saved && (
          <div style={{ marginTop: 12 }}>
            <Text type="success">Saved</Text>
          </div>
        )}
      </Card>

      <Modal
        title="Edit Reservation"
        open={modalOpen}
        onCancel={handleCancel}
        data-testid="edit-reservation-modal"
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSave}
            data-testid="save-reservation"
          >
            Save reservation
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <label htmlFor="guest-name" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
              Guest name
            </label>
            <Input
              id="guest-name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="checkin-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
              Check-in date
            </label>
            <DatePicker
              id="checkin-date"
              value={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              format="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              style={{ width: '100%' }}
              data-testid="checkin-date"
              allowClear
            />
          </div>
        </Space>
      </Modal>
    </>
  );
}
