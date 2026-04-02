'use client';

/**
 * tour_teaching_tip-antd-T23: High-clutter dashboard: reach Permissions in Admin Tour (3 instances)
 *
 * setup_description:
 * A busy admin dashboard fills the page (light theme, comfortable spacing) with high clutter: a left navigation, a header bar, KPI cards, a user table, and a permissions panel.
 * There are three separate tour launchers visible in the header area:
 * - "User Tour" button
 * - "Manager Tour" button
 * - "Admin Tour" button
 * Each button controls its own AntD Tour instance (instances=3). Only one tour should be open for success.
 * The Admin Tour has 6 steps with titles:
 * "Admin overview" → "User table" → "Bulk actions" → "Role editor" → "Permissions" → "Audit log".
 * Initial state: all tours closed. Tour uses mask=true and standard Next/Previous; close icon enabled.
 *
 * success_trigger: The active Tour instance is Admin Tour, tour overlay is open, current step title is "Permissions", current step index equals 4.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Table, Space, Statistic, Row, Col, Menu } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T23({ task, onSuccess }: TaskComponentProps) {
  const [userTourOpen, setUserTourOpen] = useState(false);
  const [managerTourOpen, setManagerTourOpen] = useState(false);
  const [adminTourOpen, setAdminTourOpen] = useState(false);
  const [userCurrent, setUserCurrent] = useState(0);
  const [managerCurrent, setManagerCurrent] = useState(0);
  const [adminCurrent, setAdminCurrent] = useState(0);
  const successCalledRef = useRef(false);

  // Admin Tour refs
  const adminOverviewRef = useRef<HTMLDivElement>(null);
  const userTableRef = useRef<HTMLDivElement>(null);
  const bulkActionsRef = useRef<HTMLDivElement>(null);
  const roleEditorRef = useRef<HTMLDivElement>(null);
  const permissionsRef = useRef<HTMLDivElement>(null);
  const auditLogRef = useRef<HTMLDivElement>(null);

  // Header refs for other tours
  const userAreaRef = useRef<HTMLDivElement>(null);
  const managerAreaRef = useRef<HTMLDivElement>(null);

  const userSteps: TourProps['steps'] = [
    { title: 'User basics', description: 'Learn user basics.', target: () => userAreaRef.current! },
  ];

  const managerSteps: TourProps['steps'] = [
    { title: 'Manager tools', description: 'Manager-specific tools.', target: () => managerAreaRef.current! },
  ];

  const adminSteps: TourProps['steps'] = [
    { title: 'Admin overview', description: 'Overview of admin capabilities.', target: () => adminOverviewRef.current! },
    { title: 'User table', description: 'Manage all users from this table.', target: () => userTableRef.current! },
    { title: 'Bulk actions', description: 'Perform bulk operations.', target: () => bulkActionsRef.current! },
    { title: 'Role editor', description: 'Edit user roles.', target: () => roleEditorRef.current! },
    { title: 'Permissions', description: 'Configure detailed permissions.', target: () => permissionsRef.current! },
    { title: 'Audit log', description: 'Review system audit logs.', target: () => auditLogRef.current! },
  ];

  useEffect(() => {
    if (adminTourOpen && adminCurrent === 4 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Permissions') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [adminTourOpen, adminCurrent, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (adminTourOpen && adminCurrent === 4 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Permissions') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [adminTourOpen, adminCurrent, onSuccess]);

  const closeAllTours = () => {
    setUserTourOpen(false);
    setManagerTourOpen(false);
    setAdminTourOpen(false);
  };

  const userData = [
    { key: '1', name: 'Alice', role: 'Admin', status: 'Active' },
    { key: '2', name: 'Bob', role: 'Manager', status: 'Active' },
    { key: '3', name: 'Charlie', role: 'User', status: 'Inactive' },
    { key: '4', name: 'Diana', role: 'User', status: 'Active' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <>
      <div style={{ display: 'flex', width: 900 }} data-testid="admin-dashboard">
        {/* Left navigation */}
        <div style={{ width: 180, background: '#001529', minHeight: 500 }}>
          <Menu
            mode="vertical"
            theme="dark"
            defaultSelectedKeys={['1']}
            items={[
              { key: '1', label: 'Dashboard' },
              { key: '2', label: 'Users' },
              { key: '3', label: 'Settings' },
              { key: '4', label: 'Reports' },
            ]}
          />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: 16 }}>
          {/* Header with tour buttons */}
          <div
            ref={adminOverviewRef}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              padding: '12px 16px',
              background: '#fff',
              borderRadius: 8,
            }}
            data-testid="dashboard-header"
          >
            <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
            <Space>
              <div ref={userAreaRef}>
                <Button
                  onClick={() => { closeAllTours(); setUserTourOpen(true); setUserCurrent(0); }}
                  data-testid="user-tour-btn"
                >
                  User Tour
                </Button>
              </div>
              <div ref={managerAreaRef}>
                <Button
                  onClick={() => { closeAllTours(); setManagerTourOpen(true); setManagerCurrent(0); }}
                  data-testid="manager-tour-btn"
                >
                  Manager Tour
                </Button>
              </div>
              <Button
                type="primary"
                onClick={() => { closeAllTours(); setAdminTourOpen(true); setAdminCurrent(0); }}
                data-testid="admin-tour-btn"
              >
                Admin Tour
              </Button>
            </Space>
          </div>

          {/* KPI Cards */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Card size="small"><Statistic title="Total Users" value={1234} /></Card>
            </Col>
            <Col span={8}>
              <Card size="small"><Statistic title="Active Sessions" value={89} /></Card>
            </Col>
            <Col span={8}>
              <Card size="small"><Statistic title="Pending Approvals" value={12} /></Card>
            </Col>
          </Row>

          {/* User Table with bulk actions */}
          <Card size="small" style={{ marginBottom: 16 }}>
            <div ref={bulkActionsRef} style={{ marginBottom: 8 }} data-testid="bulk-actions">
              <Space>
                <Button size="small">Select All</Button>
                <Button size="small">Delete Selected</Button>
                <Button size="small">Export</Button>
              </Space>
            </div>
            <div ref={userTableRef} data-testid="user-table">
              <Table dataSource={userData} columns={columns} pagination={false} size="small" />
            </div>
          </Card>

          {/* Role Editor and Permissions */}
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="Role Editor" ref={roleEditorRef} data-testid="role-editor">
                <p style={{ color: '#666' }}>Admin, Manager, User roles</p>
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="Permissions" ref={permissionsRef} data-testid="permissions-panel">
                <p style={{ color: '#666' }}>Read, Write, Delete permissions</p>
              </Card>
            </Col>
          </Row>

          {/* Audit Log */}
          <Card size="small" title="Audit Log" style={{ marginTop: 16 }} ref={auditLogRef} data-testid="audit-log">
            <p style={{ color: '#666' }}>Recent system events...</p>
          </Card>
        </div>
      </div>

      <Tour open={userTourOpen} onClose={() => setUserTourOpen(false)} current={userCurrent} onChange={setUserCurrent} steps={userSteps} mask={true} data-testid="tour-user" />
      <Tour open={managerTourOpen} onClose={() => setManagerTourOpen(false)} current={managerCurrent} onChange={setManagerCurrent} steps={managerSteps} mask={true} data-testid="tour-manager" />
      <Tour open={adminTourOpen} onClose={() => setAdminTourOpen(false)} current={adminCurrent} onChange={setAdminCurrent} steps={adminSteps} mask={true} data-testid="tour-admin" />
    </>
  );
}
