'use client';

/**
 * link-mantine-T06: Scroll to bottom and open Contact support
 * 
 * setup_description:
 * A centered isolated card titled "FAQ" contains a long scrollable list of Q&A items
 * (several screens). At the very bottom, after the last item, there is exactly one
 * Mantine Anchor labeled "Contact support".
 * 
 * The link is initially off-screen. Activating it navigates the SPA to pathname "/contact"
 * and updates the card title to "Contact support".
 * 
 * success_trigger:
 * - The "Contact support" Anchor (data-testid="link-contact") was activated.
 * - The current route pathname equals "/contact".
 * - The card header title reads "Contact support".
 */

import React, { useState } from 'react';
import { Card, Text, Anchor, Box, Divider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

// Generate FAQ items
const generateFAQItems = () => {
  const questions = [
    { q: 'How do I reset my password?', a: 'Go to Settings > Security > Change Password.' },
    { q: 'Where can I view my invoices?', a: 'Navigate to Billing > Invoice History.' },
    { q: 'How do I add team members?', a: 'Go to Team > Invite Members and enter their email.' },
    { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, and PayPal.' },
    { q: 'How do I cancel my subscription?', a: 'Contact support or go to Billing > Cancel Subscription.' },
    { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption.' },
    { q: 'How do I export my data?', a: 'Go to Settings > Data > Export.' },
    { q: 'What is your refund policy?', a: 'Full refunds within 30 days of purchase.' },
  ];
  // Repeat to make scrollable
  return Array(4).fill(questions).flat();
};

export default function T06({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState('/faq');
  const [activated, setActivated] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute('/contact');
    setActivated(true);
    onSuccess();
  };

  const isOnContact = route === '/contact';
  const faqItems = generateFAQItems();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Text fw={500} size="lg" mb="md">
        {isOnContact ? 'Contact support' : 'FAQ'}
      </Text>
      
      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: 8,
        }}
      >
        {faqItems.map((item, index) => (
          <Box key={index} mb="md">
            <Text fw={500} size="sm">{item.q}</Text>
            <Text size="sm" c="dimmed">{item.a}</Text>
          </Box>
        ))}
        
        <Divider my="md" />
        
        <Box py="xs">
          <Anchor
            href="/contact"
            onClick={handleClick}
            data-testid="link-contact"
            aria-current={isOnContact ? 'page' : undefined}
          >
            Contact support
          </Anchor>
        </Box>
      </Box>
    </Card>
  );
}
