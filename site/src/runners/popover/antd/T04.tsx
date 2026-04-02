'use client';

/**
 * popover-antd-T04: Open Keyboard shortcuts popover (focus trigger)
 *
 * Baseline isolated card centered in the viewport.
 * The card contains two focusable controls in order: a 'Continue' button and a 'Keyboard shortcuts' button.
 * The 'Keyboard shortcuts' button is wrapped with AntD Popover configured with trigger=['focus'].
 * Popover title is 'Keyboard shortcuts' and content lists 3 shortcuts in plain text.
 * Initial state: popover is closed; no element is focused when the page loads.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Popover, Button } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkPopover = () => {
      const popoverContent = document.querySelector('.ant-popover:not(.ant-popover-hidden)');
      if (popoverContent && popoverContent.textContent?.includes('Keyboard shortcuts')) {
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
    <div style={{ maxWidth: 250 }} data-testid="popover-keyboard-shortcuts">
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        <li>Ctrl+S - Save</li>
        <li>Ctrl+Z - Undo</li>
        <li>Ctrl+Shift+Z - Redo</li>
      </ul>
    </div>
  );

  return (
    <Card title="Actions" style={{ width: 350 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button type="primary">Continue</Button>
        <Popover
          content={popoverContent}
          title="Keyboard shortcuts"
          trigger="focus"
        >
          <Button data-testid="popover-target-keyboard-shortcuts">
            Keyboard shortcuts
          </Button>
        </Popover>
      </div>
    </Card>
  );
}
