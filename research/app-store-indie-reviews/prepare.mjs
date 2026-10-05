import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT } from './collect.mjs';

const byId = new Map();
const tier = value => value.startsWith('small') || value.includes('small_team')
  ? 'small_independent_team' : ['solo', 'solo_explicit'].includes(value) ? 'solo' : 'individual_led';
for (const filename of ['candidates-a.json', 'candidates-b.json']) {
  let candidates;
  try { candidates = JSON.parse(await readFile(join(ROOT, filename), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  for (const candidate of candidates) {
    if (!['qualified', 'eligible', 'include'].includes(candidate.eligibility)) continue;
    const appId = String(candidate.app_id ?? candidate.apple_id);
    if (!/^\d+$/.test(appId)) throw new Error(`Invalid Apple ID: ${candidate.app_name}`);
    if (!candidate.evidence?.length || !candidate.indie_tier) throw new Error(`Missing eligibility evidence: ${appId}`);
    const existing = byId.get(appId);
    if (existing) {
      existing.evidence.push(...candidate.evidence);
      existing.caveats.push(...(candidate.caveats ?? []));
      existing.candidate_files.push(filename);
      existing.indie_tier_source.push(candidate.indie_tier);
      if (tier(candidate.indie_tier) === 'individual_led') existing.indie_tier = 'individual_led';
    } else {
      byId.set(appId, { ...candidate, app_id: appId, eligibility: 'qualified',
        indie_tier: tier(candidate.indie_tier), indie_tier_source: [candidate.indie_tier],
        candidate_files: [filename], evidence: [...candidate.evidence], caveats: [...(candidate.caveats ?? [])] });
    }
  }
}
const apps = [...byId.values()];
// Keep the verified operator attribution, not the unverified full name supplied as a candidate.
const due = byId.get('390017969');
if (due) due.maker = 'Due Apps LLP; individual-led maker @jjlin';
if (!apps.length) throw new Error('No qualified candidates available');
await writeFile(join(ROOT, 'apps.json'), JSON.stringify(apps, null, 2) + '\n');
console.log(JSON.stringify({ approved_apps: apps.length, app_names: apps.map(app => app.app_name) }, null, 2));
