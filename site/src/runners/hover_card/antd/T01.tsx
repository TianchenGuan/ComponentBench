'use client';

/**
 * hover_card-antd-T01: Open customer hover card
 *
 * Layout: isolated_card centered in the viewport on a light theme with comfortable spacing.
 *
 * The card shows a short "Recent Orders" list. The customer name "Ava Chen" is rendered as a link-like text chip that acts as the hover target.
 * - There is exactly one hover card on the page (no other hover previews).
 * - On hover, an AntD Popover appears as a small profile card with: avatar placeholder, email, and a "View profile" link (link is not required for success).
 * - No open/close delays beyond the library default.
 *
 * No additional clutter is present; the rest of the page is static text.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Popover, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text, Link } = Typography;

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkHoverCard = () => {
      const popoverContent = document.querySelector('.ant-popover:not(.ant-popover-hidden)');
      if (popoverContent && popoverContent.textContent?.includes('ava.chen@email.com')) {
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
    <div style={{ width: 200 }} data-testid="hover-card-content" data-cb-instance="Customer: Ava Chen">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Avatar size={40} icon={<UserOutlined />} />
        <div>
          <div style={{ fontWeight: 500 }}>Ava Chen</div>
          <div style={{ fontSize: 12, color: '#666' }}>ava.chen@email.com</div>
        </div>
      </div>
      <Link href="#" style={{ fontSize: 13 }}>View profile</Link>
    </div>
  );

  return (
    <Card title="Recent Orders" style={{ width: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>Customer</Text>
          <div>
            <Popover 
              content={hoverCardContent} 
              trigger="hover"
              data-testid="hover-card-trigger"
            >
              <span
                data-testid="customer-ava-chen"
                data-cb-instance="Customer: Ava Chen"
                style={{ 
                  color: '#1677ff', 
                  cursor: 'pointer',
                  padding: '2px 8px',
                  borderRadius: 4,
                  backgroundColor: '#f0f5ff'
                }}
              >
                Ava Chen
              </span>
            </Popover>
          </div>
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>Order #</Text>
          <div><Text>ORD-2024-0892</Text></div>
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>Status</Text>
          <div><Text>Shipped</Text></div>
        </div>
      </div>
    </Card>
  );
}
