import { describe, it, expect } from 'vitest';
import { en } from './locales/en';
import { es } from './locales/es';
import { de } from './locales/de';
import { fr } from './locales/fr';
import { ptBr } from './locales/pt-br';
import { it as itLocale } from './locales/it';
import { ja } from './locales/ja';

const TARGET_LOCALES = {
  es,
  de,
  fr,
  'pt-br': ptBr,
  it: itLocale,
  ja,
};

function getKeys(obj: any, prefix = ''): Array<{ key: string; value: any }> {
  let keys: Array<{ key: string; value: any }> = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(getKeys(v, fullKey));
    } else {
      keys.push({ key: fullKey, value: v });
    }
  }
  return keys;
}

function getValue(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;
  for (const p of parts) {
    if (current && typeof current === 'object' && p in current) {
      current = current[p];
    } else {
      return undefined;
    }
  }
  return current;
}

describe('Translation Coverage & Parity Audit', () => {
  const enKeys = getKeys(en);

  it('has a non-trivial baseline of at least 80 user-facing string keys in English', () => {
    expect(enKeys.length).toBeGreaterThanOrEqual(80);
  });

  for (const [locName, locDict] of Object.entries(TARGET_LOCALES)) {
    describe(`Locale: ${locName}`, () => {
      it(`achieves 100% key parity with English dictionary`, () => {
        const missingKeys: string[] = [];
        const emptyKeys: string[] = [];
        const variableMismatches: string[] = [];

        for (const { key, value: enVal } of enKeys) {
          const locVal = getValue(locDict, key);
          if (locVal === undefined) {
            missingKeys.push(key);
          } else if (typeof locVal === 'string' && locVal.trim() === '') {
            emptyKeys.push(key);
          } else if (typeof enVal === 'string' && typeof locVal === 'string') {
            const enVars = (enVal.match(/\{[a-zA-Z0-9_-]+\}/g) || []).sort();
            const locVars = (locVal.match(/\{[a-zA-Z0-9_-]+\}/g) || []).sort();
            if (enVars.join(',') !== locVars.join(',')) {
              variableMismatches.push(
                `${key}: EN[${enVars.join(', ')}] vs ${locName.toUpperCase()}[${locVars.join(', ')}]`
              );
            }
          }
        }

        expect(
          missingKeys,
          `Missing ${missingKeys.length} translation keys in ${locName}:\n${missingKeys.join('\n')}`
        ).toEqual([]);

        expect(
          emptyKeys,
          `Empty string values found in ${locName}:\n${emptyKeys.join('\n')}`
        ).toEqual([]);

        expect(
          variableMismatches,
          `Interpolation variable mismatches in ${locName}:\n${variableMismatches.join('\n')}`
        ).toEqual([]);
      });
    });
  }
});
