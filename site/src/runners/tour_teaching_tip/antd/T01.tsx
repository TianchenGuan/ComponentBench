'use client';

/**
 * tour_teaching_tip-antd-T01: Open Quick Start tour (Welcome)
 *
 * setup_description:
 * A single centered card titled "Quick Start" is shown (isolated_card layout, center placement) in a light theme with comfortable spacing.
 * Inside the card there is one primary button labeled "Begin Quick Start Tour" and a short paragraph of helper text.
 * Clicking the button opens an AntD Tour overlay (mask enabled, default arrow) with 3 steps anchored to simple demo elements inside the same card.
 * Step titles (in order) are: "Welcome", "Upload a file", and "Save changes".
 * The tour is initially closed. When open, the tour shows a step counter (e.g., "1 / 3"), a close (×) icon in the header, and a "Next" button in the footer (no custom actions).
 *
 * success_trigger: Tour overlay is open, current step title is "Welcome", current step index equals 0.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
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
    if (open && current === 0 && !successCalledRef.current) {
      // Verify the tour is actually visible
      const tourNode = document.querySelector('.ant-tour');
      if (tourNode) {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  // Also check via MutationObserver for when tour becomes visible
  useEffect(() => {
    const checkTour = () => {
      if (open && current === 0 && !successCalledRef.current) {
        const tourNode = document.querySelector('.ant-tour');
        const titleNode = document.querySelector('.ant-tour-title');
        if (tourNode && titleNode?.textContent === 'Welcome') {
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
