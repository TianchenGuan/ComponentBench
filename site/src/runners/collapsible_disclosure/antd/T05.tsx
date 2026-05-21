'use client';

/**
 * collapsible_disclosure-antd-T05: Docs list: scroll and open API limits
 * 
 * The page shows a centered documentation card with a fixed-height scroll area.
 * 
 * - Layout: isolated_card, centered.
 * - Component: one AntD Collapse with 12 panels inside a div with its own vertical scroll (overflow:auto, height ~320px).
 * - Panel headers include (among others): "Authentication", "Endpoints", "Rate limits", "API limits", "Webhooks", "Errors".
 * - Initial state: all panels collapsed.
 * - Not all headers are visible at once; you must scroll within the card to bring "API limits" into view.
 * - There are no other interactive distractors.
 * 
 * Success: expanded_panel includes "API limits"
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string[]>([]);

  useEffect(() => {
    if (activeKey.includes('api_limits')) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  const items = [
    {
      key: 'getting_started',
      label: 'Getting started',
      children: <p>Learn how to get started with our API.</p>,
    },
    {
      key: 'authentication',
      label: 'Authentication',
      children: <p>Authentication methods and API keys.</p>,
    },
    {
      key: 'endpoints',
      label: 'Endpoints',
      children: <p>Available API endpoints and their usage.</p>,
    },
    {
      key: 'request_format',
      label: 'Request format',
      children: <p>How to format your API requests.</p>,
    },
    {
      key: 'response_format',
      label: 'Response format',
      children: <p>Understanding API response formats.</p>,
    },
    {
      key: 'rate_limits',
      label: 'Rate limits',
      children: <p>Rate limiting policies for API requests.</p>,
    },
    {
      key: 'api_limits',
      label: 'API limits',
      children: <p>API usage limits and quotas for your account tier.</p>,
    },
    {
      key: 'webhooks',
      label: 'Webhooks',
      children: <p>Setting up and managing webhooks.</p>,
    },
    {
      key: 'errors',
      label: 'Errors',
      children: <p>Common error codes and troubleshooting.</p>,
    },
    {
      key: 'pagination',
      label: 'Pagination',
      children: <p>How to paginate through large result sets.</p>,
    },
    {
      key: 'versioning',
      label: 'Versioning',
      children: <p>API versioning and backward compatibility.</p>,
    },
    {
      key: 'sdks',
      label: 'SDKs',
      children: <p>Official SDKs and client libraries.</p>,
    },
  ];

  return (
    <Card title="API Documentation" style={{ width: 500 }}>
      <div 
        style={{ 
          height: 320, 
          overflowY: 'auto',
          paddingRight: 8,
        }}
        data-testid="scroll-container"
      >
        <Collapse
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key as string[])}
          data-testid="collapse-root"
          items={items}
        />
      </div>
    </Card>
  );
}
