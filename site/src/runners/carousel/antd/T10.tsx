'use client';

/**
 * carousel-antd-T10: Two carousels: set Testimonials to 'Customer Story 2'
 *
 * The page is a small dashboard-like section with two Ant Design Carousels stacked vertically.
 * The first card is labeled "Hero Banners" and contains 3 marketing banners.
 * The second card is labeled "Testimonials" and contains 4 testimonial slides:
 * "Customer Story 1", "Customer Story 2", "Customer Story 3", "Customer Story 4".
 * Both carousels show dots; neither shows arrows. Autoplay is off for both.
 * Initial state: Hero Banners is on hero-1. Testimonials starts on "Customer Story 4" (test-4).
 * Only the Testimonials carousel is checked for success.
 *
 * Success: Testimonials active_slide_id equals test-2
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card, Typography } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const { Title } = Typography;

const heroSlides = [
  { id: 'hero-1', title: 'Welcome Banner', color: '#1890ff' },
  { id: 'hero-2', title: 'Summer Sale', color: '#52c41a' },
  { id: 'hero-3', title: 'New Arrivals', color: '#722ed1' },
];

const testimonialSlides = [
  { id: 'test-1', title: 'Customer Story 1', quote: 'Amazing product!' },
  { id: 'test-2', title: 'Customer Story 2', quote: 'Best service ever!' },
  { id: 'test-3', title: 'Customer Story 3', quote: 'Highly recommended!' },
  { id: 'test-4', title: 'Customer Story 4', quote: 'Five stars!' },
];

const TESTIMONIAL_INITIAL_INDEX = 3; // "Customer Story 4"

export default function T10({ onSuccess }: TaskComponentProps) {
  const [testimonialActiveId, setTestimonialActiveId] = useState(testimonialSlides[TESTIMONIAL_INITIAL_INDEX].id);
  const testimonialRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && testimonialRef.current) {
      initialized.current = true;
      testimonialRef.current.goTo(TESTIMONIAL_INITIAL_INDEX, false);
    }
  }, []);

  useEffect(() => {
    if (testimonialActiveId === 'test-2' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [testimonialActiveId, onSuccess]);

  const handleTestimonialChange = (current: number) => {
    setTestimonialActiveId(testimonialSlides[current].id);
  };

  return (
    <div style={{ width: 500 }}>
      <Title level={5} style={{ marginBottom: 16 }}>Dashboard</Title>

      {/* Hero Banners - Distractor */}
      <Card title="Hero Banners" size="small" style={{ marginBottom: 16 }}>
        <div data-testid="hero-carousel" data-instance-id="hero-banners">
          <Carousel autoplay={false} arrows={false} dots={true}>
            {heroSlides.map((slide) => (
              <div key={slide.id}>
                <div
                  data-slide-id={slide.id}
                  style={{
                    height: 100,
                    background: slide.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: '#fff', fontSize: 16 }}>{slide.title}</span>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </Card>

      {/* Testimonials - Target */}
      <Card title="Testimonials" size="small">
        <div
          data-testid="carousel-root"
          data-instance-id="testimonials"
          data-active-slide-id={testimonialActiveId}
        >
          <Carousel
            ref={testimonialRef}
            autoplay={false}
            arrows={false}
            dots={true}
            afterChange={handleTestimonialChange}
            initialSlide={TESTIMONIAL_INITIAL_INDEX}
          >
            {testimonialSlides.map((slide) => (
              <div key={slide.id}>
                <div
                  data-slide-id={slide.id}
                  style={{
                    height: 120,
                    background: '#fafafa',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16,
                  }}
                >
                  <h4 style={{ margin: 0, marginBottom: 8 }}>{slide.title}</h4>
                  <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>
                    &quot;{slide.quote}&quot;
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </Card>
    </div>
  );
}
