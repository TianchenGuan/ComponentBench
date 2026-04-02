'use client';

/**
 * tour_teaching_tip-antd-T29: Visual-only icon indicators: select rocket step
 *
 * setup_description:
 * A centered isolated card titled "Icon Tour" is shown in light theme with compact spacing (tighter padding than default).
 * A "Target" reference panel above the start button shows ONLY a single icon: a rocket (🚀), with no text caption (guidance=visual).
 * The Tour is initially closed and is opened via a button labeled "Begin Icon Tour".
 * When open, the Tour renders a custom indicator row consisting of icon-only buttons (no text): 🏠, 🔍, 🔔, ⚙️, 🚀, ✅ (6 steps total).
 * Clicking an icon jumps directly to that step. Step titles exist but are not used for guidance; the correct step is the one whose indicator icon matches the Target panel (🚀).
 *
 * success_trigger: Tour overlay is open, current step's cover matches reference (rocket), current step title is "Rocket features".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, ConfigProvider } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

const icons = ['🏠', '🔍', '🔔', '⚙️', '🚀', '✅'];
const stepTitles = ['Home', 'Search', 'Notifications', 'Settings', 'Rocket features', 'Complete'];

export default function T29({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const refs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const steps: TourProps['steps'] = stepTitles.map((title, index) => ({
    title,
    description: `${title} description.`,
    cover: (
      <div style={{ textAlign: 'center', padding: 16, fontSize: 40 }} data-cover-id={icons[index]}>
        {icons[index]}
      </div>
    ),
    target: () => refs[index].current!,
  }));

  useEffect(() => {
    if (open && current === 4 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Rocket features') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 4 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Rocket features') {
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
    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      {icons.map((icon, index) => (
        <button
          key={index}
          onClick={() => setCurrent(index)}
          aria-label={`Step ${index + 1}: ${stepTitles[index]}`}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: index === currentStep ? '2px solid #1677ff' : '1px solid #d9d9d9',
            background: index === currentStep ? '#e6f4ff' : '#fff',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          data-testid={`icon-indicator-${index}`}
        >
          {icon}
        </button>
      ))}
    </div>
  );

  return (
    <ConfigProvider componentSize="small">
      {/* Target reference panel */}
      <div
        style={{
          width: 60,
          height: 60,
          background: '#f5f5f5',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          marginBottom: 16,
          border: '2px dashed #d9d9d9',
        }}
        data-testid="ref-icon-rocket"
      >
        🚀
      </div>

      <Card
        title="Icon Tour"
        size="small"
        style={{ width: 300 }}
        bodyStyle={{ padding: 12 }}
        data-testid="icon-tour-card"
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {stepTitles.map((title, index) => (
            <div
              key={index}
              ref={refs[index]}
              style={{
                padding: '4px 8px',
                background: '#fafafa',
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              {icons[index]} {title}
            </div>
          ))}
        </div>

        <Button
          type="primary"
          size="small"
          onClick={() => { setOpen(true); setCurrent(0); }}
          data-testid="begin-icon-tour-btn"
        >
          Begin Icon Tour
        </Button>
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        indicatorsRender={indicatorsRender}
        data-testid="tour-icon"
      />
    </ConfigProvider>
  );
}
