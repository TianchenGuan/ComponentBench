'use client';

/**
 * link-antd-T10: Open Audit Log from a More actions link popover
 * 
 * setup_description:
 * A modal_flow scene anchored near the bottom-right of the viewport shows a small card
 * titled "User Access". In the card header, there is an Ant Design Typography.Link
 * labeled "More actions" that triggers a popover menu.
 * 
 * Initial state: popover closed. Activating "More actions" opens a small popover
 * containing two link-style actions implemented as Typography.Link rows:
 * - "Role assignments"
 * - "Audit log"
 * 
 * Clicking "Audit log" opens a right-side Drawer overlay titled "Audit Log".
 * 
 * success_trigger:
 * - The "Audit log" link inside the More actions popover (data-testid="action-audit-log") was activated.
 * - The Audit Log drawer is visible (data-testid="drawer-audit-log").
 * - The "Audit log" link reflects the open state (aria-expanded="true").
 */

import React, { useState } from 'react';
import { Card, Typography, Popover, Drawer } from 'antd';
import type { TaskComponentProps } from '../types';

const { Link, Title, Paragraph } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activated, setActivated] = useState(false);

  const handleAuditLogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setPopoverOpen(false);
    setDrawerOpen(true);
    setActivated(true);
    onSuccess();
  };

  const handleRoleAssignmentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Distractor - does nothing
  };

  const popoverContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 150 }}>
      <Link
        onClick={handleRoleAssignmentsClick}
        data-testid="action-role-assignments"
        style={{ cursor: 'pointer' }}
      >
        Role assignments
      </Link>
      <Link
        onClick={handleAuditLogClick}
        data-testid="action-audit-log"
        aria-expanded={drawerOpen}
        style={{ cursor: 'pointer' }}
      >
        Audit log
      </Link>
    </div>
  );

  return (
    <>
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>User Access</span>
            <Popover
              content={popoverContent}
              trigger="click"
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
              placement="bottomRight"
            >
              <Link
                data-testid="action-more"
                aria-expanded={popoverOpen}
                aria-haspopup="menu"
                style={{ cursor: 'pointer', fontSize: 14 }}
              >
                More actions
              </Link>
            </Popover>
          </div>
        }
        style={{ width: 350 }}
      >
        <Paragraph>
          Manage user roles and permissions for your organization.
        </Paragraph>
        <Paragraph type="secondary">
          Users: 12 active
        </Paragraph>
      </Card>

      <Drawer
        title="Audit Log"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-testid="drawer-audit-log"
        width={400}
      >
        <div style={{ padding: 0 }}>
          <Title level={5}>Recent Activity</Title>
          <Paragraph>
            • User john@example.com logged in at 10:30 AM
          </Paragraph>
          <Paragraph>
            • User jane@example.com updated role permissions at 9:45 AM
          </Paragraph>
          <Paragraph>
            • Admin user added new member at 9:00 AM
          </Paragraph>
        </div>
      </Drawer>
    </>
  );
}
