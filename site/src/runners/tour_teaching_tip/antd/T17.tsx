'use client';

/**
 * tour_teaching_tip-antd-T17: Match reference (bell) to reach Notifications step
 *
 * setup_description:
 * A centered isolated card titled "Feature Walkthrough" appears in light theme with comfortable spacing.
 * At the top of the card there is a small "Reference" panel showing:
 * - a target illustration (a bell icon in a rounded square), and
 * - a caption text: "Target step: Notifications".
 * Below the reference panel is a button "Begin Feature Tour". The AntD Tour is open on page load on step 1 of 4.
 * Each Tour step includes a small cover illustration (TourStep.cover) next to the title:
 * Step titles are "Overview" (cover: compass), "Search" (cover: magnifier), "Notifications" (cover: bell), and "Finish" (cover: checkmark).
 * The Tour supports standard Next/Previous navigation and shows the step title as text.
 *
 * success_trigger: Tour overlay is open, current step's cover/illustration matches the on-page reference (bell), current step title is "Notifications".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Space } from 'antd';
import { CompassOutlined, SearchOutlined, BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T17({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const overviewRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<HTMLDivElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Overview',
      description: 'Get an overview of the feature.',
      cover: (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }} data-cover-id="compass">
          <CompassOutlined style={{ fontSize: 48, color: '#1677ff' }} />
        </div>
      ),
      target: () => overviewRef.current!,
    },
    {
      title: 'Search',
      description: 'Learn how to search effectively.',
      cover: (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }} data-cover-id="magnifier">
          <SearchOutlined style={{ fontSize: 48, color: '#1677ff' }} />
        </div>
      ),
      target: () => searchRef.current!,
    },
    {
      title: 'Notifications',
      description: 'Manage your notifications.',
      cover: (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }} data-cover-id="bell">
          <BellOutlined style={{ fontSize: 48, color: '#1677ff' }} />
        </div>
      ),
      target: () => notificationsRef.current!,
    },
    {
      title: 'Finish',
      description: 'You\'re all done!',
      cover: (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }} data-cover-id="checkmark">
          <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
        </div>
      ),
      target: () => finishRef.current!,
    },
  ];

  useEffect(() => {
    if (open && current === 2 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Notifications') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 2 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Notifications') {
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
      <Card title="Feature Walkthrough" style={{ width: 450 }} data-testid="walkthrough-card">
        {/* Reference panel */}
        <div
          style={{
            padding: 16,
            marginBottom: 16,
            background: '#f5f5f5',
            borderRadius: 8,
            border: '2px dashed #d9d9d9',
          }}
          data-testid="ref-bell-notifications"
        >
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <strong>Reference</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: '#fff',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <BellOutlined style={{ fontSize: 32, color: '#1677ff' }} />
            </div>
            <span style={{ color: '#666' }}>Target step: Notifications</span>
          </div>
        </div>

        <Button type="primary" style={{ marginBottom: 16 }} data-testid="begin-feature-tour-btn">
          Begin Feature Tour
        </Button>

        <Space direction="vertical" style={{ width: '100%' }}>
          <div ref={overviewRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
            Overview section
          </div>
          <div ref={searchRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
            Search section
          </div>
          <div ref={notificationsRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
            Notifications section
          </div>
          <div ref={finishRef} style={{ padding: 8, background: '#fafafa', borderRadius: 4 }}>
            Finish section
          </div>
        </Space>
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        data-testid="tour-feature"
      />
    </>
  );
}
