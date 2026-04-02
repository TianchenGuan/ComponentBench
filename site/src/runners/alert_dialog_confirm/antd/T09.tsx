'use client';

/**
 * alert_dialog_confirm-antd-T09: Confirm a factory reset from inside a drawer flow
 *
 * Drawer-flow layout. The main page shows a header and a single button labeled "Advanced settings".
 *
 * Clicking "Advanced settings" opens an Ant Design Drawer from the right. Inside the drawer:
 * - There are several non-functional toggles and dropdowns (distractors) above.
 * - At the bottom, a "Danger Zone" subsection contains one button labeled "Factory reset…".
 *
 * Clicking "Factory reset…" opens an Ant Design Modal.confirm (over the drawer) with:
 * - Title: "Factory reset?"
 * - Body: "This will reset all local settings."
 * - Buttons: "Cancel" and "Confirm" (danger-styled).
 *
 * The task requires confirming the factory reset. The outer drawer remaining open/closed is irrelevant; success depends only on the confirm dialog action.
 */

import React, { useRef, useState } from 'react';
import { Card, Button, Drawer, Modal, Switch, Select, Typography, Divider, message } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleFactoryReset = () => {
    Modal.confirm({
      title: 'Factory reset?',
      content: 'This will reset all local settings.',
      okText: 'Confirm',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, 'data-testid': 'cb-confirm' } as any,
      cancelButtonProps: { 'data-testid': 'cb-cancel' } as any,
      onOk: () => {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          window.__cbDialogState = {
            dialog_open: false,
            last_action: 'confirm',
            dialog_instance: 'factory_reset',
          };
          message.info('Action recorded');
          onSuccess();
        }
      },
      onCancel: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: 'factory_reset',
        };
      },
    });

    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'factory_reset',
    };
  };

  return (
    <>
      <Card style={{ width: 300 }}>
        <Button
          type="primary"
          onClick={() => setDrawerOpen(true)}
          data-testid="cb-open-advanced-settings"
        >
          Advanced settings
        </Button>
      </Card>

      <Drawer
        title="Advanced settings"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={350}
        data-testid="drawer-advanced-settings"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Auto-save</Text>
            <Switch defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Theme</Text>
            <Select defaultValue="system" style={{ width: 120 }}>
              <Select.Option value="light">Light</Select.Option>
              <Select.Option value="dark">Dark</Select.Option>
              <Select.Option value="system">System</Select.Option>
            </Select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Animations</Text>
            <Switch defaultChecked />
          </div>
        </div>

        <Divider />

        <div>
          <Title level={5} style={{ color: '#ff4d4f' }}>Danger Zone</Title>
          <Button
            danger
            onClick={handleFactoryReset}
            data-testid="cb-open-factory-reset"
          >
            Factory reset…
          </Button>
        </div>
      </Drawer>
    </>
  );
}
