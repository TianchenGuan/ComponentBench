'use client';

/**
 * tour_teaching_tip-antd-T05: Finish tour using Finish button
 *
 * setup_description:
 * Isolated centered card in light theme (comfortable spacing) titled "Quick Start".
 * The AntD Tour is open on page load and is already on the final step (step 3 of 3) titled "Save changes".
 * This configuration disables the header close icon (closeIcon is not rendered), so the only way to end the tour is via the footer primary button.
 * The footer shows a single primary button labeled "Finish" (custom nextButtonProps children="Finish"). Clicking it closes the tour.
 *
 * success_trigger: Tour overlay is closed (require_confirm: true, confirm_control: Finish).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(2); // Start at final step
  const successCalledRef = useRef(false);
  const finishClickedRef = useRef(false);

  const uploadRef = useRef<HTMLButtonElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Welcome',
      description: 'Welcome to the Quick Start tour! This will guide you through the basics.',
      target: () => startRef.current!,
    },
    {
      title: 'Upload a file',
      description: 'Click here to upload your files.',
      target: () => uploadRef.current!,
    },
    {
      title: 'Save changes',
      description: 'Don\'t forget to save your changes when you\'re done.',
      target: () => saveRef.current!,
      nextButtonProps: {
        children: 'Finish',
        onClick: () => {
          finishClickedRef.current = true;
          setOpen(false);
        },
      },
    },
  ];

  useEffect(() => {
    if (!open && finishClickedRef.current && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <>
      <Card title="Quick Start" style={{ width: 400 }} data-testid="quickstart-card">
        <p style={{ marginBottom: 16, color: '#666' }}>
          Get started with our quick tour to learn the basics.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button type="primary" ref={startRef} data-testid="begin-tour-btn">
            Begin Quick Start Tour
          </Button>
          <Button ref={uploadRef} data-testid="upload-btn">
            Upload
          </Button>
          <Button ref={saveRef} data-testid="save-btn">
            Save
          </Button>
        </div>
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        closeIcon={false}
        data-testid="tour-quickstart"
      />
    </>
  );
}
