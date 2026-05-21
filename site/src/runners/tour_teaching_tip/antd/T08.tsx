'use client';

/**
 * tour_teaching_tip-antd-T08: Jump to step via indicator chips
 *
 * setup_description:
 * Isolated centered "Quick Start" card in light theme with comfortable spacing.
 * There is a button labeled "Begin Quick Start Tour". The AntD Tour is initially closed.
 * When opened, the Tour uses a custom indicator bar (indicatorsRender) at the bottom that shows three clickable chips labeled:
 * "Welcome", "Upload a file", and "Save changes". Clicking a chip jumps directly to that step (onChange/current is updated).
 * The Tour also has standard Next/Previous buttons, but the indicators are the intended direct-selection affordance.
 *
 * success_trigger: Tour overlay is open, current step title is "Upload a file", current step index equals 1.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Space, Tag } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const uploadRef = useRef<HTMLButtonElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);

  const stepTitles = ['Welcome', 'Upload a file', 'Save changes'];

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
    if (open && current === 1 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Upload a file') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 1 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Upload a file') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [open, current, onSuccess]);

  const indicatorsRender: TourProps['indicatorsRender'] = (currentStep, total) => (
    <Space style={{ marginTop: 8 }}>
      {stepTitles.map((title, index) => (
        <Tag
          key={index}
          color={index === currentStep ? 'blue' : 'default'}
          style={{ cursor: 'pointer' }}
          onClick={() => setCurrent(index)}
          data-testid={`indicator-${index}`}
        >
          {title}
        </Tag>
      ))}
    </Space>
  );

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
        indicatorsRender={indicatorsRender}
        data-testid="tour-quickstart"
      />
    </>
  );
}
