'use client';

/**
 * link-antd-T01: Navigate via Support Center link
 * 
 * setup_description:
 * A single isolated card is centered in the viewport with the heading "Account Help".
 * Inside the card, there is a short paragraph of text and exactly one Ant Design
 * Typography.Link labeled "Support Center". The link is rendered in the default AntD
 * link style (blue text), with normal underline behavior on hover. This is an SPA-style
 * demo: clicking the link updates the in-app route to "/support" and shows a new view
 * title "Support Center" in the card header area; the same link remains visible and is
 * marked active with aria-current="page".
 * 
 * success_trigger:
 * - The link labeled "Support Center" (data-testid="link-support") was activated.
 * - The current route pathname equals "/support".
 * - The activated link is marked as current (aria-current="page").
 */

import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Link } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState('/home');
  const [activated, setActivated] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute('/support');
    setActivated(true);
    onSuccess();
  };

  const isOnSupport = route === '/support';

  return (
    <Card 
      title={isOnSupport ? 'Support Center' : 'Account Help'} 
      style={{ width: 400 }}
    >
      <p style={{ marginBottom: 16 }}>
        Need assistance? Visit the Support Center.
      </p>
      <Link
        href="/support"
        onClick={handleClick}
        data-testid="link-support"
        aria-current={isOnSupport ? 'page' : undefined}
      >
        Support Center
      </Link>
    </Card>
  );
}
