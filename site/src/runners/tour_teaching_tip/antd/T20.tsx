'use client';

/**
 * tour_teaching_tip-antd-T20: Restart Settings Tour (2 instances)
 *
 * setup_description:
 * An isolated_card scene in light theme with comfortable spacing shows two tour launchers side-by-side:
 * - Left card: "Dashboard Tour" (closed)
 * - Right card: "Settings Tour" (open)
 * On page load, the "Settings Tour" is already open and currently on step 3 of 4 titled "Privacy".
 * The Settings Tour footer includes a tertiary action labeled "Restart this tour" (in addition to standard Previous/Next).
 * Clicking "Restart this tour" resets the Settings Tour back to step 1 titled "General settings" and keeps it open.
 * The Dashboard Tour remains closed throughout and should not be interacted with.
 *
 * success_trigger: The active Tour instance is Settings Tour, tour overlay is open, current step title is "General settings", current step index equals 0.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Space } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T20({ task, onSuccess }: TaskComponentProps) {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [dashboardCurrent, setDashboardCurrent] = useState(0);
  const [settingsCurrent, setSettingsCurrent] = useState(2); // Start at Privacy (step 3)
  const successCalledRef = useRef(false);
  const hasStartedOnStep2 = useRef(true);

  // Dashboard refs
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Settings refs
  const generalRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const privacyRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const dashboardSteps: TourProps['steps'] = [
    {
      title: 'Dashboard overview',
      description: 'View your dashboard.',
      target: () => dashboardRef.current!,
    },
  ];

  const settingsSteps: TourProps['steps'] = [
    {
      title: 'General settings',
      description: 'Configure general application settings.',
      target: () => generalRef.current!,
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences.',
      target: () => notificationsRef.current!,
    },
    {
      title: 'Privacy',
      description: 'Control your privacy settings.',
      target: () => privacyRef.current!,
    },
    {
      title: 'Account',
      description: 'Manage your account settings.',
      target: () => accountRef.current!,
    },
  ];

  useEffect(() => {
    if (settingsOpen && settingsCurrent === 0 && hasStartedOnStep2.current && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'General settings') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [settingsOpen, settingsCurrent, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (settingsOpen && settingsCurrent === 0 && hasStartedOnStep2.current && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'General settings') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [settingsOpen, settingsCurrent, onSuccess]);

  return (
    <>
      <Space size="large">
        <Card title="Dashboard Tour" style={{ width: 280 }} data-testid="dashboard-tour-card">
          <div ref={dashboardRef} style={{ marginBottom: 16 }}>
            <p style={{ color: '#666' }}>Learn about your dashboard.</p>
          </div>
          <Button
            type="primary"
            onClick={() => {
              setSettingsOpen(false);
              setDashboardOpen(true);
              setDashboardCurrent(0);
            }}
            data-testid="begin-dashboard-tour-btn"
          >
            Begin Dashboard Tour
          </Button>
        </Card>

        <Card title="Settings Tour" style={{ width: 280 }} data-testid="settings-tour-card">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div ref={generalRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
              General
            </div>
            <div ref={notificationsRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
              Notifications
            </div>
            <div ref={privacyRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
              Privacy
            </div>
            <div ref={accountRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
              Account
            </div>
          </Space>
          
          {/* Restart button visible when tour is open */}
          {settingsOpen && settingsCurrent > 0 && (
            <Button
              type="link"
              size="small"
              onClick={() => setSettingsCurrent(0)}
              style={{ marginTop: 8 }}
              data-testid="restart-settings-tour-btn"
            >
              Restart this tour
            </Button>
          )}
        </Card>
      </Space>

      <Tour
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        current={dashboardCurrent}
        onChange={setDashboardCurrent}
        steps={dashboardSteps}
        data-testid="tour-dashboard"
      />

      <Tour
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        current={settingsCurrent}
        onChange={setSettingsCurrent}
        steps={settingsSteps}
        data-testid="tour-settings"
      />
    </>
  );
}
