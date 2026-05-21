'use client';

/**
 * date_picker_range-antd-v2-T12: Change dates then close without saving to preserve originals
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, DatePicker, Button, Modal, Typography, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

const ACCEPTED_START = '2026-07-10';
const ACCEPTED_END = '2026-07-12';
const DRAFT_START = '2026-08-03';
const DRAFT_END = '2026-08-07';

export default function T12({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [committed, setCommitted] = useState<[Dayjs, Dayjs]>([
    dayjs(ACCEPTED_START),
    dayjs(ACCEPTED_END),
  ]);
  const [draft, setDraft] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs(ACCEPTED_START),
    dayjs(ACCEPTED_END),
  ]);
  const draftChangedRef = useRef(false);
  const closedWithoutSavingRef = useRef(false);

  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDraft(dates);
      const s = dates[0].format('YYYY-MM-DD');
      const e = dates[1].format('YYYY-MM-DD');
      if (s !== committed[0].format('YYYY-MM-DD') || e !== committed[1].format('YYYY-MM-DD')) {
        draftChangedRef.current = true;
      }
    }
  };

  const handleSave = () => {
    if (draft[0] && draft[1]) {
      setCommitted([draft[0], draft[1]]);
    }
    setModalOpen(false);
  };

  const handleClose = () => {
    if (draftChangedRef.current) {
      closedWithoutSavingRef.current = true;
    }
    setDraft([committed[0], committed[1]]);
    setModalOpen(false);
  };

  useEffect(() => {
    if (successFired.current) return;
    if (
      closedWithoutSavingRef.current &&
      !modalOpen &&
      committed[0].format('YYYY-MM-DD') === ACCEPTED_START &&
      committed[1].format('YYYY-MM-DD') === ACCEPTED_END
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [modalOpen, committed, onSuccess]);

  return (
    <Card title="Maintenance Settings" style={{ width: 500 }}>
      <Paragraph type="secondary">
        Configure blackout dates when maintenance cannot be scheduled.
      </Paragraph>

      <Space style={{ marginBottom: 16 }}>
        <Text strong>Current blackout dates:</Text>
        <Text>
          {`${committed[0].format('YYYY-MM-DD')} \u2013 ${committed[1].format('YYYY-MM-DD')}`}
        </Text>
      </Space>

      <div>
        <Button type="primary" onClick={() => {
          setDraft([committed[0], committed[1]]);
          draftChangedRef.current = false;
          closedWithoutSavingRef.current = false;
          setModalOpen(true);
        }} data-testid="edit-blackout-dates">
          Edit blackout dates
        </Button>
      </div>

      <Modal
        title="Edit Blackout Dates"
        open={modalOpen}
        onCancel={handleClose}
        footer={
          <Space>
            <Button onClick={handleClose}>Close</Button>
            <Button type="primary" onClick={handleSave}>Save changes</Button>
          </Space>
        }
        width={520}
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
            value={draft}
            onChange={handleChange}
            format="YYYY-MM-DD"
            placeholder={['Start date', 'End date']}
            style={{ width: '100%' }}
            data-testid="blackout-dates-range"
          />
        </div>

        <Paragraph type="secondary" style={{ fontSize: 12 }}>
          Note: Clicking &quot;Close&quot; will discard any unsaved changes.
        </Paragraph>
      </Modal>
    </Card>
  );
}
