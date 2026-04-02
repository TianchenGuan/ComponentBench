'use client';

/**
 * tour_teaching_tip-antd-T14: Compact + small: reach Security step
 *
 * setup_description:
 * An isolated centered card titled "Account Setup" is shown in light theme but with compact spacing and small-scale controls (small buttons, tighter padding).
 * The AntD Tour is open on page load on step 1 of 5 titled "Profile".
 * Other step titles are: "Preferences", "Security", "Billing", "Finish".
 * Because of the compact/small configuration, the Tour footer buttons ("Previous"/"Next") are smaller and closer together than default, and the close (×) icon is also slightly smaller.
 * Mask remains enabled; the tour is the only overlay.
 *
 * success_trigger: Tour overlay is open, current step title is "Security", current step index equals 2.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Space, ConfigProvider } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T14({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0); // Start at Profile
  const successCalledRef = useRef(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const preferencesRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const billingRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<HTMLButtonElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Profile',
      description: 'Set up your profile information.',
      target: () => profileRef.current!,
    },
    {
      title: 'Preferences',
      description: 'Customize your preferences.',
      target: () => preferencesRef.current!,
    },
    {
      title: 'Security',
      description: 'Configure your security settings.',
      target: () => securityRef.current!,
    },
    {
      title: 'Billing',
      description: 'Add your billing information.',
      target: () => billingRef.current!,
    },
    {
      title: 'Finish',
      description: 'Complete your account setup.',
      target: () => finishRef.current!,
    },
  ];

  useEffect(() => {
    if (open && current === 2 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Security') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 2 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Security') {
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
    <ConfigProvider
      componentSize="small"
      theme={{
        token: {
          padding: 12,
          paddingLG: 16,
          paddingSM: 8,
        },
      }}
    >
      <Card
        title="Account Setup"
        style={{ width: 350 }}
        bodyStyle={{ padding: 12 }}
        data-testid="account-setup-card"
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div ref={profileRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
            <strong>Profile</strong>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Name, photo, bio</p>
          </div>
          <div ref={preferencesRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
            <strong>Preferences</strong>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Theme, language</p>
          </div>
          <div ref={securityRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
            <strong>Security</strong>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Password, 2FA</p>
          </div>
          <div ref={billingRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
            <strong>Billing</strong>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Payment methods</p>
          </div>
          <Button ref={finishRef} type="primary" size="small" block data-testid="finish-setup-btn">
            Finish Setup
          </Button>
        </Space>
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        mask={true}
        data-testid="tour-account-setup"
      />
    </ConfigProvider>
  );
}
