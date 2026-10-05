import test from 'node:test';
import assert from 'node:assert/strict';
import { csv, deduplicate, entriesFrom, normalizeReview } from './collect.mjs';

const app = { app_id: '123', app_name: 'Test', maker: 'Independent', category: 'Utility', indie_tier: 'solo' };
const entry = {
  id: { label: '456' }, 'im:rating': { label: '2' }, 'im:version': { label: '1.0' },
  title: { label: 'Not working' }, content: { label: 'Exact text\nwith "quotes".' },
  updated: { label: '2026-01-01T00:00:00Z' },
  author: { name: { label: 'Reviewer' }, uri: { label: 'https://itunes.apple.com/us/reviews/id789' } },
};
const review = (overrides = {}) => ({ ...normalizeReview(entry, app, { storefront: 'us' }), ...overrides });

test('handles array, singleton, empty and app-metadata entries', () => {
  assert.equal(entriesFrom({ feed: { entry: [{ id: { label: 'app' } }, entry] } }).length, 1);
  assert.equal(entriesFrom({ feed: { entry } }).length, 1);
  assert.deepEqual(entriesFrom({ feed: {} }), []);
});

test('preserves original text, rating and timestamp', () => {
  const row = review();
  assert.equal(row.rating, 2);
  assert.equal(row.text, entry.content.label);
  assert.equal(row.updated_at, entry.updated.label);
});

test('retains the newer cohort launch date and maker-eligibility label', () => {
  const row = normalizeReview(entry, { ...app, release_date: '2025-01-01T00:00:00Z', eligibility: 'user_nominated' }, {});
  assert.equal(row.release_date, '2025-01-01T00:00:00Z');
  assert.equal(row.eligibility, 'user_nominated');
});

test('deduplicates ids and retains every source observation', () => {
  const result = deduplicate([review(), review({ observations: [{ storefront: 'gb' }] })]);
  assert.equal(result.reviews.length, 1);
  assert.equal(result.duplicateIds, 1);
  assert.equal(result.reviews[0].observations.length, 2);
});

test('deduplicates exact same author/content with different ids', () => {
  const result = deduplicate([review(), review({ review_id: '457' })]);
  assert.equal(result.reviews.length, 1);
  assert.equal(result.duplicateContent, 1);
  assert.deepEqual(result.reviews[0].related_review_ids, ['457']);
});

test('does not merge identical complaints by different authors or in different apps', () => {
  const result = deduplicate([review(), review({ review_id: '457', author_url: 'other-author' }), review({ app_id: '124' })]);
  assert.equal(result.reviews.length, 3);
});

test('does not content-deduplicate when author identity is absent', () => {
  const result = deduplicate([
    review({ author_url: '', author_name: '' }),
    review({ review_id: '457', author_url: '', author_name: '' }),
  ]);
  assert.equal(result.reviews.length, 2);
});

test('CSV escapes quotes and preserves multiline Unicode review text', () => {
  assert.equal(csv([{ text: 'A "quote"\n\u00e9' }], ['text']), '"text"\r\n"A ""quote""\n\u00e9"\r\n');
});
