'use client';

/**
 * tour_teaching_tip-antd-T12: Navigate to Export step in Reports Tour
 *
 * setup_description:
 * Same isolated_card scene with two Tour instances: "Dashboard Tour" and "Reports Tour" (light theme, comfortable spacing).
 * On page load, the "Reports Tour" is already open on step 1 titled "Reports overview"; the "Dashboard Tour" is closed.
 * The Reports Tour has 3 steps: "Reports overview" → "Filters" → "Export", with standard Next/Previous buttons and a visible step counter.
 * The task only concerns the open Reports Tour overlay.
 *
 * success_trigger: The active Tour instance is Reports Tour, tour overlay is open, current step title is "Export", current step index equals 2.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Space } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T12({ task, onSuccess }: TaskComponentProps) {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(true); // Reports tour open on load
  const [dashboardCurrent, setDashboardCurrent] = useState(0);
  const [reportsCurrent, setReportsCurrent] = useState(0); // Start at Reports overview
  const successCalledRef = useRef(false);

  // Dashboard tour refs
  const dashboardBtnRef = useRef<HTMLButtonElement>(null);
  const dashboardOverviewRef = useRef<HTMLDivElement>(null);

  // Reports tour refs
  const reportsBtnRef = useRef<HTMLButtonElement>(null);
  const reportsOverviewRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLButtonElement>(null);

  const dashboardSteps: TourProps['steps'] = [
    {
      title: 'Dashboard overview',
      description: 'This is your main dashboard overview.',
      target: () => dashboardOverviewRef.current!,
    },
    {
      title: 'Widgets',
      description: 'Customize your dashboard widgets here.',
      target: () => dashboardBtnRef.current!,
    },
  ];

  const reportsSteps: TourProps['steps'] = [
    {
      title: 'Reports overview',
      description: 'Access all your reports from this section.',
      target: () => reportsOverviewRef.current!,
    },
    {
      title: 'Filters',
      description: 'Use filters to narrow down your reports.',
      target: () => filtersRef.current!,
    },
    {
      title: 'Export',
      description: 'Export your reports in various formats.',
      target: () => exportRef.current!,
    },
  ];

  useEffect(() => {
    if (reportsOpen && reportsCurrent === 2 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Export') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [reportsOpen, reportsCurrent, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (reportsOpen && reportsCurrent === 2 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Export') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [reportsOpen, reportsCurrent, onSuccess]);

  return (
    <>
      <Space size="large">
        <Card title="Dashboard Tour" style={{ width: 280 }} data-testid="dashboard-tour-card">
          <div ref={dashboardOverviewRef} style={{ marginBottom: 16 }}>
            <p style={{ color: '#666' }}>Learn about your dashboard features.</p>
          </div>
          <Button
            ref={dashboardBtnRef}
            type="primary"
            onClick={() => {
              setReportsOpen(false);
              setDashboardOpen(true);
              setDashboardCurrent(0);
            }}
            data-testid="begin-dashboard-tour-btn"
          >
            Begin Dashboard Tour
          </Button>
        </Card>

        <Card title="Reports Tour" style={{ width: 280 }} data-testid="reports-tour-card">
          <div ref={reportsOverviewRef} style={{ marginBottom: 8 }}>
            <p style={{ color: '#666' }}>Discover reporting capabilities.</p>
          </div>
          <div ref={filtersRef} style={{ marginBottom: 16 }}>
            <p style={{ color: '#999', fontSize: 12 }}>Filters: Date, Status, Type</p>
          </div>
          <Space>
            <Button
              ref={reportsBtnRef}
              type="primary"
              data-testid="begin-reports-tour-btn"
            >
              Begin Reports Tour
            </Button>
            <Button ref={exportRef} data-testid="export-btn">
              Export
            </Button>
          </Space>
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
        open={reportsOpen}
        onClose={() => setReportsOpen(false)}
        current={reportsCurrent}
        onChange={setReportsCurrent}
        steps={reportsSteps}
        data-testid="tour-reports"
      />
    </>
  );
}
