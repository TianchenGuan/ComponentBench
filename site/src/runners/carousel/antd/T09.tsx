'use client';

/**
 * carousel-antd-T09: Modal gallery: open and show 'City at night'
 *
 * The main page shows an isolated card with a primary button labeled "Open Image Gallery".
 * Clicking the button opens an Ant Design Modal containing a single Ant Design Carousel.
 * The carousel inside the modal has 5 photo slides with captions:
 * "Sunrise", "Forest trail", "City at night", "Snow peaks", "Desert road".
 * The modal opens with the carousel on "Sunrise" (slide id: gal-sunrise). Autoplay is off.
 * Dots are shown within the modal under the carousel; arrows are disabled.
 *
 * Success: active_slide_id equals gal-city
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card, Button, Modal, Typography } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const slides = [
  { id: 'gal-sunrise', title: 'Sunrise', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { id: 'gal-forest', title: 'Forest trail', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { id: 'gal-city', title: 'City at night', gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { id: 'gal-snow', title: 'Snow peaks', gradient: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' },
  { id: 'gal-desert', title: 'Desert road', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlideId, setActiveSlideId] = useState(slides[0].id);
  const carouselRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (activeSlideId === 'gal-city' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Button type="primary" size="large" onClick={handleOpenModal}>
          Open Image Gallery
        </Button>
      </Card>

      <Modal
        title="Image Gallery"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Browse through our photo collection.
        </Text>
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
                    height: 280,
                    background: slide.gradient,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingBottom: 24,
                  }}
                >
                  <Text
                    style={{
                      color: slide.id === 'gal-city' ? '#fff' : '#333',
                      fontSize: 18,
                      background: 'rgba(255,255,255,0.9)',
                      padding: '6px 16px',
                      borderRadius: 4,
                    }}
                  >
                    {slide.title}
                  </Text>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </Modal>
    </>
  );
}
