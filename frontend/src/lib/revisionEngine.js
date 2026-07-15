/**
 * Revision Engine — SM-2 Spaced Repetition Algorithm
 *
 * result: 'easy' | 'hint' | 'failed'
 * Returns the next revision date and updated SM-2 parameters.
 */

const BASE_INTERVALS = [1, 3, 7, 14, 30, 60, 90, 180]; // days

/**
 * Calculate the next revision date based on user performance.
 *
 * @param {Object} params
 * @param {number} params.revisionNumber - How many revisions done so far (0-indexed)
 * @param {number} params.easeFactor    - SM-2 ease factor (starts at 2.5)
 * @param {number} params.intervalDays  - Last interval in days
 * @param {string} params.result        - 'easy' | 'hint' | 'failed'
 * @param {number} params.confidence    - User self-rated confidence (1-5)
 * @returns {{ nextDate: string, intervalDays: number, easeFactor: number, revisionNumber: number }}
 */
export function calculateNextRevision({ revisionNumber = 0, easeFactor = 2.5, intervalDays = 1, result, confidence }) {
  let newEaseFactor = easeFactor;
  let newInterval;
  let newRevisionNumber = revisionNumber;

  if (result === 'failed') {
    // Couldn't solve — restart from tomorrow
    newInterval = 1;
    newRevisionNumber = 0;
    newEaseFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (result === 'hint') {
    // Needed hint — repeat shorter interval
    newInterval = Math.max(1, Math.floor(intervalDays * 0.6));
    newEaseFactor = Math.max(1.3, easeFactor - 0.15);
    newRevisionNumber = Math.max(0, revisionNumber - 1);
  } else {
    // Solved easily — advance based on SM-2
    newRevisionNumber = revisionNumber + 1;

    if (newRevisionNumber <= BASE_INTERVALS.length) {
      // Use predefined intervals for first N revisions
      newInterval = BASE_INTERVALS[Math.min(newRevisionNumber - 1, BASE_INTERVALS.length - 1)];
    } else {
      // Beyond predefined: use SM-2 formula
      newInterval = Math.round(intervalDays * easeFactor);
    }

    // Adjust ease factor based on confidence (1-5 → quality 0-5 in SM-2)
    const quality = confidence ?? 3; // default medium
    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEaseFactor = Math.max(1.3, newEaseFactor);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    nextDate: nextDate.toISOString().split('T')[0],   // YYYY-MM-DD
    intervalDays: newInterval,
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    revisionNumber: newRevisionNumber,
  };
}

/**
 * Get the initial revision schedule (day 1 after first solve).
 */
export function getInitialRevisionDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}
