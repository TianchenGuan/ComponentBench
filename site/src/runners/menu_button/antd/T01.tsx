'use client';

/**
 * menu_button-antd-T01: Open Account actions menu
 * 
 * Layout: isolated_card centered in the viewport. The card title reads "Account".
 * Inside the card there is a single AntD Button labeled "Account actions" with a down chevron;
 * it is the trigger for an AntD Dropdown. The dropdown opens on click and shows a small Menu
 * with three items: "View profile", "Billing", and "Sign out".
 * 
 * Initial state: the menu is closed, and no item is selected.
 * Success: The dropdown menu is open (aria-expanded=true).
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (open && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [open, successTriggered, onSuccess]);

  const menuItems = [
    { key: 'profile', label: 'View profile' },
    { key: 'billing', label: 'Billing' },
    { key: 'signout', label: 'Sign out' },
  ];

  return (
    <Card title="Account" style={{ width: 400 }}>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        open={open}
        onOpenChange={setOpen}
      >
        <Button
          data-testid="menu-button-account-actions"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          Account actions <DownOutlined />
        </Button>
      </Dropdown>
    </Card>
  );
}
