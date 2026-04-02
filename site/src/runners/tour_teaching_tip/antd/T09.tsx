'use client';

/**
 * tour_teaching_tip-antd-T09: Restart tour to first step
 *
 * setup_description:
 * Isolated centered "Quick Start" card (light theme, comfortable spacing).
 * The AntD Tour is open on page load and starts on step 2 of 3 titled "Upload a file".
 * In addition to standard "Previous"/"Next" navigation, the Tour footer includes a tertiary link-style action labeled "Restart tour".
 * Clicking "Restart tour" programmatically sets the Tour current step back to the first step ("Welcome") while keeping the Tour open.
 *
 * success_trigger: Tour overlay is open, current step title is "Welcome", current step index equals 0.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Space } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(1); // Start at "Upload a file"
  const successCalledRef = useRef(false);
  const hasStartedOnStep1 = useRef(true); // Track that we started on step 1 (not 0)

  const uploadRef = useRef<HTMLButtonElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);

  // Build steps with custom footer that includes restart button
  const buildSteps = (): TourProps['steps'] => {
    const baseSteps = [
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

    return baseSteps.map((step, index) => ({
      ...step,
      prevButtonProps: index > 0 ? {
        children: (
          <Space>
            <Button type="link" size="small" onClick={() => setCurrent(0)} data-testid="restart-tour-btn">
              Restart tour
            </Button>
            <span>Previous</span>
          </Space>
        ),
      } : undefined,
    }));
  };

  useEffect(() => {
    // Only succeed if we went back to Welcome after starting on a different step
    if (open && current === 0 && hasStartedOnStep1.current && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Welcome') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 0 && hasStartedOnStep1.current && !successCalledRef.current) {
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
        
        {/* Restart button visible alongside tour */}
        {open && current > 0 && (
          <div style={{ marginTop: 16 }}>
            <Button
              type="link"
              size="small"
              onClick={() => setCurrent(0)}
              data-testid="restart-tour-btn"
            >
              Restart tour
            </Button>
          </div>
        )}
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={buildSteps()}
        data-testid="tour-quickstart"
      />
    </>
  );
}
