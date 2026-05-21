'use client';

/**
 * button-mui-T06: Agree at bottom of terms (scroll to find)
 * 
 * Settings panel with scrollable Terms text.
 * "I agree" button at the very bottom (not visible initially).
 * Task: Scroll and click "I agree".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    if (agreed) return;
    setAgreed(true);
    onSuccess();
  };

  const termsText = `
    TERMS OF SERVICE

    1. ACCEPTANCE OF TERMS
    By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.

    2. DESCRIPTION OF SERVICE
    The service provides users with access to a rich collection of resources, including various communications tools, forums, personalized content.

    3. REGISTRATION DATA AND ACCOUNT SECURITY
    You agree to provide true, accurate, current and complete information about yourself as prompted by the registration form.

    4. USER CONDUCT
    You understand that all information, data, text, photographs, graphics, messages or other materials are the sole responsibility of the person from which such content originated.

    5. CONTENT SUBMITTED OR MADE AVAILABLE
    You grant to the service a worldwide, royalty-free, and non-exclusive license to reproduce, modify, adapt and publish any content you post.

    6. INDEMNITY
    You agree to indemnify and hold the service, its parent company, officers, directors, employees, and agents harmless from any claim or demand.

    7. GENERAL INFORMATION
    The Terms of Service constitute the entire agreement between you and the service and govern your use of the service.

    8. MODIFICATIONS TO TERMS OF SERVICE
    The service reserves the right to change these Terms of Service at any time, in its sole discretion.

    9. TERMINATION
    You agree that the service may, under certain circumstances and without prior notice, immediately terminate your account.

    10. DISCLAIMER OF WARRANTIES
    You expressly understand and agree that your use of the service is at your sole risk.
  `;

  return (
    <Card sx={{ width: 450, height: 400, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0, overflow: 'hidden' }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          Terms of Service
        </Typography>
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
            {termsText}
          </Typography>
          
          {agreed ? (
            <Typography color="success.main">Thank you for agreeing</Typography>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleAgree}
              data-testid="mui-btn-i-agree"
            >
              I agree
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
