'use client';

/**
 * tour_teaching_tip-antd-T11: Open the Reports Tour (2 instances)
 *
 * setup_description:
 * An isolated_card scene in a light theme with comfortable spacing shows two feature cards side-by-side inside a single centered container.
 * Card A is titled "Dashboard Tour" with a button labeled "Begin Dashboard Tour".
 * Card B is titled "Reports Tour" with a button labeled "Begin Reports Tour".
 * Each button controls its own AntD Tour instance (instances=2); only one tour can be open at a time (opening one ensures the other stays closed).
 * Both tours are initially closed. The "Reports Tour" steps are:
 * 1) "Reports overview"
 * 2) "Filters"
 * 3) "Export"
 * Tour overlays use the default mask and close (×) icon.
 *
 * success_trigger: The active Tour instance is Reports Tour, tour overlay is open, current step title is "Reports overview", current step index equals 0.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Space } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T11({ task, onSuccess }: TaskComponentProps) {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [dashboardCurrent, setDashboardCurrent] = useState(0);
  const [reportsCurrent, setReportsCurrent] = useState(0);
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
    if (reportsOpen && reportsCurrent === 0 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Reports overview') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [reportsOpen, reportsCurrent, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (reportsOpen && reportsCurrent === 0 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Reports overview') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [reportsOpen, reportsCurrent, onSuccess]);

  const handleOpenDashboardTour = () => {
    setReportsOpen(false);
    setDashboardOpen(true);
    setDashboardCurrent(0);
  };

  const handleOpenReportsTour = () => {
    setDashboardOpen(false);
    setReportsOpen(true);
    setReportsCurrent(0);
  };

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
            onClick={handleOpenDashboardTour}
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
              onClick={handleOpenReportsTour}
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
