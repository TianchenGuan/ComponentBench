'use client';

/**
 * toast_snackbar-antd-T07: Dismiss the Secondary notification in a two-toast stack
 *
 * setup_description:
 * Scene is a simple form section titled "Payment methods" with a few read-only fields (card brand, last4) shown as background context.
 * Two Ant Design **notifications** are visible at load and are stacked in the same corner:
 * 1) **Primary** notification — Title: "Primary • Card updated", Description: "Visa ending 4242."
 * 2) **Secondary** notification — Title: "Secondary • Card updated", Description: "Visa ending 4242."
 * Each notification has its own close (×) icon. The task targets the Secondary notification only.
 *
 * success_trigger:
 * - The notification titled "Secondary • Card updated" is not visible.
 * - The notification titled "Primary • Card updated" remains visible.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, notification } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [api, contextHolder] = notification.useNotification();
  const successCalledRef = useRef(false);
  const notificationsShownRef = useRef(false);
  const [primaryVisible, setPrimaryVisible] = useState(true);
  const [secondaryVisible, setSecondaryVisible] = useState(true);

  // Show both notifications on mount
  useEffect(() => {
    if (!notificationsShownRef.current) {
      notificationsShownRef.current = true;

      // Primary notification
      api.info({
        key: 'primary-notification',
        message: <span data-testid="toast-title-primary" data-toast-title="Primary • Card updated">Primary • Card updated</span>,
        description: <span data-testid="toast-text-primary">Visa ending 4242.</span>,
        placement: 'topRight',
        duration: 0,
        onClose: () => setPrimaryVisible(false),
      });

      // Secondary notification (target for dismissal)
      setTimeout(() => {
        api.info({
          key: 'secondary-notification',
          message: <span data-testid="toast-title-secondary" data-toast-title="Secondary • Card updated">Secondary • Card updated</span>,
          description: <span data-testid="toast-text-secondary">Visa ending 4242.</span>,
          placement: 'topRight',
          duration: 0,
          onClose: () => setSecondaryVisible(false),
        });
      }, 100);
    }
  }, [api]);

  // Check success condition: Secondary dismissed, Primary still visible
  useEffect(() => {
    if (!secondaryVisible && primaryVisible && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [primaryVisible, secondaryVisible, onSuccess]);

  return (
    <>
      {contextHolder}
      <Card title="Payment methods" style={{ width: 400 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Card brand</Text>
            <div><Text>Visa</Text></div>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Last 4 digits</Text>
            <div><Text>4242</Text></div>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Expires</Text>
            <div><Text>12/2026</Text></div>
          </div>
        </div>
      </Card>
    </>
  );
}
