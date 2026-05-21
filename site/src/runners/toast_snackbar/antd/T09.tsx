'use client';

/**
 * toast_snackbar-antd-T09: Match reference: trigger the Error-style notification (icon-only triggers)
 *
 * setup_description:
 * Scene is an isolated card titled "Toast style gallery" rendered in **dark theme** and **small scale**.
 * At the top of the card there is a non-interactive sample labeled "Target sample". The sample shows the **Error** styling (error icon + red accent) with the label "Error".
 * Below the sample are four small icon-only circular buttons (no text labels). Each button triggers an Ant Design **notification** variant:
 * - Success → notification title "Success ping"
 * - Info → notification title "Info ping"
 * - Warning → notification title "Warning ping"
 * - Error → notification title "Error ping"
 * All notifications share the same description text "Style demo." and appear in the same corner. Only the error-styled notification matches the sample.
 *
 * success_trigger: A notification toast becomes visible with title exactly "Error ping" and kind/severity matches Error.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Button, Space, Typography, notification } from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [api, contextHolder] = notification.useNotification();
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkNotification = () => {
      const notificationTitle = document.querySelector('.ant-notification-notice-message');
      const notificationContainer = document.querySelector('.ant-notification-notice');
      if (
        notificationTitle?.textContent === 'Error ping' &&
        notificationContainer?.classList.contains('ant-notification-notice-error')
      ) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkNotification);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const handleSuccess = () => {
    api.success({
      message: <span data-testid="toast-title">Success ping</span>,
      description: <span data-testid="toast-text">Style demo.</span>,
      placement: 'topRight',
    });
  };

  const handleInfo = () => {
    api.info({
      message: <span data-testid="toast-title">Info ping</span>,
      description: <span data-testid="toast-text">Style demo.</span>,
      placement: 'topRight',
    });
  };

  const handleWarning = () => {
    api.warning({
      message: <span data-testid="toast-title">Warning ping</span>,
      description: <span data-testid="toast-text">Style demo.</span>,
      placement: 'topRight',
    });
  };

  const handleError = () => {
    api.error({
      message: <span data-testid="toast-title" data-kind="error">Error ping</span>,
      description: <span data-testid="toast-text">Style demo.</span>,
      placement: 'topRight',
    });
  };

  return (
    <>
      {contextHolder}
      <Card
        title="Toast style gallery"
        style={{ width: 350 }}
        size="small"
      >
        {/* Target sample */}
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase' }}>
            Target sample
          </Text>
          <div
            data-testid="target-sample"
            id="target_sample_error"
            style={{
              marginTop: 8,
              padding: '8px 12px',
              background: '#fff2f0',
              border: '1px solid #ffccc7',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
            <Text style={{ color: '#cf1322' }}>Error</Text>
          </div>
        </div>

        {/* Icon-only triggers */}
        <Space size="middle">
          <Button
            shape="circle"
            size="small"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            onClick={handleSuccess}
            data-testid="trigger-success"
            aria-label="Success"
          />
          <Button
            shape="circle"
            size="small"
            icon={<InfoCircleOutlined style={{ color: '#1677ff' }} />}
            onClick={handleInfo}
            data-testid="trigger-info"
            aria-label="Info"
          />
          <Button
            shape="circle"
            size="small"
            icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
            onClick={handleWarning}
            data-testid="trigger-warning"
            aria-label="Warning"
          />
          <Button
            shape="circle"
            size="small"
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            onClick={handleError}
            data-testid="trigger-error"
            aria-label="Error"
          />
        </Space>
      </Card>
    </>
  );
}
