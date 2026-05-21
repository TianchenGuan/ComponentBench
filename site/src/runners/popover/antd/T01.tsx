'use client';

/**
 * popover-antd-T01: Open Shipping cost popover (click)
 *
 * Baseline isolated card centered in the viewport.
 * The card is titled 'Order summary' and contains a short list of line items (Subtotal, Shipping cost, Tax).
 * Next to the 'Shipping cost' label there is a small circular info icon. It is the Popover target.
 * AntD Popover is configured with trigger='click' so the card stays open until dismissed.
 * Popover content includes a short paragraph explaining how shipping is calculated and a 'Learn more' link.
 * Initial state: the popover is closed.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Popover, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkPopover = () => {
      const popoverContent = document.querySelector('.ant-popover:not(.ant-popover-hidden)');
      if (popoverContent && popoverContent.textContent?.includes('Shipping is calculated')) {
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
    <div style={{ maxWidth: 250 }} data-testid="popover-shipping-cost">
      <p>Shipping is calculated based on your location and the weight of your order.</p>
      <a href="#learn-more">Learn more</a>
    </div>
  );

  return (
    <Card title="Order summary" style={{ width: 350 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Subtotal</Text>
          <Text>$49.99</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text>Shipping cost</Text>
            <Popover content={popoverContent} title="Shipping cost" trigger="click">
              <InfoCircleOutlined
                data-testid="popover-target-shipping-cost"
                style={{ cursor: 'pointer', color: '#1677ff' }}
              />
            </Popover>
          </div>
          <Text>$5.99</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Tax</Text>
          <Text>$4.50</Text>
        </div>
      </div>
    </Card>
  );
}
