'use client';

/**
 * select_custom_multi-antd-v2-T15: Reference audience inline card exact match
 *
 * Inline surface, high_contrast theme, compact spacing, off-center, medium clutter.
 * Notification composer card. Read-only chip row "Reference audience": Finance, Legal, Security, Support.
 * Below: AntD Select (mode=multiple, showSearch, maxTagCount=responsive) labeled "Recipients".
 * Options: Finance, FinOps, Legal, Legal Ops, Security, Security Review, Support, Support APAC, Product.
 * Initial: [FinOps, Security Review]. Target: match reference = {Finance, Legal, Security, Support}.
 * Auto-apply (no save button).
 *
 * Success: Recipients = {Finance, Legal, Security, Support}.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Select, Typography, Card, Tag, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const recipientOptions = [
  'Finance', 'FinOps', 'Legal', 'Legal Ops', 'Security',
  'Security Review', 'Support', 'Support APAC', 'Product',
].map(v => ({ label: v, value: v }));

const referenceAudience = ['Finance', 'Legal', 'Security', 'Support'];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['FinOps', 'Security Review']);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (setsEqual(selected, referenceAudience)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <div style={{ padding: 16, background: '#000', minHeight: '100vh', color: '#fff' }}>
      <Card
        style={{ maxWidth: 480, background: '#111', border: '1px solid #333' }}
        bodyStyle={{ padding: 16 }}
      >
        <Title level={5} style={{ color: '#fff' }}><MailOutlined /> Notification Composer</Title>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 6, color: '#ccc' }}>Reference audience</Text>
          <Space wrap>
            {referenceAudience.map(label => (
              <Tag key={label} color="blue">{label}</Tag>
            ))}
          </Space>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Recipients</Text>
          <Select
            mode="multiple"
            showSearch
            maxTagCount="responsive"
            style={{ width: '100%' }}
            value={selected}
            onChange={setSelected}
            options={recipientOptions}
            placeholder="Select recipients"
          />
        </div>
      </Card>
    </div>
  );
}
