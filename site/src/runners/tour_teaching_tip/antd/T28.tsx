'use client';

/**
 * tour_teaching_tip-antd-T28: Complete long onboarding tour and finish
 *
 * setup_description:
 * A form_section layout titled "Onboarding" is displayed in light theme with comfortable spacing; it contains a short checklist and a primary button "Begin onboarding".
 * The AntD Tour is initially closed. Clicking "Begin onboarding" opens a modal-style Tour (mask enabled) with 8 sequential steps anchored to different checklist items.
 * For this configuration:
 * - the header close (×) icon is not shown,
 * - there is no "Skip" action,
 * - the only way to dismiss the tour is the final footer button on the last step.
 * Footer navigation shows "Previous" and "Next" on intermediate steps; on the final step the primary button label changes to "Finish onboarding".
 * The entire onboarding card is anchored toward the bottom-right (placement=bottom_right).
 *
 * success_trigger: Tour overlay is closed (require_confirm: true, confirm_control: Finish onboarding).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Checkbox, Space } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T28({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);
  const finishClickedRef = useRef(false);

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);
  const step6Ref = useRef<HTMLDivElement>(null);
  const step7Ref = useRef<HTMLDivElement>(null);
  const step8Ref = useRef<HTMLDivElement>(null);

  const checklistItems = [
    { ref: step1Ref, label: 'Create account', done: true },
    { ref: step2Ref, label: 'Verify email', done: true },
    { ref: step3Ref, label: 'Add profile photo', done: false },
    { ref: step4Ref, label: 'Set display name', done: false },
    { ref: step5Ref, label: 'Connect social accounts', done: false },
    { ref: step6Ref, label: 'Set notification preferences', done: false },
    { ref: step7Ref, label: 'Review privacy settings', done: false },
    { ref: step8Ref, label: 'Complete onboarding', done: false },
  ];

  const steps: TourProps['steps'] = checklistItems.map((item, index) => ({
    title: item.label,
    description: `Step ${index + 1}: ${item.label}`,
    target: () => item.ref.current!,
    nextButtonProps: index === 7 ? {
      children: 'Finish onboarding',
      onClick: () => {
        finishClickedRef.current = true;
        setOpen(false);
      },
    } : undefined,
  }));

  useEffect(() => {
    if (!open && finishClickedRef.current && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <>
      <Card title="Onboarding" style={{ width: 350 }} data-testid="onboarding-card">
        <p style={{ color: '#666', marginBottom: 16 }}>
          Complete these steps to set up your account.
        </p>

        <Space direction="vertical" style={{ width: '100%' }}>
          {checklistItems.map((item, index) => (
            <div
              key={index}
              ref={item.ref}
              style={{
                padding: 8,
                background: '#fafafa',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              data-testid={`checklist-item-${index + 1}`}
            >
              <Checkbox checked={item.done} disabled />
              <span style={{ color: item.done ? '#52c41a' : '#333' }}>{item.label}</span>
            </div>
          ))}
        </Space>

        <Button
          type="primary"
          block
          style={{ marginTop: 16 }}
          onClick={() => { setOpen(true); setCurrent(0); }}
          data-testid="begin-onboarding-btn"
        >
          Begin onboarding
        </Button>
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        mask={true}
        closeIcon={false}
        data-testid="tour-onboarding"
      />
    </>
  );
}
