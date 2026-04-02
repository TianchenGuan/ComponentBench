'use client';

/**
 * tooltip-antd-T09: Open modal then show tooltip in dark theme
 *
 * DARK theme, comfortable spacing, modal_flow layout centered.
 * The main page shows a single button labeled "Advanced settings". Clicking it opens an AntD Modal.
 * Inside the modal there is a labeled field "API token" with a small info icon next to the label. That icon is wrapped in AntD Tooltip:
 * - Tooltip title: "Used to authenticate API requests."
 * - Trigger: hover (default)
 * The modal also contains other fields (Endpoint URL, Region) as clutter, but none of them have tooltips.
 * Initial state: modal closed; tooltip hidden until the modal is open and the icon is hovered.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Input, Form, Tooltip, ConfigProvider, theme } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('.ant-tooltip:not(.ant-tooltip-hidden)');
      if (tooltipContent && tooltipContent.textContent?.includes('Used to authenticate API requests.')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTooltip);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ padding: 24 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Advanced settings
        </Button>

        <Modal
          title="Advanced settings"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={400}
        >
          <Form layout="vertical">
            <Form.Item
              label={
                <span>
                  API token{' '}
                  <Tooltip title="Used to authenticate API requests.">
                    <InfoCircleOutlined
                      style={{ color: '#999', cursor: 'pointer' }}
                      data-testid="tooltip-trigger-api-token"
                    />
                  </Tooltip>
                </span>
              }
            >
              <Input placeholder="sk-xxxx" />
            </Form.Item>

            <Form.Item label="Endpoint URL">
              <Input placeholder="https://api.example.com" />
            </Form.Item>

            <Form.Item label="Region">
              <Input placeholder="us-east-1" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
