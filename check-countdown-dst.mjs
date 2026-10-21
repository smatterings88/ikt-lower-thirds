import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const html = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'countdown.html'), 'utf8');
const block = html.match(/\/\* ZONE_MATH_START \*\/([\s\S]*?)\/\* ZONE_MATH_END \*\//);
if (!block) {
  console.error('Could not find the zone math in countdown.html');
  process.exit(1);
}
const { zonedWallTimeToUtc, nextShowUtc } = new Function(
  block[1] + '\nreturn { zonedWallTimeToUtc, nextShowUtc };'
)();

const zone = 'America/New_York';
let failed = 0;

function check(label, got, expected) {
  const ok = got === expected;
  if (!ok) failed += 1;
  console.log(label + ' -> ' + got + (ok ? ' OK' : ' EXPECTED ' + expected));
}

const wall = [
  ['2026-03-07 20:54 ET', 2026, 3, 7, '2026-03-08T01:54:00.000Z'],
  ['2026-03-08 20:54 ET', 2026, 3, 8, '2026-03-09T00:54:00.000Z'],
  ['2026-10-31 20:54 ET', 2026, 10, 31, '2026-11-01T00:54:00.000Z'],
  ['2026-11-01 20:54 ET', 2026, 11, 1, '2026-11-02T01:54:00.000Z'],
];
for (const [label, year, month, day, expected] of wall) {
  const got = new Date(zonedWallTimeToUtc(zone, year, month, day, 20, 54, 0)).toISOString();
  check(label, got, expected);
}

const live = 30;
const schedule = [
  ['before the March change', '2026-03-08T00:30:00.000Z', '2026-03-08T01:54:00.000Z'],
  ['just after March 7 showtime', '2026-03-08T01:54:30.001Z', '2026-03-09T00:54:00.000Z'],
  ['at the October 31 start', '2026-11-01T00:54:00.000Z', '2026-11-01T00:54:00.000Z'],
  ['just after the October 31 showtime', '2026-11-01T00:54:31.000Z', '2026-11-02T01:54:00.000Z'],
];
for (const [label, now, expected] of schedule) {
  const got = new Date(nextShowUtc(Date.parse(now), 20, 54, zone, live)).toISOString();
  check(label, got, expected);
}

if (failed) {
  console.error(failed + ' check' + (failed === 1 ? '' : 's') + ' failed');
  process.exit(1);
}
console.log('All Eastern daylight-saving checks passed.');
