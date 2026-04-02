'use client';

/**
 * tour_teaching_tip-antd-T03: Go back to Welcome step
 *
 * setup_description:
 * Quick Start isolated centered card, light theme, comfortable spacing.
 * The AntD Tour is open on page load and is currently on step 2 of 3 titled "Upload a file".
 * The Tour footer shows both "Previous" and "Next" buttons. A close (×) icon is also present.
 * The highlighted target is a small demo "Upload" button inside the card (not required to click).
 *
 * success_trigger: Tour overlay is open, current step title is "Welcome", current step index equals 0.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(1); // Start at "Upload a file"
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
    if (open && current === 0 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Welcome') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 0 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Welcome') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [open, current, onSuccess]);

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
        data-testid="tour-quickstart"
      />
    </>
  );
}
