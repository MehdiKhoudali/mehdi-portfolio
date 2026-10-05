import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const reviews = fs.readFileSync(path.join(dir, 'qualified-reviews.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
const groups = Map.groupBy(reviews, r => r.app_name);
const mode = process.argv[2] || 'sample';
const query = process.argv[3];
const perApp = Number(process.argv[4] || 12);
for (const [name, rows] of groups) {
  const candidates = mode === 'search' ? rows.filter(r => new RegExp(query, 'iu').test(r.title + '\n' + r.text)) : rows;
  if (!candidates.length) continue;
  console.log('APP ' + name + ' | screened matches: ' + candidates.length + '/' + rows.length);
  const k = Math.min(perApp, candidates.length);
  for (let i = 0; i < k; i++) {
    const r = candidates[Math.floor(i * (candidates.length - 1) / Math.max(1, k - 1))];
    console.log(JSON.stringify({ id:r.review_id, star:r.rating, country:r.observations[0].storefront, title:r.title, text:r.text }));
  }
}
