'use client';

/**
 * tour_teaching_tip-antd-T06: Open tour and reach Save changes step
 *
 * setup_description:
 * Isolated centered "Quick Start" card (light theme, comfortable spacing) with one button labeled "Begin Quick Start Tour".
 * The AntD Tour is initially closed. Opening it starts at step 1 titled "Welcome" and provides "Next"/"Previous" navigation plus a visible step counter.
 * There are 3 steps: "Welcome" → "Upload a file" → "Save changes". No other interactive elements are required for success.
 *
 * success_trigger: Tour overlay is open, current step title is "Save changes", current step index equals 2.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
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
    if (open && current === 2 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Save changes') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 2 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Save changes') {
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
          <Button
            type="primary"
            ref={startRef}
            onClick={() => {
              setOpen(true);
              setCurrent(0);
            }}
            data-testid="begin-tour-btn"
          >
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
