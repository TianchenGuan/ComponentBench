'use client';

/**
 * tour_teaching_tip-antd-T27: Overflow menu: restart tour to first step
 *
 * setup_description:
 * A centered isolated card titled "Feature Walkthrough" (light theme, comfortable spacing) contains a short paragraph and a subtle reference badge:
 * "First step icon: compass" with a tiny compass illustration.
 * The AntD Tour is open on page load on step 4 of 4 titled "Finish" (cover: checkmark).
 * The Tour footer includes an overflow icon button (⋯) labeled "More actions". Clicking it opens a small dropdown menu anchored to the footer with two items:
 * - "Restart tour" (with a circular-arrow icon)
 * - "Skip tour"
 * The close (×) icon is disabled for this configuration; ending or restarting must be done via the footer controls.
 * Selecting "Restart tour" resets the Tour to step 1 titled "Overview" (cover: compass) and keeps it open.
 *
 * success_trigger: Tour overlay is open, current step title is "Overview", current step index equals 0.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Dropdown, Space } from 'antd';
import { CompassOutlined, SearchOutlined, BellOutlined, CheckCircleOutlined, MoreOutlined, RedoOutlined, CloseOutlined } from '@ant-design/icons';
import type { TourProps, MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T27({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(3); // Start at Finish (step 4)
  const successCalledRef = useRef(false);
  const hasStartedOnStep3 = useRef(true);

  const overviewRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<HTMLDivElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Overview',
      description: 'Get an overview of the features.',
      cover: <div style={{ textAlign: 'center', padding: 16 }} data-cover-id="compass"><CompassOutlined style={{ fontSize: 40, color: '#1677ff' }} /></div>,
      target: () => overviewRef.current!,
    },
    {
      title: 'Search',
      description: 'Search for anything.',
      cover: <div style={{ textAlign: 'center', padding: 16 }} data-cover-id="magnifier"><SearchOutlined style={{ fontSize: 40, color: '#1677ff' }} /></div>,
      target: () => searchRef.current!,
    },
    {
      title: 'Notifications',
      description: 'Manage notifications.',
      cover: <div style={{ textAlign: 'center', padding: 16 }} data-cover-id="bell"><BellOutlined style={{ fontSize: 40, color: '#1677ff' }} /></div>,
      target: () => notificationsRef.current!,
    },
    {
      title: 'Finish',
      description: 'You\'re all done!',
      cover: <div style={{ textAlign: 'center', padding: 16 }} data-cover-id="checkmark"><CheckCircleOutlined style={{ fontSize: 40, color: '#52c41a' }} /></div>,
      target: () => finishRef.current!,
    },
  ];

  useEffect(() => {
    if (open && current === 0 && hasStartedOnStep3.current && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Overview') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 0 && hasStartedOnStep3.current && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Overview') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [open, current, onSuccess]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'restart',
      icon: <RedoOutlined />,
      label: 'Restart tour',
      onClick: () => setCurrent(0),
    },
    {
      key: 'skip',
      icon: <CloseOutlined />,
      label: 'Skip tour',
      onClick: () => setOpen(false),
    },
  ];

  return (
    <>
      <Card title="Feature Walkthrough" style={{ width: 400 }} data-testid="walkthrough-card">
        <p style={{ color: '#666', marginBottom: 16 }}>
          Learn about all the features in this walkthrough.
        </p>

        {/* Reference badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            background: '#f5f5f5',
            borderRadius: 4,
            marginBottom: 16,
          }}
        >
          <CompassOutlined style={{ color: '#1677ff' }} />
          <span style={{ fontSize: 12, color: '#666' }}>First step icon: compass</span>
        </div>

        <Space direction="vertical" style={{ width: '100%' }}>
          <div ref={overviewRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>Overview</div>
          <div ref={searchRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>Search</div>
          <div ref={notificationsRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>Notifications</div>
          <div ref={finishRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>Finish</div>
        </Space>

        {/* More actions dropdown - visible when tour is open */}
        {open && (
          <div style={{ marginTop: 16 }}>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Button type="text" size="small" icon={<MoreOutlined />} data-testid="more-actions-btn">
                More actions
              </Button>
            </Dropdown>
          </div>
        )}
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        closeIcon={false}
        data-testid="tour-feature"
      />
    </>
  );
}
