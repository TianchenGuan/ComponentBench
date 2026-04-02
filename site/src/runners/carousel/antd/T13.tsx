'use client';

/**
 * carousel-antd-T13: Vertical carousel: drag to Day 5 itinerary
 *
 * A single Ant Design Carousel is displayed in an isolated card in the center.
 * The carousel is configured as a vertical carousel (vertical mode) and is draggable.
 * There are 7 slides labeled "Day 1" through "Day 7".
 * The initial slide is "Day 2" (slide id: trip-day2). Autoplay is off.
 * Dots are displayed as a vertical column; arrows are not shown.
 *
 * Success: active_slide_id equals trip-day5
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card, Typography } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const slides = [
  { id: 'trip-day1', title: 'Day 1', desc: 'Arrival and hotel check-in' },
  { id: 'trip-day2', title: 'Day 2', desc: 'City tour and museum visit' },
  { id: 'trip-day3', title: 'Day 3', desc: 'Mountain hiking adventure' },
  { id: 'trip-day4', title: 'Day 4', desc: 'Beach day and water sports' },
  { id: 'trip-day5', title: 'Day 5', desc: 'Cultural experience and local cuisine' },
  { id: 'trip-day6', title: 'Day 6', desc: 'Shopping and free time' },
  { id: 'trip-day7', title: 'Day 7', desc: 'Departure' },
];

const INITIAL_INDEX = 1; // "Day 2"

export default function T13({ onSuccess }: TaskComponentProps) {
  const [activeSlideId, setActiveSlideId] = useState(slides[INITIAL_INDEX].id);
  const carouselRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && carouselRef.current) {
      initialized.current = true;
      carouselRef.current.goTo(INITIAL_INDEX, false);
    }
  }, []);

  useEffect(() => {
    if (activeSlideId === 'trip-day5' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  return (
    <Card title="Trip Itinerary" style={{ width: 400 }}>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          ref={carouselRef}
          autoplay={false}
          arrows={false}
          dots={true}
          dotPosition="right"
          vertical={true}
          draggable={true}
          afterChange={handleChange}
          initialSlide={INITIAL_INDEX}
          style={{ height: 200 }}
        >
          {slides.map((slide) => (
            <div key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 200,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <span style={{ color: '#fff', fontSize: 20, fontWeight: 600 }}>
                    {slide.title.split(' ')[1]}
                  </span>
                </div>
                <h3 style={{ color: '#fff', margin: 0, marginBottom: 8 }}>{slide.title}</h3>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                  {slide.desc}
                </Text>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
