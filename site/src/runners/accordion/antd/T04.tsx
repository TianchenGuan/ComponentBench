'use client';

/**
 * accordion-antd-T04: Docs accordion: reset to all collapsed
 * 
 * A centered isolated card titled "Documentation sections" contains an Ant Design Collapse 
 * with accordion=false (multiple panels can be open). There are 4 panels: "Getting started", 
 * "API reference", "Examples", and "Changelog". Initial state: "Getting started" and 
 * "API reference" are expanded; the other two are collapsed. There is no dedicated 
 * 'collapse all' button; the only way is to toggle panels via their headers.
 * 
 * Success: expanded_item_ids equals exactly: []
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [activeKeys, setActiveKeys] = useState<string[]>(['getting_started', 'api_reference']);

  useEffect(() => {
    if (activeKeys.length === 0) {
      onSuccess();
    }
  }, [activeKeys, onSuccess]);

  return (
    <Card title="Documentation sections" style={{ width: 550 }}>
      <Collapse
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(keys as string[])}
        data-testid="accordion-root"
        items={[
          {
            key: 'getting_started',
            label: 'Getting started',
            children: (
              <p>
                Learn how to set up your development environment and create your first project.
              </p>
            ),
          },
          {
            key: 'api_reference',
            label: 'API reference',
            children: (
              <p>
                Complete API documentation with examples and parameter descriptions.
              </p>
            ),
          },
          {
            key: 'examples',
            label: 'Examples',
            children: (
              <p>
                Browse through code examples and tutorials for common use cases.
              </p>
            ),
          },
          {
            key: 'changelog',
            label: 'Changelog',
            children: (
              <p>
                View the history of changes and updates to the platform.
              </p>
            ),
          },
        ]}
      />
    </Card>
  );
}
