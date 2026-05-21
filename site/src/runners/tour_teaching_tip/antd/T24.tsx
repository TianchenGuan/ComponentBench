'use client';

/**
 * tour_teaching_tip-antd-T24: Dark + visual reference: match Target illustration in Advanced Tour
 *
 * setup_description:
 * A dark-themed page shows two small cards (instances=2) titled "Basics Tour" and "Advanced Tour".
 * Each card has its own button ("Begin Basics Tour" / "Begin Advanced Tour"). Both tours are initially closed.
 * A separate "Target" reference panel is displayed above the cards showing ONLY an illustration (no text): a small shield-with-star icon on a colored background.
 * In the Advanced Tour, each step includes a cover illustration. Exactly one step uses the same shield-with-star illustration as the Target panel; other steps use similar but distinct icons (e.g., plain shield, lock, star).
 * The Advanced Tour has 5 steps; the matching cover appears on step titled "Security highlights" (title is visible in the Tour but not mentioned in the goal).
 * The Basics Tour has different covers and should not be used for success.
 *
 * success_trigger: The active Tour instance is Advanced Tour, tour overlay is open, current step matches reference (shield-star), current step title is "Security highlights".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Space } from 'antd';
import { SafetyCertificateOutlined, LockOutlined, StarOutlined, SecurityScanOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

// Custom shield-with-star icon
const ShieldStarIcon = () => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <SafetyCertificateOutlined style={{ fontSize: 40, color: '#1677ff' }} />
    <StarOutlined style={{ position: 'absolute', fontSize: 14, color: '#faad14', bottom: 8, right: -4 }} />
  </div>
);

export default function T24({ task, onSuccess }: TaskComponentProps) {
  const [basicsTourOpen, setBasicsTourOpen] = useState(false);
  const [advancedTourOpen, setAdvancedTourOpen] = useState(false);
  const [basicsCurrent, setBasicsCurrent] = useState(0);
  const [advancedCurrent, setAdvancedCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const basicsRef = useRef<HTMLDivElement>(null);
  const advancedRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);

  const basicsSteps: TourProps['steps'] = [
    {
      title: 'Getting started',
      description: 'Basic introduction.',
      cover: <div style={{ textAlign: 'center', padding: 16 }}><CheckCircleOutlined style={{ fontSize: 40, color: '#52c41a' }} /></div>,
      target: () => basicsRef.current!,
    },
  ];

  const advancedSteps: TourProps['steps'] = [
    {
      title: 'Advanced intro',
      description: 'Introduction to advanced features.',
      cover: <div style={{ textAlign: 'center', padding: 16 }} data-cover-id="lock"><LockOutlined style={{ fontSize: 40, color: '#1677ff' }} /></div>,
      target: () => step1Ref.current!,
    },
    {
      title: 'Data encryption',
      description: 'How data is encrypted.',
      cover: <div style={{ textAlign: 'center', padding: 16 }} data-cover-id="shield"><SecurityScanOutlined style={{ fontSize: 40, color: '#1677ff' }} /></div>,
      target: () => step2Ref.current!,
    },
    {
      title: 'Security highlights',
      description: 'Key security features.',
      cover: <div style={{ textAlign: 'center', padding: 16 }} data-cover-id="shield-star"><ShieldStarIcon /></div>,
      target: () => step3Ref.current!,
    },
    {
      title: 'Compliance',
      description: 'Compliance certifications.',
      cover: <div style={{ textAlign: 'center', padding: 16 }} data-cover-id="star"><StarOutlined style={{ fontSize: 40, color: '#faad14' }} /></div>,
      target: () => step4Ref.current!,
    },
    {
      title: 'Audit tools',
      description: 'Tools for auditing.',
      cover: <div style={{ textAlign: 'center', padding: 16 }} data-cover-id="safety"><SafetyCertificateOutlined style={{ fontSize: 40, color: '#52c41a' }} /></div>,
      target: () => step5Ref.current!,
    },
  ];

  useEffect(() => {
    if (advancedTourOpen && advancedCurrent === 2 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Security highlights') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [advancedTourOpen, advancedCurrent, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (advancedTourOpen && advancedCurrent === 2 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Security highlights') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [advancedTourOpen, advancedCurrent, onSuccess]);

  const closeAllTours = () => {
    setBasicsTourOpen(false);
    setAdvancedTourOpen(false);
  };

  return (
    <>
      {/* Target reference panel */}
      <div
        style={{
          width: 80,
          height: 80,
          background: '#2a2a2a',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          border: '2px solid #444',
        }}
        data-testid="ref-target-shield-star"
      >
        <ShieldStarIcon />
      </div>

      <Space size="large">
        <Card title="Basics Tour" style={{ width: 250 }} data-testid="basics-tour-card">
          <div ref={basicsRef} style={{ marginBottom: 16 }}>
            <p style={{ color: '#999' }}>Learn the basics.</p>
          </div>
          <Button
            onClick={() => { closeAllTours(); setBasicsTourOpen(true); setBasicsCurrent(0); }}
            data-testid="begin-basics-tour-btn"
          >
            Begin Basics Tour
          </Button>
        </Card>

        <Card title="Advanced Tour" style={{ width: 250 }} data-testid="advanced-tour-card">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div ref={step1Ref} style={{ padding: 4, background: '#333', borderRadius: 4 }}>Step 1</div>
            <div ref={step2Ref} style={{ padding: 4, background: '#333', borderRadius: 4 }}>Step 2</div>
            <div ref={step3Ref} style={{ padding: 4, background: '#333', borderRadius: 4 }}>Step 3</div>
            <div ref={step4Ref} style={{ padding: 4, background: '#333', borderRadius: 4 }}>Step 4</div>
            <div ref={step5Ref} style={{ padding: 4, background: '#333', borderRadius: 4 }}>Step 5</div>
          </Space>
          <Button
            type="primary"
            style={{ marginTop: 16 }}
            onClick={() => { closeAllTours(); setAdvancedTourOpen(true); setAdvancedCurrent(0); }}
            data-testid="begin-advanced-tour-btn"
          >
            Begin Advanced Tour
          </Button>
        </Card>
      </Space>

      <Tour open={basicsTourOpen} onClose={() => setBasicsTourOpen(false)} current={basicsCurrent} onChange={setBasicsCurrent} steps={basicsSteps} data-testid="tour-basics" />
      <Tour open={advancedTourOpen} onClose={() => setAdvancedTourOpen(false)} current={advancedCurrent} onChange={setAdvancedCurrent} steps={advancedSteps} data-testid="tour-advanced" />
    </>
  );
}
