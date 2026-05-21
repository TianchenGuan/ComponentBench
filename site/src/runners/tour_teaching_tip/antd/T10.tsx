'use client';

/**
 * tour_teaching_tip-antd-T10: Open Help tour in bottom-right placement
 *
 * setup_description:
 * An isolated_card titled "Help" is anchored near the bottom-right of the viewport (placement=bottom_right) in a light theme with comfortable spacing.
 * Inside the card there is a small text link-style button labeled "Begin Help Tour" next to a question-mark icon.
 * Clicking the button opens an AntD Tour (mask enabled) with 2 steps:
 * 1) "Help menu" (points to the question-mark icon),
 * 2) "Contact support" (points to a "Contact" button within the card).
 * The tour is initially closed; when open it shows a close (×) icon and standard Next/Previous navigation.
 *
 * success_trigger: Tour overlay is open, current step title is "Help menu", current step index equals 0.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const helpIconRef = useRef<HTMLSpanElement>(null);
  const contactRef = useRef<HTMLButtonElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Help menu',
      description: 'Click here to access help resources and documentation.',
      target: () => helpIconRef.current!,
    },
    {
      title: 'Contact support',
      description: 'Need more help? Contact our support team directly.',
      target: () => contactRef.current!,
    },
  ];

  useEffect(() => {
    if (open && current === 0 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Help menu') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 0 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Help menu') {
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
    <Card title="Help" style={{ width: 300 }} data-testid="help-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span ref={helpIconRef} data-testid="help-icon">
          <QuestionCircleOutlined style={{ fontSize: 24, color: '#1677ff' }} />
        </span>
        <Button
          type="link"
          onClick={() => {
            setOpen(true);
            setCurrent(0);
          }}
          data-testid="begin-help-tour-btn"
        >
          Begin Help Tour
        </Button>
      </div>

      <Button ref={contactRef} data-testid="contact-btn">
        Contact
      </Button>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        mask={true}
        data-testid="tour-help"
      />
    </Card>
  );
}
