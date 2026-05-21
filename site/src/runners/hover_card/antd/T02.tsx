'use client';

/**
 * hover_card-antd-T02: Open promo code help hover card
 *
 * Layout: form_section centered on a light theme. Comfortable spacing, default scale.
 *
 * The page shows a checkout form section with multiple labeled fields (Name, Email, Promo code, Notes).
 * - Only the "Promo code" label has a tiny circular "?" icon immediately to its right; that icon is the hover target.
 * - Hovering opens an AntD Popover that looks like a small card containing two lines:
 *   "Promo codes are case-sensitive." and "Example: SAVE10".
 * - The Popover includes a title "Promo code help" and a subtle close "x" icon, but no click is required.
 *
 * Clutter: low (other inputs and buttons are visible but irrelevant to success).
 */

import React, { useEffect, useRef } from 'react';
import { Card, Popover, Input, Typography, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkHoverCard = () => {
      const popoverContent = document.querySelector('.ant-popover:not(.ant-popover-hidden)');
      if (popoverContent && popoverContent.textContent?.includes('Promo codes are case-sensitive')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkHoverCard);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const hoverCardContent = (
    <div style={{ maxWidth: 220 }} data-testid="hover-card-content" data-cb-instance="Promo code help">
      <p style={{ margin: '0 0 8px' }}>Promo codes are case-sensitive.</p>
      <p style={{ margin: 0, color: '#666' }}>Example: SAVE10</p>
    </div>
  );

  return (
    <Card title="Checkout" style={{ width: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Text style={{ display: 'block', marginBottom: 4 }}>Name</Text>
          <Input placeholder="Enter your name" />
        </div>
        <div>
          <Text style={{ display: 'block', marginBottom: 4 }}>Email</Text>
          <Input placeholder="Enter your email" type="email" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Text>Promo code</Text>
            <Popover 
              content={hoverCardContent} 
              title="Promo code help"
              trigger="hover"
            >
              <QuestionCircleOutlined
                data-testid="promo-help-trigger"
                aria-label="Promo code help"
                style={{ cursor: 'pointer', color: '#999', fontSize: 14 }}
              />
            </Popover>
          </div>
          <Input placeholder="Enter promo code" />
        </div>
        <div>
          <Text style={{ display: 'block', marginBottom: 4 }}>Notes</Text>
          <Input.TextArea placeholder="Order notes (optional)" rows={2} />
        </div>
        <Button type="primary">Submit Order</Button>
      </div>
    </Card>
  );
}
