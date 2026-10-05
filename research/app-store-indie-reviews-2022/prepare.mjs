import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const minRelease = Date.parse('2022-01-01T00:00:00Z');
const byId = new Map();
const excluded = [];
for (const filename of ['candidates-examples.json', 'candidates-social.json', 'candidates-utilities.json', 'candidates-followup.json', 'candidates-extra.json']) {
  let candidates;
  try { candidates = JSON.parse(await readFile(join(root, filename), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  for (const candidate of candidates) {
    const app = { ...candidate, app_id: String(candidate.app_id), candidate_file: filename };
    if (app.indie_tier === 'small_team') app.indie_tier = 'small_independent_team';
    if (app.release_date_source) app.release_date_source = app.release_date_source.replace(/\s+\(.*$/, '');
    if (!['qualified', 'user_nominated'].includes(app.eligibility) || !(Date.parse(app.release_date) >= minRelease)) {
      excluded.push(app);
      continue;
    }
    assert(/^\d+$/.test(app.app_id), `Invalid Apple ID: ${app.app_name}`);
    assert(app.release_date_source && app.evidence?.length, `Missing evidence: ${app.app_name}`);
    assert(!byId.has(app.app_id), `Duplicate candidate app ID: ${app.app_id}`);
    byId.set(app.app_id, app);
  }
}
const apps = [...byId.values()];
assert(apps.length, 'No approved apps');
await writeFile(join(root, 'apps.json'), JSON.stringify(apps, null, 2) + '\n');
const remainingExcluded = excluded.filter(app => !byId.has(app.app_id));
await writeFile(join(root, 'excluded-apps.json'), JSON.stringify(remainingExcluded, null, 2) + '\n');
console.log(JSON.stringify({ apps: apps.length, qualified: apps.filter(app => app.eligibility === 'qualified').length,
  user_nominated: apps.filter(app => app.eligibility === 'user_nominated').length,
  names: apps.map(app => app.app_name), excluded: remainingExcluded.length }, null, 2));
