'use client';

/**
 * tour_teaching_tip-antd-T25: Compact + small indicators: jump to Integrations
 *
 * setup_description:
 * A small isolated card titled "Mini Tour" is positioned near the top-left of the viewport (placement=top_left) with compact spacing and small-scale controls.
 * A small primary button labeled "Begin Mini Tour" opens an AntD Tour with 7 steps.
 * The Tour uses a compact custom indicator row (indicatorsRender) rendered as tiny numbered dots "1" through "7" with minimal spacing; each dot is clickable to jump to that step.
 * Step titles are: "Welcome", "Navigation", "Search", "Shortcuts", "Settings", "Integrations", "Finish".
 * Initial state: tour closed. When open, footer buttons are also small due to scale=small.
 *
 * success_trigger: Tour overlay is open, current step title is "Integrations", current step index equals 5.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Space, ConfigProvider } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T25({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const welcomeRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const shortcutsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const integrationsRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<HTMLDivElement>(null);

  const stepTitles = ['Welcome', 'Navigation', 'Search', 'Shortcuts', 'Settings', 'Integrations', 'Finish'];

  const steps: TourProps['steps'] = [
    { title: 'Welcome', description: 'Welcome to the mini tour!', target: () => welcomeRef.current! },
    { title: 'Navigation', description: 'Learn navigation.', target: () => navigationRef.current! },
    { title: 'Search', description: 'Search features.', target: () => searchRef.current! },
    { title: 'Shortcuts', description: 'Keyboard shortcuts.', target: () => shortcutsRef.current! },
    { title: 'Settings', description: 'App settings.', target: () => settingsRef.current! },
    { title: 'Integrations', description: 'Third-party integrations.', target: () => integrationsRef.current! },
    { title: 'Finish', description: 'You\'re done!', target: () => finishRef.current! },
  ];

  useEffect(() => {
    if (open && current === 5 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Integrations') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 5 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Integrations') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [open, current, onSuccess]);

  const indicatorsRender: TourProps['indicatorsRender'] = (currentStep) => (
    <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
      {stepTitles.map((title, index) => (
        <button
          key={index}
          onClick={() => setCurrent(index)}
          aria-label={`Step ${index + 1}: ${title}`}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: index === currentStep ? '2px solid #1677ff' : '1px solid #d9d9d9',
            background: index === currentStep ? '#1677ff' : '#fff',
            color: index === currentStep ? '#fff' : '#666',
            fontSize: 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          data-testid={`indicator-${index + 1}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );

  return (
    <ConfigProvider componentSize="small">
      <Card
        title="Mini Tour"
        size="small"
        style={{ width: 280 }}
        bodyStyle={{ padding: 8 }}
        data-testid="mini-tour-card"
      >
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <div ref={welcomeRef} style={{ padding: 4, background: '#fafafa', borderRadius: 2, fontSize: 12 }}>
            Welcome
          </div>
          <div ref={navigationRef} style={{ padding: 4, background: '#fafafa', borderRadius: 2, fontSize: 12 }}>
            Navigation
          </div>
          <div ref={searchRef} style={{ padding: 4, background: '#fafafa', borderRadius: 2, fontSize: 12 }}>
            Search
          </div>
          <div ref={shortcutsRef} style={{ padding: 4, background: '#fafafa', borderRadius: 2, fontSize: 12 }}>
            Shortcuts
          </div>
          <div ref={settingsRef} style={{ padding: 4, background: '#fafafa', borderRadius: 2, fontSize: 12 }}>
            Settings
          </div>
          <div ref={integrationsRef} style={{ padding: 4, background: '#fafafa', borderRadius: 2, fontSize: 12 }}>
            Integrations
          </div>
          <div ref={finishRef} style={{ padding: 4, background: '#fafafa', borderRadius: 2, fontSize: 12 }}>
            Finish
          </div>
        </Space>
        <Button
          type="primary"
          size="small"
          style={{ marginTop: 8 }}
          onClick={() => { setOpen(true); setCurrent(0); }}
          data-testid="begin-mini-tour-btn"
        >
          Begin Mini Tour
        </Button>
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        indicatorsRender={indicatorsRender}
        data-testid="tour-mini"
      />
    </ConfigProvider>
  );
}
