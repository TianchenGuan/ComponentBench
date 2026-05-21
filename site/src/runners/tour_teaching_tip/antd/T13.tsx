'use client';

/**
 * tour_teaching_tip-antd-T13: Dark theme: go to Notifications step
 *
 * setup_description:
 * A centered isolated card titled "Inbox" is rendered in a dark theme (dark background, light text) with comfortable spacing.
 * An AntD Tour is open on page load and currently shows step 1 of 4 titled "Overview".
 * Step titles are: "Overview" → "Search" → "Notifications" → "All set".
 * The Tour uses mask=true and the default footer with "Previous"/"Next" buttons and a close (×) icon.
 * No other overlays are present; the rest of the UI is a simple inbox header and a few placeholder messages (not required).
 *
 * success_trigger: Tour overlay is open, current step title is "Notifications", current step index equals 2.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, List } from 'antd';
import { SearchOutlined, BellOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T13({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0); // Start at Overview
  const successCalledRef = useRef(false);

  const overviewRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLButtonElement>(null);
  const notificationsRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Overview',
      description: 'This is your inbox overview where you can see all messages.',
      target: () => overviewRef.current!,
    },
    {
      title: 'Search',
      description: 'Use the search to find specific messages.',
      target: () => searchRef.current!,
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences here.',
      target: () => notificationsRef.current!,
    },
    {
      title: 'All set',
      description: 'You\'re all set! Start exploring your inbox.',
      target: () => doneRef.current!,
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

  const messages = [
    { title: 'Welcome message', description: 'Thanks for joining!' },
    { title: 'System update', description: 'New features available' },
    { title: 'Reminder', description: 'Complete your profile' },
  ];

  return (
    <>
      <Card
        title="Inbox"
        style={{ width: 400 }}
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button ref={searchRef} icon={<SearchOutlined />} size="small" data-testid="search-btn" />
            <Button ref={notificationsRef} icon={<BellOutlined />} size="small" data-testid="notifications-btn" />
          </div>
        }
        data-testid="inbox-card"
      >
        <div ref={overviewRef} data-testid="overview-section">
          <List
            size="small"
            dataSource={messages}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />
        </div>
        <div ref={doneRef} style={{ marginTop: 16, textAlign: 'center' }}>
          <p style={{ color: '#888' }}>End of messages</p>
        </div>
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        mask={true}
        data-testid="tour-inbox"
      />
    </>
  );
}
