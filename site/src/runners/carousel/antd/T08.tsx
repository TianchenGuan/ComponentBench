'use client';

/**
 * carousel-antd-T08: Match reference banner in carousel
 *
 * An isolated card contains an Ant Design Carousel titled "Brand Banners".
 * To the right of the carousel there is a small "Reference preview" panel showing a miniature banner image.
 * The carousel contains 6 visually distinct banner slides with labels:
 * "Blue Wave", "Green Hills", "Orange Burst", "Purple Night", "Red Sunset", "Teal Grid".
 * The reference preview displays "Purple Night" (reference token: ref-banner-purple).
 * The carousel starts on "Blue Wave" (slide id: banner-blue). Dots visible; arrows hidden.
 *
 * Success: active_slide_id equals banner-purple (matches reference)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card, Typography } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const slides = [
  { id: 'banner-blue', title: 'Blue Wave', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'banner-green', title: 'Green Hills', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { id: 'banner-orange', title: 'Orange Burst', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'banner-purple', title: 'Purple Night', gradient: 'linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)' },
  { id: 'banner-red', title: 'Red Sunset', gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)' },
  { id: 'banner-teal', title: 'Teal Grid', gradient: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)' },
];

const TARGET_SLIDE = slides.find(s => s.id === 'banner-purple')!;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [activeSlideId, setActiveSlideId] = useState(slides[0].id);
  const carouselRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (activeSlideId === 'banner-purple' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  return (
    <Card title="Brand Banners" style={{ width: 750 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Carousel — explicit width avoids flex-based sizing issues with Slick */}
        <div style={{ width: 530, minWidth: 530 }}>
          <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
            <Carousel
              ref={carouselRef}
              autoplay={false}
              arrows={false}
              dots={true}
              afterChange={handleChange}
            >
              {slides.map((slide) => (
                <div key={slide.id}>
                  <div
                    data-slide-id={slide.id}
                    style={{
                      height: 200,
                      background: slide.gradient,
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      padding: 16,
                      borderRadius: 8,
                    }}
                  >
                    <span
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: 4,
                        fontSize: 12,
                      }}
                    >
                      {slide.title}
                    </span>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {/* Reference Preview */}
        <div
          data-testid="reference-preview"
          data-reference-token="ref-banner-purple"
          style={{
            width: 150,
            padding: 12,
            background: '#fafafa',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
          }}
        >
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
            Reference preview
          </Text>
          <div
            style={{
              height: 80,
              background: TARGET_SLIDE.gradient,
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <Text style={{ fontSize: 12, display: 'block', textAlign: 'center' }}>
            {TARGET_SLIDE.title}
          </Text>
        </div>
      </div>
    </Card>
  );
}
