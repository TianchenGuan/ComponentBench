'use client';

/**
 * popover-antd-T02: Reveal Estimated tax popover (hover)
 *
 * Baseline isolated card centered in the viewport.
 * The card is titled 'Checkout totals' with rows: Subtotal, Estimated tax, Total.
 * A small info icon appears immediately to the right of the 'Estimated tax' label.
 * AntD Popover is configured with trigger='hover' (default) and a small mouseEnterDelay (0.1s).
 * Popover content is a short sentence explaining that the final tax is calculated at checkout.
 * Initial state: the popover is closed.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Popover, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkPopover = () => {
      const popoverContent = document.querySelector('.ant-popover:not(.ant-popover-hidden)');
      if (popoverContent && popoverContent.textContent?.includes('final tax is calculated')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkPopover);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const popoverContent = (
    <div style={{ maxWidth: 250 }} data-testid="popover-estimated-tax">
      <p style={{ margin: 0 }}>The final tax is calculated at checkout based on your billing address.</p>
    </div>
  );

  return (
    <Card title="Checkout totals" style={{ width: 350 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Subtotal</Text>
          <Text>$99.00</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text>Estimated tax</Text>
            <Popover
              content={popoverContent}
              title="Estimated tax"
              trigger="hover"
              mouseEnterDelay={0.1}
            >
              <InfoCircleOutlined
                data-testid="popover-target-estimated-tax"
                style={{ cursor: 'pointer', color: '#1677ff' }}
              />
            </Popover>
          </div>
          <Text>$8.91</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
          <Text strong>Total</Text>
          <Text strong>$107.91</Text>
        </div>
      </div>
    </Card>
  );
}
