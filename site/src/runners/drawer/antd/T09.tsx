'use client';

/**
 * drawer-antd-T09: Scroll to bottom to close Terms drawer
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * Initial state:
 * - An AntD Drawer titled "Terms and conditions" is OPEN on page load.
 * - The drawer slides in from the right and contains a long, scrollable block of text (multiple paragraphs) so that the bottom is not visible initially.
 *
 * Target component configuration:
 * - closable = false (no header X icon).
 * - maskClosable = false (clicking the mask does NOT close the drawer).
 * - The ONLY way to close is a button labeled "I Understand" located at the very bottom of the drawer content (not sticky; requires scrolling within the drawer).
 *
 * Distractors:
 * - The drawer text includes numbered headings and inline links (non-functional in this task) that can distract attention.
 *
 * Feedback:
 * - Clicking "I Understand" closes the drawer and removes the mask.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Drawer, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title, Paragraph, Text } = Typography;

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Start open
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card title="Welcome" style={{ width: 350 }}>
      <Text>Please review and accept the Terms and conditions.</Text>

      <Drawer
        title="Terms and conditions"
        placement="right"
        open={open}
        closable={false}
        maskClosable={false}
        data-testid="drawer-terms"
      >
        <div style={{ minHeight: '150vh' }}>
          <Title level={5}>1. Introduction</Title>
          <Paragraph>
            Welcome to our platform. By using our services, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.
          </Paragraph>
          <Paragraph>
            These terms constitute a legally binding agreement between you and our company regarding your use of the platform and all related services.
          </Paragraph>

          <Title level={5}>2. User Responsibilities</Title>
          <Paragraph>
            Users are responsible for maintaining the confidentiality of their account credentials. You must notify us immediately of any unauthorized use of your account.
          </Paragraph>
          <Paragraph>
            You agree not to use the platform for any unlawful purposes or in any way that could damage, disable, or impair our services. See our <a href="#acceptable-use">Acceptable Use Policy</a> for more details.
          </Paragraph>

          <Title level={5}>3. Privacy and Data Protection</Title>
          <Paragraph>
            We take your privacy seriously. Please review our <a href="#privacy">Privacy Policy</a> to understand how we collect, use, and protect your personal information.
          </Paragraph>
          <Paragraph>
            By using our services, you consent to the collection and use of information as outlined in our Privacy Policy.
          </Paragraph>

          <Title level={5}>4. Intellectual Property</Title>
          <Paragraph>
            All content, features, and functionality of the platform are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
          </Paragraph>

          <Title level={5}>5. Limitation of Liability</Title>
          <Paragraph>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
          </Paragraph>

          <Title level={5}>6. Modifications</Title>
          <Paragraph>
            We reserve the right to modify these Terms at any time. Continued use of the platform after any such changes constitutes your acceptance of the new Terms.
          </Paragraph>

          <Title level={5}>7. Contact Information</Title>
          <Paragraph>
            If you have any questions about these Terms, please contact our <a href="#support">support team</a>.
          </Paragraph>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Button
              type="primary"
              onClick={() => setOpen(false)}
              data-testid="terms-acknowledge"
            >
              I Understand
            </Button>
          </div>
        </div>
      </Drawer>
    </Card>
  );
}
