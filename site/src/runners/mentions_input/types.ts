import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific mentions_input components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Mention data structure
 */
export interface Mention {
  id: string;
  label: string;
}

/**
 * User suggestion for mentions dropdown
 */
export interface UserSuggestion {
  id: string;
  label: string;
}

/**
 * Common user list used across tasks
 */
export const COMMON_USERS: UserSuggestion[] = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'isabella', label: 'Isabella Garcia' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'carlos', label: 'Carlos Reyes' },
  { id: 'jun', label: 'Jun Ito' },
];

/**
 * Extended user list for long list tasks
 */
export const EXTENDED_USERS: UserSuggestion[] = [
  ...COMMON_USERS,
  { id: 'max', label: 'Max Wu' },
  { id: 'mia', label: 'Mia Davis' },
  { id: 'zoe', label: 'Zoë Zimmerman' },
  { id: 'zoe_zimmer', label: 'Zoe Zimmer' },
  { id: 'zora', label: 'Zora Khan' },
  { id: 'zane', label: 'Zane Miller' },
  { id: 'zelia', label: 'Zelia Costa' },
  { id: 'fatima', label: 'Fatima Al-Sayed' },
  { id: 'farah', label: 'Farah Ali' },
  { id: 'fabian', label: 'Fabian Costa' },
  { id: 'julia', label: 'Julia Stone' },
  { id: 'jordan', label: 'Jordan Lee' },
  { id: 'ann', label: 'Ann Lee' },
  { id: 'anna', label: 'Anna Lee' },
  { id: 'anne', label: 'Anne Lee' },
  { id: 'sofia', label: 'Sofia Navarro' },
];

/**
 * Normalize whitespace in text for comparison.
 * Also collapses spaces before punctuation (.; ,) that Ant Design's
 * Mentions component inserts after selecting a dropdown suggestion.
 */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([.;,!?])/g, '$1')
    .trim();
}

/**
 * Compare mentions arrays for equality
 */
export function mentionsEqual(a: Mention[], b: Mention[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((mention, i) => mention.id === b[i].id && mention.label === b[i].label);
}

/**
 * Derive the current mentions list from the actual text content.
 *
 * Scans `text` for every `@<label>` that matches a known user.
 * Returns one Mention per occurrence (preserving order, deduped).
 * This replaces the append-only onSelect pattern which breaks
 * when the user deletes and re-types a mention.
 */
export function deriveMentionsFromText(
  text: string,
  users: readonly UserSuggestion[],
): Mention[] {
  const seen = new Set<string>();
  const result: Mention[] = [];
  // Sort users by label length descending so longer names match first
  const sorted = [...users].sort((a, b) => b.label.length - a.label.length);
  // Build a single regex that matches any known @Name
  const escaped = sorted.map(u => u.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (escaped.length === 0) return result;
  const pattern = new RegExp(`@(${escaped.join('|')})`, 'g');
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    const label = m[1];
    if (!seen.has(label)) {
      seen.add(label);
      const user = sorted.find(u => u.label === label);
      if (user) result.push({ id: user.id, label: user.label });
    }
  }
  return result;
}
