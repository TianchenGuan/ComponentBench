'use client';

/**
 * link-mui-T05: Scroll to footer and open Cookie settings (bottom-left placement)
 * 
 * setup_description:
 * A single isolated card is anchored to the bottom-left of the viewport
 * (placement=bottom_left). The card title is "Privacy Notice" and the body contains
 * a long scrollable text block.
 * 
 * Only one Material UI Link exists on the page: a footer link labeled "Cookie settings"
 * placed at the end of the scrollable content, initially off-screen. Activating the link
 * navigates the SPA to pathname "/cookies" and updates the card title to "Cookie settings".
 * 
 * success_trigger:
 * - The "Cookie settings" link (data-testid="link-cookies") was activated.
 * - The current route pathname equals "/cookies".
 * - The card header title reads "Cookie settings".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Link, Typography, Box, Divider } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Generate long placeholder text
const generatePrivacyText = () => {
  const paragraphs = [
    'This Privacy Notice describes how we collect, use, and share your personal information when you use our services.',
    'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.',
    'We automatically collect certain information when you use our Services, including your IP address, browser type, and device identifiers.',
    'We may use cookies and similar tracking technologies to collect information about your browsing activities.',
    'We use the information we collect to provide, maintain, and improve our Services, and to communicate with you.',
    'We may share your information with third-party service providers who perform services on our behalf.',
    'We implement appropriate technical and organizational measures to protect your personal information.',
    'You have certain rights regarding your personal information, including the right to access, correct, or delete your data.',
  ];
  // Repeat paragraphs to make content tall
  return Array(5).fill(paragraphs).flat();
};

export default function T05({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState('/privacy');
  const [activated, setActivated] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute('/cookies');
    setActivated(true);
    onSuccess();
  };

  const isOnCookies = route === '/cookies';
  const privacyText = generatePrivacyText();

  return (
    <Card sx={{ width: 450, height: 400, display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={isOnCookies ? 'Cookie settings' : 'Privacy Notice'} />
      <CardContent sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 0 }}>
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 2,
            py: 1,
          }}
        >
          {privacyText.map((text, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 2 }}>
              {text}
            </Typography>
          ))}
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ py: 1 }}>
            <Link
              href="/cookies"
              onClick={handleClick}
              data-testid="link-cookies"
              aria-current={isOnCookies ? 'page' : undefined}
              sx={{ cursor: 'pointer' }}
            >
              Cookie settings
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
