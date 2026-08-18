import { TRANSLATIONS, type TranslationKey } from '../constants/i18n';
import { useLocaleStore } from '../store/useLocaleStore';
import type { Skill } from '../types';

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);

  const t = (key: TranslationKey, vars?: Record<string, string | number>) => {
    let text = TRANSLATIONS[locale][key] ?? TRANSLATIONS.ko[key] ?? key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replace(`{${name}}`, String(value));
      }
    }
    return text;
  };

  // Skills are seeded/stored with a Korean `label`, so display always looks the id up in
  // the current locale instead — falls back to the stored label for any id we don't have
  // a translation for.
  const skillLabel = (skill: Skill) => {
    const key = `skill.${skill.id}` as TranslationKey;
    const table = TRANSLATIONS[locale] as Record<string, string>;
    return table[key] ?? skill.label;
  };

  return { t, locale, skillLabel };
}
