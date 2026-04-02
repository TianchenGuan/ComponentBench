'use client';

/**
 * accordion-antd-T06: Help page: scroll to Refunds section and open it
 * 
 * Scene uses a form_section layout: a tall page with a header ("Help Center") and several 
 * paragraphs of non-interactive text above the fold. The target Ant Design Collapse 
 * (accordion mode) appears below the fold in a card titled "Help topics". The accordion 
 * has 6 panels: "Ordering", "Shipping", "Refunds", "Warranty", "Account", "Contact us".
 * Initial state: all panels collapsed.
 * 
 * Success: expanded_item_ids equals exactly: [refunds]
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title, Paragraph } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string | string[]>([]);

  useEffect(() => {
    if (activeKey === 'refunds' || (Array.isArray(activeKey) && activeKey.includes('refunds') && activeKey.length === 1)) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  return (
    <div style={{ width: '100%', maxWidth: 700 }}>
      {/* Header section above the fold */}
      <Title level={2}>Help Center</Title>
      <Paragraph>
        Welcome to our Help Center. Here you&apos;ll find answers to frequently asked questions
        and guidance on how to make the most of our services.
      </Paragraph>
      <Paragraph>
        Our support team is available 24/7 to assist you with any questions or concerns. 
        Browse through the topics below or use the search function to find specific information.
      </Paragraph>
      <Paragraph>
        We&apos;re committed to providing excellent customer service and ensuring your experience 
        with us is smooth and enjoyable. Whether you need help with orders, returns, or account 
        settings, we&apos;ve got you covered.
      </Paragraph>
      <Paragraph>
        Please review the commonly asked questions in the topics below. If you can&apos;t find 
        what you&apos;re looking for, feel free to contact our support team directly.
      </Paragraph>
      <Paragraph>
        Thank you for choosing our services. We value your trust and are here to help you 
        every step of the way.
      </Paragraph>

      {/* Accordion section below the fold */}
      <Card title="Help topics" style={{ marginTop: 24 }}>
        <Collapse
          accordion
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
          data-testid="accordion-root"
          items={[
            {
              key: 'ordering',
              label: 'Ordering',
              children: <p>Information about placing and managing orders.</p>,
            },
            {
              key: 'shipping',
              label: 'Shipping',
              children: <p>Details about shipping methods and delivery times.</p>,
            },
            {
              key: 'refunds',
              label: 'Refunds',
              children: <p>Learn about our refund policy and how to request a refund.</p>,
            },
            {
              key: 'warranty',
              label: 'Warranty',
              children: <p>Warranty coverage and claim procedures.</p>,
            },
            {
              key: 'account',
              label: 'Account',
              children: <p>Managing your account settings and preferences.</p>,
            },
            {
              key: 'contact_us',
              label: 'Contact us',
              children: <p>Ways to get in touch with our support team.</p>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
