'use client';

/**
 * dialog_modal-antd-T08: Close only the top modal in a stacked pair
 *
 * Layout: isolated_card centered, DARK theme.
 * The page loads with an Ant Design Modal already open:
 * - Outer modal title: "Settings"
 * - Outer body contains static text and a primary button labeled "Advanced options…"
 *
 * Clicking "Advanced options…" opens a SECOND Ant Design Modal (inner/topmost):
 * - Inner modal title: "Advanced options"
 * - Inner modal has a header close icon (×) in the top-right.
 * - Inner modal footer is hidden.
 *
 * Initial state: only the "Settings" modal is open.
 * Success: The inner 'Advanced options' modal is closed with close_reason='close_icon',
 *          while the outer 'Settings' modal remains open.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Modal, Typography, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text } = Typography;

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Settings: open');
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Settings',
      related_instances: {
        'Settings': { open: true },
        'Advanced options': { open: false },
      },
    };
  }, []);

  const handleOpenAdvanced = () => {
    setAdvancedOpen(true);
    setDebugInfo('Settings: open, Advanced options: open');
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Advanced options',
      related_instances: {
        'Settings': { open: true },
        'Advanced options': { open: true },
      },
    };
  };

  const handleCloseAdvanced = () => {
    setAdvancedOpen(false);
    setDebugInfo('Settings: open, Advanced options: closed');
    window.__cbModalState = {
      open: false,
      close_reason: 'close_icon',
      modal_instance: 'Advanced options',
      related_instances: {
        'Settings': { open: true },
        'Advanced options': { open: false },
      },
    };
    
    // Success when Advanced options is closed while Settings remains open
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
    setAdvancedOpen(false);
    setDebugInfo('Settings: closed');
    window.__cbModalState = {
      open: false,
      close_reason: 'close_icon',
      modal_instance: 'Settings',
      related_instances: {
        'Settings': { open: false },
        'Advanced options': { open: false },
      },
    };
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div style={{ background: '#141414', padding: 24, minHeight: '100%' }}>
        <Card title="Dashboard" style={{ width: 400, background: '#1f1f1f' }}>
          <Paragraph style={{ color: '#fff' }}>
            Manage your application settings.
          </Paragraph>
        </Card>

        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          {debugInfo}
        </Text>

        <Modal
          title="Settings"
          open={settingsOpen}
          onCancel={handleCloseSettings}
          footer={null}
          maskClosable={false}
          data-testid="modal-settings"
        >
          <Paragraph>
            Configure your general application settings here. For more detailed 
            configuration options, click the button below.
          </Paragraph>
          <Button
            type="primary"
            onClick={handleOpenAdvanced}
            data-testid="cb-open-advanced"
          >
            Advanced options…
          </Button>
        </Modal>

        <Modal
          title="Advanced options"
          open={advancedOpen}
          onCancel={handleCloseAdvanced}
          footer={null}
          data-testid="modal-advanced-options"
        >
          <Paragraph>
            These are advanced configuration options. Only modify these settings 
            if you know what you&apos;re doing.
          </Paragraph>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
