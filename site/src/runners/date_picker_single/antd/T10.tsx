'use client';

/**
 * date_picker_single-antd-T10: Set pickup date inside a modal
 *
 * Scene: Modal flow (modal_flow) in a light theme with comfortable spacing.
 *
 * Entry point: The page shows a header "Pickups" and a primary button labeled "Schedule pickup". Clicking it opens an Ant Design Modal dialog.
 *
 * Target component: Inside the modal, there is one Ant Design DatePicker labeled "Pickup date".
 * - Initial state: empty.
 * - Interaction: Clicking the input opens a popover calendar within the modal (still a floating layer anchored to the input).
 *
 * Distractors: The modal also contains a text area ("Pickup notes") and two buttons at the bottom ("Cancel" and "Create pickup"). They do not affect success; the task completes based only on the DatePicker value.
 *
 * Feedback: Selecting a date updates the input immediately; the "Create pickup" button becomes enabled, but clicking it is not required.
 *
 * Success: Date picker must have selected date = 2026-07-04.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Button, Modal, Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState<Dayjs | null>(null);
  const [pickupNotes, setPickupNotes] = useState('');

  useEffect(() => {
    if (pickupDate && pickupDate.format('YYYY-MM-DD') === '2026-07-04') {
      onSuccess();
    }
  }, [pickupDate, onSuccess]);

  return (
    <Card title="Pickups" style={{ width: 400 }}>
      <p style={{ marginBottom: 16 }}>
        Schedule a new pickup for your shipment.
      </p>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Schedule pickup
      </Button>

      <Modal
        title="Schedule pickup"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="create"
            type="primary"
            disabled={!pickupDate}
            onClick={() => setIsModalOpen(false)}
          >
            Create pickup
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Pickup date
          </label>
          <DatePicker
            value={pickupDate}
            onChange={(date) => setPickupDate(date)}
            format="YYYY-MM-DD"
            placeholder="Select date"
            style={{ width: '100%' }}
            data-testid="pickup-date"
          />
        </div>
        <div>
          <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Pickup notes
          </label>
          <TextArea
            value={pickupNotes}
            onChange={(e) => setPickupNotes(e.target.value)}
            placeholder="Add any special instructions..."
            rows={3}
            data-testid="pickup-notes"
          />
        </div>
      </Modal>
    </Card>
  );
}
