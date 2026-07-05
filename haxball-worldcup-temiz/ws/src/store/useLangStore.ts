import { create } from 'zustand';
import { Lang, TRANSLATIONS, Translations } from '@/i18n/translations';

interface LangState {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: 'tr',
  t: TRANSLATIONS['tr'],
  setLang: (l) => set({ lang: l, t: TRANSLATIONS[l] }),
}));
