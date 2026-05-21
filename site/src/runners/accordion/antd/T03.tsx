'use client';

/**
 * accordion-antd-T03: Release notes: collapse Overview
 * 
 * A centered isolated card titled "Release notes" contains an Ant Design Collapse in 
 * accordion mode with 3 panels: "Overview", "Breaking changes", and "Migration guide".
 * Initial state: "Overview" is expanded and shows a few paragraphs of text. The other 
 * panels are collapsed. The user can click the header row of "Overview" to collapse it.
 * 
 * Success: expanded_item_ids equals exactly: []
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string | string[]>('overview');

  useEffect(() => {
    const keys = Array.isArray(activeKey) ? activeKey : (activeKey ? [activeKey] : []);
    if (keys.length === 0) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  return (
    <Card title="Release notes" style={{ width: 550 }}>
      <Collapse
        accordion
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        data-testid="accordion-root"
        items={[
          {
            key: 'overview',
            label: 'Overview',
            children: (
              <div>
                <p>
                  This release includes several major improvements to the core functionality
                  of our platform. We&apos;ve focused on performance enhancements and user
                  experience refinements.
                </p>
                <p>
                  Key highlights include a new caching system, improved API response times,
                  and a refreshed user interface across all major modules.
                </p>
              </div>
            ),
          },
          {
            key: 'breaking_changes',
            label: 'Breaking changes',
            children: (
              <p>
                The authentication API now requires a new token format. Existing tokens
                will continue to work until the next major release.
              </p>
            ),
          },
          {
            key: 'migration_guide',
            label: 'Migration guide',
            children: (
              <p>
                Follow the step-by-step migration guide to update your application to
                the latest version without service interruption.
              </p>
            ),
          },
        ]}
      />
    </Card>
  );
}
