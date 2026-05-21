'use client';

/**
 * carousel-antd-T11: Three carousels: match the partner logo reference
 *
 * The page is a settings_panel layout titled "Homepage content".
 * At the top there is a small read-only "Reference" tile showing a single partner logo (ref-logo-zenith).
 * Below it are three Ant Design Carousels:
 *   1) "Featured Articles" (image + headline slides)
 *   2) "Partner Logos" (target - logo-only slides)
 *   3) "Testimonials" (quote cards)
 * The Partner Logos carousel contains 9 logo slides. Each logo has accessible alt text.
 * Initial state: Partner Logos starts on "Northwind" (logo-northwind). Autoplay off.
 *
 * Success: Partner Logos active_slide_id equals logo-zenith (matches reference)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card, Checkbox, Button, Space, Typography } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const { Title, Text } = Typography;

const featuredSlides = [
  { id: 'art-1', title: 'New Feature Launch' },
  { id: 'art-2', title: 'Company Update' },
  { id: 'art-3', title: 'Industry News' },
];

const logoSlides = [
  { id: 'logo-northwind', name: 'Northwind', color: '#1890ff' },
  { id: 'logo-contoso', name: 'Contoso', color: '#52c41a' },
  { id: 'logo-fabrikam', name: 'Fabrikam', color: '#fa8c16' },
  { id: 'logo-tailspin', name: 'Tailspin', color: '#722ed1' },
  { id: 'logo-zenith', name: 'Zenith', color: '#eb2f96' },
  { id: 'logo-proseware', name: 'Proseware', color: '#13c2c2' },
  { id: 'logo-adventure', name: 'Adventure', color: '#2f54eb' },
  { id: 'logo-alpine', name: 'Alpine', color: '#a0d911' },
  { id: 'logo-coho', name: 'Coho', color: '#faad14' },
];

const testimonialSlides = [
  { id: 'testi-a', quote: 'Great partner!' },
  { id: 'testi-b', quote: 'Excellent service!' },
  { id: 'testi-c', quote: 'Highly recommend!' },
];

const TARGET_LOGO = logoSlides.find(l => l.id === 'logo-zenith')!;
const LOGO_INITIAL_INDEX = 0; // "Northwind"

export default function T11({ onSuccess }: TaskComponentProps) {
  const [logoActiveId, setLogoActiveId] = useState(logoSlides[LOGO_INITIAL_INDEX].id);
  const logoRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (logoActiveId === 'logo-zenith' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [logoActiveId, onSuccess]);

  const handleLogoChange = (current: number) => {
    setLogoActiveId(logoSlides[current].id);
  };

  return (
    <Card style={{ width: 700 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Homepage content</Title>

      {/* Reference tile */}
      <div
        data-testid="reference-preview"
        data-reference-token="ref-logo-zenith"
        style={{
          padding: 12,
          background: '#f5f5f5',
          borderRadius: 8,
          marginBottom: 24,
          display: 'inline-block',
        }}
      >
        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
          Reference
        </Text>
        <div
          style={{
            width: 80,
            height: 40,
            background: TARGET_LOGO.color,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{TARGET_LOGO.name}</span>
        </div>
      </div>

      {/* Featured Articles */}
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Featured Articles</Text>
        <Carousel autoplay={false} arrows={false} dots={{ className: 'small-dots' }}>
          {featuredSlides.map((slide) => (
            <div key={slide.id}>
              <div
                style={{
                  height: 80,
                  background: '#e8e8e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span>{slide.title}</span>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Partner Logos - Target */}
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Partner Logos</Text>
        <div
          data-testid="carousel-root"
          data-instance-id="partner-logos"
          data-active-slide-id={logoActiveId}
        >
          <Carousel
            ref={logoRef}
            autoplay={false}
            arrows={false}
            dots={true}
            afterChange={handleLogoChange}
          >
            {logoSlides.map((slide) => (
              <div key={slide.id}>
                <div
                  data-slide-id={slide.id}
                  style={{
                    height: 100,
                    background: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 60,
                      background: slide.color,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: '#fff', fontWeight: 600 }} role="img" aria-label={slide.name}>
                      {slide.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Testimonials</Text>
        <Carousel autoplay={false} arrows={false} dots={{ className: 'small-dots' }}>
          {testimonialSlides.map((slide) => (
            <div key={slide.id}>
              <div
                style={{
                  height: 60,
                  background: '#e8e8e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontStyle: 'italic',
                }}
              >
                &quot;{slide.quote}&quot;
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Distractor controls */}
      <Space direction="vertical" style={{ width: '100%' }}>
        <Checkbox>Show on homepage</Checkbox>
        <Space>
          <Button>Cancel</Button>
          <Button type="primary">Save</Button>
        </Space>
      </Space>
    </Card>
  );
}
