'use client';

/**
 * popover-antd-T08: Open nested Limitations popover inside Plan details popover
 *
 * Isolated card centered in the viewport titled 'Subscription plan'.
 * There is a primary button labeled 'Plan details' that is wrapped with an AntD Popover (outer popover) using trigger='click'.
 * Outer popover title: 'Plan details' and body contains several lines of text.
 * Inside the outer popover body, the word 'Limitations' appears as an underlined link with its own AntD Popover (inner popover) configured with trigger='hover'.
 * The inner popover title is 'Limitations' and content lists two bullet points.
 * Initial state: both popovers are closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Popover, Button, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Link } = Typography;

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [outerOpen, setOuterOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkInnerPopover = () => {
      // Check for the inner popover (Limitations)
      const popovers = document.querySelectorAll('.ant-popover:not(.ant-popover-hidden)');
      let hasInnerPopover = false;
      let hasOuterPopover = false;
      
      popovers.forEach(popover => {
        const title = popover.querySelector('.ant-popover-title');
        if (title?.textContent?.includes('Limitations')) {
          hasInnerPopover = true;
        }
        if (title?.textContent?.includes('Plan details')) {
          hasOuterPopover = true;
        }
      });

      if (hasInnerPopover && hasOuterPopover && !successCalledRef.current) {
        successCalledRef.current = true;
        onSuccess();
      }
    };

    const observer = new MutationObserver(checkInnerPopover);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const innerPopoverContent = (
    <div style={{ maxWidth: 200 }} data-testid="popover-limitations">
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        <li>Maximum 5 users</li>
        <li>10GB storage limit</li>
      </ul>
    </div>
  );

  const outerPopoverContent = (
    <div style={{ maxWidth: 280 }} data-testid="popover-plan-details">
      <Text>Your current plan: <strong>Basic</strong></Text>
      <br /><br />
      <Text>Price: $9.99/month</Text>
      <br /><br />
      <Text>Features included: Dashboard, Reports, API access.</Text>
      <br /><br />
      <Text>
        View{' '}
        <Popover
          content={innerPopoverContent}
          title="Limitations"
          trigger="hover"
        >
          <Link data-testid="popover-target-limitations" style={{ textDecoration: 'underline' }}>
            Limitations
          </Link>
        </Popover>
        {' '}for this plan.
      </Text>
    </div>
  );

  return (
    <Card title="Subscription plan" style={{ width: 350 }}>
      <Text>Manage your subscription and billing settings.</Text>
      <div style={{ marginTop: 16 }}>
        <Popover
          content={outerPopoverContent}
          title="Plan details"
          trigger="click"
          open={outerOpen}
          onOpenChange={setOuterOpen}
        >
          <Button type="primary" data-testid="popover-target-plan-details">
            Plan details
          </Button>
        </Popover>
      </div>
    </Card>
  );
}
