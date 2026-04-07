'use client';

// A simple coffee order form where the user selects a size and milk type, then places the order to see a confirmation.
import React, { useMemo, useState } from 'react';

interface TaskComponentProps {
  task: any;
  onSuccess: () => void;
}

const sizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const milkTypes = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'oat', label: 'Oat' },
  { value: 'almond', label: 'Almond' },
];

export default function PlaygroundTask({ task, onSuccess }: TaskComponentProps) {
  const [size, setSize] = useState('');
  const [milkType, setMilkType] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [completed, setCompleted] = useState(false);

  const canSubmit = useMemo(() => size !== '' && milkType !== '', [milkType, size]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setOrderPlaced(true);
    if (!completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'linear-gradient(180deg, #f4ece2 0%, #e7d0b6 52%, #d5ac84 100%)',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        aria-label="Coffee order form"
        style={{
          width: '100%',
          maxWidth: 460,
          padding: 28,
          borderRadius: 20,
          background: '#fff9f2',
          border: '1px solid #d9c1a7',
          boxShadow: '0 18px 42px rgba(72, 44, 22, 0.14)',
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              margin: 0,
              color: '#8a5b39',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.8,
              textTransform: 'uppercase',
            }}
          >
            Coffee Order
          </p>
          <h1
            style={{
              margin: '8px 0 10px',
              color: '#3d291c',
              fontSize: 30,
              lineHeight: 1.1,
            }}
          >
            Build your drink
          </h1>
          <p style={{ margin: 0, color: '#6d5442', lineHeight: 1.5 }}>
            Pick a size, choose a milk type, and place your order.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 20px' }}>
            <legend style={{ marginBottom: 10, color: '#4a3224', fontWeight: 600 }}>Size</legend>
            <div style={{ display: 'grid', gap: 10 }}>
              {sizes.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    color: '#4a3425',
                    background: size === option.value ? '#f4e3cf' : '#ffffff',
                    border: size === option.value ? '2px solid #8a5b39' : '1px solid #d6c0a8',
                  }}
                >
                  <input
                    type="radio"
                    name="size"
                    value={option.value}
                    checked={size === option.value}
                    onChange={(event) => {
                      setSize(event.target.value);
                      setOrderPlaced(false);
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 24px' }}>
            <legend style={{ marginBottom: 10, color: '#4a3224', fontWeight: 600 }}>
              Milk Type
            </legend>
            <div style={{ display: 'grid', gap: 10 }}>
              {milkTypes.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    color: '#4a3425',
                    background: milkType === option.value ? '#f4e3cf' : '#ffffff',
                    border:
                      milkType === option.value ? '2px solid #8a5b39' : '1px solid #d6c0a8',
                  }}
                >
                  <input
                    type="radio"
                    name="milkType"
                    value={option.value}
                    checked={milkType === option.value}
                    onChange={(event) => {
                      setMilkType(event.target.value);
                      setOrderPlaced(false);
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '14px 18px',
              border: 'none',
              borderRadius: 999,
              background: canSubmit ? '#6b4226' : '#c9b6a3',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 700,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            Place Order
          </button>
        </form>

        {orderPlaced && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 14,
              background: '#efe4d7',
              color: '#4b3423',
              border: '1px solid #d9bda1',
            }}
          >
            Order placed: {sizes.find((option) => option.value === size)?.label} coffee with{' '}
            {milkTypes.find((option) => option.value === milkType)?.label.toLowerCase()} milk.
          </div>
        )}
      </section>
    </div>
  );
}
