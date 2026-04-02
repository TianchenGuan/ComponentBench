'use client';

/**
 * textarea-antd-T06: Edit summary in a modal and save
 *
 * The page shows a centered "Report" card with a button "Edit summary".
 * - Light theme, comfortable spacing, default scale.
 * - Clicking "Edit summary" opens an Ant Design Modal (modal_flow).
 * - Inside the modal is one Input.TextArea labeled "Summary", configured with showCount=true and maxLength=120.
 * - The Summary textarea starts with the text "(empty)" selected.
 * - At the bottom-right of the modal are two buttons: "Cancel" and a primary "Save summary".
 * - After saving, a small toast "Saved" appears.
 *
 * Success: Committed value equals "Quarterly report: highlight Q4 growth and pending invoices." (require_confirm=true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Input, message } from 'antd';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;

const TARGET_VALUE = 'Quarterly report: highlight Q4 growth and pending invoices.';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftValue, setDraftValue] = useState('(empty)');
  const [committedValue, setCommittedValue] = useState('(empty)');
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (committedValue.trim() === TARGET_VALUE && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpen = () => {
    setDraftValue(committedValue);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setCommittedValue(draftValue);
    setIsModalOpen(false);
    message.success('Saved');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card title="Report" style={{ width: 400 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#666', fontSize: 13 }}>
            Current summary: <span style={{ fontStyle: 'italic' }}>{committedValue}</span>
          </div>
        </div>
        <Button type="primary" onClick={handleOpen} data-testid="btn-edit-summary">
          Edit summary
        </Button>
      </Card>

      <Modal
        title="Edit Summary"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave} data-testid="btn-save-summary">
            Save summary
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="summary" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Summary
          </label>
          <TextArea
            id="summary"
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            showCount
            maxLength={120}
            rows={4}
            data-testid="textarea-summary"
          />
        </div>
      </Modal>
    </>
  );
}
