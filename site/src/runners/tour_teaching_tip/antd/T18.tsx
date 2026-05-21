'use client';

/**
 * tour_teaching_tip-antd-T18: Scroll to find Billing address tour step
 *
 * setup_description:
 * A settings_panel layout is shown as a tall scrollable card titled "Account Settings" (light theme, comfortable spacing, clutter=low).
 * The panel contains several sections stacked vertically (Profile, Security, Billing), so the panel itself scrolls.
 * The AntD Tour is open on page load and begins on step 1 titled "Profile section" targeting a control near the top of the panel.
 * The Tour is configured with scrollIntoViewOptions=false for steps (so it will NOT automatically scroll the panel to reveal later targets).
 * Step 3 is titled "Billing address" and targets an input group located near the bottom of the scrollable panel (initially out of view).
 * Standard Next/Previous buttons are present; close (×) icon is enabled.
 *
 * success_trigger: Tour overlay is open, current step title is "Billing address", current step index equals 2.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Input, Space, Divider } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T18({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const billingRef = useRef<HTMLDivElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Profile section',
      description: 'Update your personal information here.',
      target: () => profileRef.current!,
      scrollIntoViewOptions: false,
    },
    {
      title: 'Security section',
      description: 'Manage your security settings.',
      target: () => securityRef.current!,
      scrollIntoViewOptions: false,
    },
    {
      title: 'Billing address',
      description: 'Enter your billing address for invoices.',
      target: () => billingRef.current!,
      scrollIntoViewOptions: false,
    },
  ];

  useEffect(() => {
    if (open && current === 2 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Billing address') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 2 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Billing address') {
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
      <Card
        title="Account Settings"
        style={{ width: 400, height: 400, overflow: 'auto' }}
        data-testid="settings-panel"
      >
        {/* Profile section */}
        <div ref={profileRef} style={{ marginBottom: 24 }} data-testid="profile-section">
          <h4>Profile</h4>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input placeholder="Full name" />
            <Input placeholder="Email" />
            <Input placeholder="Phone" />
          </Space>
        </div>

        <Divider />

        {/* Security section */}
        <div ref={securityRef} style={{ marginBottom: 24 }} data-testid="security-section">
          <h4>Security</h4>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input.Password placeholder="Current password" />
            <Input.Password placeholder="New password" />
            <Input.Password placeholder="Confirm password" />
            <Button size="small">Enable 2FA</Button>
          </Space>
        </div>

        <Divider />

        {/* Billing section - initially out of view */}
        <div style={{ marginBottom: 24 }} data-testid="billing-section">
          <h4>Billing</h4>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input placeholder="Card number" />
            <Input placeholder="Cardholder name" />
            <div ref={billingRef} data-testid="billing-address-section">
              <p style={{ margin: '8px 0', fontWeight: 500 }}>Billing Address</p>
              <Input placeholder="Street address" style={{ marginBottom: 8 }} />
              <Input placeholder="City" style={{ marginBottom: 8 }} />
              <Input placeholder="Postal code" style={{ marginBottom: 8 }} />
              <Input placeholder="Country" />
            </div>
          </Space>
        </div>

        <Divider />

        <Button type="primary" block>
          Save All Settings
        </Button>
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        data-testid="tour-settings"
      />
    </>
  );
}
