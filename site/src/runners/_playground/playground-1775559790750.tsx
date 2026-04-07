'use client';

// "Theater seating: confirm 3 adjacent premium seats" — Select exactly 3 adjacent premium seats in the same row, then click "Confirm Selection". The task will finish automatically when done.
import React, { useMemo, useState } from 'react';

interface TaskComponentProps {
  task: any;
  onSuccess: () => void;
}

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLUMNS = [1, 2, 3, 4, 5, 6];
const TARGET_SELECTION = ['B2', 'B3', 'B4'];

const BOOKED_SEATS = new Set(['A2', 'A5', 'B1', 'B5', 'C1', 'C6', 'D3', 'E2', 'E5']);
const PREMIUM_SEATS = new Set(['B2', 'B3', 'B4', 'C2', 'C4', 'D4', 'D5', 'E4']);

type SeatStatus = 'booked' | 'premium' | 'regular';

function getSeatStatus(seatId: string): SeatStatus {
  if (BOOKED_SEATS.has(seatId)) {
    return 'booked';
  }
  if (PREMIUM_SEATS.has(seatId)) {
    return 'premium';
  }
  return 'regular';
}

function isValidPremiumTriple(selectedSeats: string[]) {
  if (selectedSeats.length !== 3) {
    return false;
  }

  if (!selectedSeats.every((seatId) => PREMIUM_SEATS.has(seatId))) {
    return false;
  }

  const row = selectedSeats[0]?.charAt(0);
  if (!selectedSeats.every((seatId) => seatId.charAt(0) === row)) {
    return false;
  }

  const seatNumbers = selectedSeats
    .map((seatId) => Number.parseInt(seatId.slice(1), 10))
    .sort((a, b) => a - b);

  return seatNumbers[1] === seatNumbers[0] + 1 && seatNumbers[2] === seatNumbers[1] + 1;
}

function isTargetSelection(selectedSeats: string[]) {
  const sortedSelection = [...selectedSeats].sort();
  return sortedSelection.length === 3 && sortedSelection.every((seatId, index) => seatId === TARGET_SELECTION[index]);
}

