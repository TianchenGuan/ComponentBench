'use client';

/**
 * tour_teaching_tip-antd-T04: Dismiss tour with close icon
 *
 * setup_description:
 * Quick Start isolated centered card (light theme, comfortable spacing). The AntD Tour is open on page load on the "Welcome" step.
 * The Tour header includes a small close (×) icon on the right side. The footer has a "Next" button.
 * Mask is enabled, so the rest of the page is dimmed while the Tour is open.
 *
 * success_trigger: Tour overlay is closed.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

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
    },
  ];

  useEffect(() => {
    if (!open && !successCalledRef.current) {
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
        mask={true}
        data-testid="tour-quickstart"
      />
    </>
  );
}
