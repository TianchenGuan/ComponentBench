'use client';

/**
 * link-antd-T05: Scroll to footer and open Privacy Policy
 * 
 * setup_description:
 * A centered isolated card titled "Terms of Service" contains a long, scrollable block
 * of placeholder legal text (several screens tall). The scroll container is the main
 * card body (not a separate modal).
 * 
 * Exactly one Ant Design Typography.Link exists on the entire page: a footer-style link
 * labeled "Privacy Policy" placed after the long text, below the initial fold so it is
 * not visible at load. When the link is activated, the SPA navigates to pathname "/privacy"
 * and the card title updates to "Privacy Policy".
 * 
 * success_trigger:
 * - The "Privacy Policy" link (data-testid="link-privacy") was activated.
 * - The current route pathname equals "/privacy".
 * - The card header title reads "Privacy Policy".
 */

import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Link, Paragraph } = Typography;

// Generate long placeholder text
const generateLegalText = () => {
  const paragraphs = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
    'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
  ];
  // Repeat paragraphs to make content tall
  return Array(8).fill(paragraphs).flat();
};

export default function T05({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState('/terms');
  const [activated, setActivated] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute('/privacy');
    setActivated(true);
    onSuccess();
  };

  const isOnPrivacy = route === '/privacy';
  const legalText = generateLegalText();

  return (
    <Card 
      title={isOnPrivacy ? 'Privacy Policy' : 'Terms of Service'} 
      style={{ width: 450, height: 400, display: 'flex', flexDirection: 'column' }}
      styles={{ body: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 } }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
        }}
      >
        {legalText.map((text, index) => (
          <Paragraph key={index} style={{ marginBottom: 16 }}>
            {text}
          </Paragraph>
        ))}
        
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
          <Link
            href="/privacy"
            onClick={handleClick}
            data-testid="link-privacy"
            aria-current={isOnPrivacy ? 'page' : undefined}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </Card>
  );
}
