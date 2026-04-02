'use client';

/**
 * tooltip-antd-T05: Open the Password help tooltip in a form
 *
 * Light theme, comfortable spacing, form_section layout centered.
 * A small "Account" form includes labeled inputs for Email and Password, plus a "Create account" button (not required for success).
 * There are TWO AntD Tooltip instances:
 * 1) Email label has an info icon with tooltip title "We'll send receipts to this address."
 * 2) Password label has an info icon with tooltip title "Use at least 12 characters".
 * Both tooltips use default hover trigger and appear on small icons placed close to their labels.
 * Initial state: no tooltip visible.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Tooltip, Button, Input, Form } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('.ant-tooltip:not(.ant-tooltip-hidden)');
      if (tooltipContent && tooltipContent.textContent?.includes('Use at least 12 characters')) {
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
    <Card title="Account" style={{ width: 350 }}>
      <Form layout="vertical">
        <Form.Item
          label={
            <span>
              Email{' '}
              <Tooltip title="We'll send receipts to this address.">
                <InfoCircleOutlined
                  style={{ color: '#999', cursor: 'pointer' }}
                  data-testid="tooltip-trigger-email"
                />
              </Tooltip>
            </span>
          }
        >
          <Input placeholder="you@example.com" />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Password{' '}
              <Tooltip title="Use at least 12 characters">
                <InfoCircleOutlined
                  style={{ color: '#999', cursor: 'pointer' }}
                  data-testid="tooltip-trigger-password"
                />
              </Tooltip>
            </span>
          }
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" block>
            Create account
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
