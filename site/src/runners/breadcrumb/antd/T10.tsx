'use client';

/**
 * breadcrumb-antd-T10: Two-section disambiguation
 * 
 * Form section with two labeled breadcrumb areas stacked vertically.
 * 1. "Example" section: Home > Products > Items > Detail
 * 2. "Current Location" section: Dashboard > Products > Overview
 * Click "Products" in the "Current Location" section only.
 */

import React, { useState } from 'react';
import { Breadcrumb, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<{ section: string; item: string } | null>(null);

  const handleNavigate = (section: string, item: string) => {
    if (navigated) return;
    setNavigated({ section, item });
    if (section === 'current_location' && item === 'Products') {
      onSuccess();
    }
  };

  return (
    <Card title="Navigation" style={{ width: 500 }}>
      {/* Example Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#888' }}>
          Example
        </div>
        <Breadcrumb
          items={[
            {
              title: (
                <a
                  onClick={() => handleNavigate('example', 'Home')}
                  data-testid="antd-breadcrumb-example-home"
                  style={{ cursor: 'pointer' }}
                >
                  Home
                </a>
              ),
            },
            {
              title: (
                <a
                  onClick={() => handleNavigate('example', 'Products')}
                  data-testid="antd-breadcrumb-example-products"
                  style={{ cursor: 'pointer' }}
                >
                  Products
                </a>
              ),
            },
            {
              title: (
                <a
                  onClick={() => handleNavigate('example', 'Items')}
                  data-testid="antd-breadcrumb-example-items"
                  style={{ cursor: 'pointer' }}
                >
                  Items
                </a>
              ),
            },
            {
              title: <span>Detail</span>,
            },
          ]}
        />
      </div>

      {/* Current Location Section */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#1677ff' }}>
          Current Location
        </div>
        <Breadcrumb
          items={[
            {
              title: (
                <a
                  onClick={() => handleNavigate('current_location', 'Dashboard')}
                  data-testid="antd-breadcrumb-current-dashboard"
                  style={{ cursor: 'pointer' }}
                >
                  Dashboard
                </a>
              ),
            },
            {
              title: (
                <a
                  onClick={() => handleNavigate('current_location', 'Products')}
                  data-testid="antd-breadcrumb-current-products"
                  style={{ cursor: 'pointer' }}
                >
                  Products
                </a>
              ),
            },
            {
              title: <span>Overview</span>,
            },
          ]}
        />
      </div>

      {navigated && (
        <p
          style={{
            color: navigated.section === 'current_location' && navigated.item === 'Products'
              ? '#52c41a'
              : '#ff4d4f',
            fontWeight: 500,
            marginTop: 16,
          }}
        >
          {navigated.section === 'current_location' && navigated.item === 'Products'
            ? `Correct! Navigated to ${navigated.item} in Current Location.`
            : `Wrong section! You clicked ${navigated.item} in ${navigated.section === 'example' ? 'Example' : 'Current Location'}.`}
        </p>
      )}
    </Card>
  );
}