export default function PlaygroundTask({ task, onSuccess }: TaskComponentProps) {
  void task;

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [confirmedSelection, setConfirmedSelection] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [submittedError, setSubmittedError] = useState('');
  const [didNotifySuccess, setDidNotifySuccess] = useState(false);

  const selectionIsValid = useMemo(() => isValidPremiumTriple(selectedSeats), [selectedSeats]);
  const showInlineValidation = selectedSeats.length === 3 && !selectionIsValid && !confirmed;
  const helperText = selectionIsValid ? 'Ready to confirm.' : 'Choose 3 adjacent premium seats in one row.';

  const handleSeatClick = (seatId: string) => {
    if (confirmed || BOOKED_SEATS.has(seatId)) {
      return;
    }

    setSubmittedError('');

    setSelectedSeats((current) => {
      if (current.includes(seatId)) {
        return current.filter((id) => id !== seatId);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, seatId];
    });
  };

  const handleConfirm = () => {
    if (selectedSeats.length !== 3) {
      setSubmittedError('Select exactly 3 seats before confirming.');
      return;
    }

    if (!selectionIsValid || !isTargetSelection(selectedSeats)) {
      setSubmittedError('Selection must be 3 adjacent premium seats in the same row.');
      return;
    }

    const sortedSelection = [...selectedSeats].sort();
    setConfirmedSelection(sortedSelection);
    setConfirmed(true);
    setSubmittedError('');

    if (!didNotifySuccess) {
      setDidNotifySuccess(true);
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
        background: '#f4f6fa',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        aria-label="Theater seating card"
        style={{
          width: '100%',
          maxWidth: 540,
          borderRadius: 22,
          border: '1px solid #d8e0eb',
          background: '#ffffff',
          boxShadow: '0 18px 48px rgba(15, 23, 42, 0.10)',
          padding: 28,
        }}
      >
        <div style={{ marginBottom: 22 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              lineHeight: 1.1,
              color: '#162033',
            }}
          >
            Choose Your Seats
          </h1>
          <p
            style={{
              margin: '10px 0 0',
              fontSize: 15,
              lineHeight: 1.5,
              color: '#5e6b7e',
            }}
          >
            Select 3 adjacent premium seats in one row.
          </p>
        </div>

        <div
          aria-label="Seat legend"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 24,
          }}
        >
          {[
            { label: 'Booked', color: '#c8cfd8', border: '#b6bec9', text: '#546172' },
            { label: 'Premium', color: '#e4b548', border: '#cf9e2a', text: '#5d4304' },
            { label: 'Regular', color: '#4e82d8', border: '#376cc2', text: '#1d3767' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 999,
                border: '1px solid #d8e0eb',
                background: '#f8fafc',
                fontSize: 13,
                fontWeight: 600,
                color: '#334155',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: item.color,
                  border: `1px solid ${item.border}`,
                  boxSizing: 'border-box',
                  display: 'inline-block',
                }}
              />
              <span style={{ color: item.text }}>{item.label}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '32px repeat(6, minmax(0, 1fr))',
            gap: 10,
          }}
        >
          <div />
          {COLUMNS.map((column) => (
            <div
              key={`column-${column}`}
              style={{
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#64748b',
              }}
            >
              {column}
            </div>
          ))}

          {ROWS.map((row) => (
            <React.Fragment key={row}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#425066',
                }}
              >
                {row}
              </div>
              {COLUMNS.map((column) => {
                const seatId = `${row}${column}`;
                const status = getSeatStatus(seatId);
                const isBooked = status === 'booked';
                const isSelected = selectedSeats.includes(seatId);

                let background = '#4e82d8';
                let color = '#ffffff';
                let border = '1px solid #376cc2';

                if (status === 'premium') {
                  background = '#e4b548';
                  color = '#533c06';
                  border = '1px solid #cf9e2a';
                }

                if (status === 'booked') {
                  background = '#c8cfd8';
                  color = '#5e6876';
                  border = '1px solid #b6bec9';
                }

                if (isSelected) {
                  background = status === 'premium' ? '#b8820e' : '#1f5fbf';
                  color = '#ffffff';
                  border = status === 'premium' ? '2px solid #8a6309' : '2px solid #174a95';
                }

                return (
                  <button
                    key={seatId}
                    type="button"
                    data-seat-id={seatId}
                    data-seat-status={status}
                    data-selected={isSelected ? 'true' : 'false'}
                    aria-pressed={isBooked ? undefined : isSelected}
                    aria-selected={isSelected}
                    aria-disabled={isBooked || confirmed}
                    disabled={isBooked || confirmed}
                    onClick={() => handleSeatClick(seatId)}
                    style={{
                      minHeight: 52,
                      borderRadius: 14,
                      border,
                      background,
                      color,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: isBooked || confirmed ? 'not-allowed' : 'pointer',
                      opacity: isBooked ? 0.92 : 1,
                      boxShadow: isSelected ? '0 10px 18px rgba(15, 23, 42, 0.18)' : 'none',
                      transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease',
                    }}
                  >
                    {seatId}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 16,
            border: '1px solid #dbe3ee',
            background: '#f8fafc',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: '#152033',
            }}
          >
            Selected: {selectedSeats.length} of 3
          </p>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 14,
              color: selectionIsValid ? '#165a37' : '#5e6b7e',
            }}
          >
            {helperText}
          </p>
          {showInlineValidation && (
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 14,
                fontWeight: 600,
                color: '#b42318',
              }}
            >
              Selection must be 3 adjacent premium seats in the same row.
            </p>
          )}
          {submittedError && !showInlineValidation && (
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 14,
                fontWeight: 600,
                color: '#b42318',
              }}
            >
              {submittedError}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={confirmed}
          style={{
            width: '100%',
            marginTop: 18,
            padding: '14px 18px',
            borderRadius: 999,
            border: 'none',
            background: confirmed ? '#9caecb' : '#183c77',
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 700,
            cursor: confirmed ? 'default' : 'pointer',
          }}
        >
          Confirm Selection
        </button>

        {confirmed && confirmedSelection.join(', ') === TARGET_SELECTION.join(', ') && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 14,
              border: '1px solid #b7dfc5',
              background: '#edf9f1',
              color: '#14532d',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Selection confirmed for seats B2, B3, B4
          </div>
        )}
      </section>
    </div>
  );
}
