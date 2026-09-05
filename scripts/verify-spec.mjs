import fs from 'node:fs';
import path from 'node:path';
import {
  CANVAS,
  SAFE,
  SAFE_PX,
  DEVICES,
  SERVED_WIDTHS,
  DESKTOP_SERVED_WIDTH,
  MAX_UPLOAD_BYTES,
  JPEG_QUALITY_FLOOR,
} from '../src/lib/spec.ts';

const surveyPath = path.resolve('docs/verification/fcrop-survey.md');
if (!fs.existsSync(surveyPath)) {
  console.error('FAIL: docs/verification/fcrop-survey.md does not exist!');
  process.exit(1);
}

const surveyContent = fs.readFileSync(surveyPath, 'utf-8');

// Assert survey contains the verified desktop token and ladder
const requiredSurveyMatches = [
  '00005a57ffffa5a8',
  'w1060',
  'w1138',
  'w1707',
  'w2120',
  'w2276',
  'w2560',
  '1235 x 338',
  '2560 x 1440',
  '6 MB',
];

for (const item of requiredSurveyMatches) {
  if (!surveyContent.includes(item)) {
    console.error(`FAIL: Survey missing expected token/spec '${item}'`);
    process.exit(1);
  }
}

// Assert spec.ts constants
if (CANVAS.width !== 2560 || CANVAS.height !== 1440) {
  console.error('FAIL: CANVAS must be 2560x1440');
  process.exit(1);
}

if (SAFE_PX.min.width !== 1235 || SAFE_PX.min.height !== 338) {
  console.error('FAIL: SAFE_PX.min must be 1235x338');
  process.exit(1);
}

if (SAFE_PX.full.width !== 1546 || SAFE_PX.full.height !== 423) {
  console.error('FAIL: SAFE_PX.full must be 1546x423');
  process.exit(1);
}

if (
  DEVICES.desktop.x !== 0 ||
  Math.abs(DEVICES.desktop.y - 0.3529) > 0.0001 ||
  DEVICES.desktop.w !== 1.0 ||
  Math.abs(DEVICES.desktop.h - 0.2942) > 0.0001
) {
  console.error('FAIL: DEVICES.desktop crop mismatch with verified survey token 00005a57ffffa5a8');
  process.exit(1);
}

const expectedWidths = [1060, 1138, 1707, 2120, 2276, 2560];
if (
  SERVED_WIDTHS.length !== expectedWidths.length ||
  !SERVED_WIDTHS.every((w, i) => w === expectedWidths[i])
) {
  console.error('FAIL: SERVED_WIDTHS mismatch');
  process.exit(1);
}

if (DESKTOP_SERVED_WIDTH !== 1707) {
  console.error('FAIL: DESKTOP_SERVED_WIDTH must be 1707');
  process.exit(1);
}

if (MAX_UPLOAD_BYTES !== 6 * 1024 * 1024) {
  console.error('FAIL: MAX_UPLOAD_BYTES must be 6 MB');
  process.exit(1);
}

if (JPEG_QUALITY_FLOOR !== 0.7) {
  console.error('FAIL: JPEG_QUALITY_FLOOR must be 0.7');
  process.exit(1);
}

if (!SAFE || typeof SAFE.w !== 'number') {
  console.error('FAIL: SAFE rectangle invalid');
  process.exit(1);
}

console.log('PASS: spec.ts strictly matches docs/verification/fcrop-survey.md');
