'use client';

/**
 * popover-antd-T03: Close Order notes popover (click outside)
 *
 * Baseline isolated card centered in the viewport.
 * A button labeled 'Order notes' is the Popover target.
 * AntD Popover is configured as controlled with open=true on initial load, so the popover is already visible.
 * Popover title is 'Order notes' and the body contains two short lines of text.
 * The popover uses default dismiss behavior: clicking outside the popover closes it.
 * Initial state: popover is open.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Popover, Button } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const successCalledRef = useRef(false);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    // Wait for initial render before starting to check
    const timeout = setTimeout(() => {
      initialCheckDone.current = true;
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const checkPopover = () => {
      if (!initialCheckDone.current) return;
      
      const popoverContent = document.querySelector('.ant-popover:not(.ant-popover-hidden)');
      if (!popoverContent && !open) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkPopover);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Also check on open state change
    if (initialCheckDone.current && !open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }

    return () => observer.disconnect();
  }, [onSuccess, open]);

  const popoverContent = (
    <div style={{ maxWidth: 250 }} data-testid="popover-order-notes">
      <p style={{ margin: '0 0 8px' }}>Please leave packages at the front door.</p>
      <p style={{ margin: 0 }}>Ring doorbell upon delivery.</p>
    </div>
  );

  return (
    <Card title="Order details" style={{ width: 350 }}>
      <Popover
        content={popoverContent}
        title="Order notes"
        trigger="click"
        open={open}
        onOpenChange={setOpen}
      >
        <Button data-testid="popover-target-order-notes">Order notes</Button>
      </Popover>
    </Card>
  );
}
