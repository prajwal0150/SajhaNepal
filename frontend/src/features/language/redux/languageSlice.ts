import type { RootState } from '@/store/Store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'ne';

interface LanguageState {
  lang: Language;
  a11yMode: boolean;
}

const stored = (localStorage.getItem('sr_lang') as Language) || 'en';
const storedA11y = localStorage.getItem('sr_a11y') === '1';

const initialState: LanguageState = { lang: stored, a11yMode: storedA11y };

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.lang = action.payload;
      localStorage.setItem('sr_lang', action.payload);
      document.documentElement.lang = action.payload;
    },
    toggleA11yMode(state) {
      state.a11yMode = !state.a11yMode;
      localStorage.setItem('sr_a11y', state.a11yMode ? '1' : '0');
      document.body.classList.toggle('a11y-mode', state.a11yMode);
    },
  },
});

export const { setLanguage, toggleA11yMode } = languageSlice.actions;
export default languageSlice.reducer;

export const selectLang = (state: RootState) => state.language.lang;
export const selectA11yMode = (state: RootState) => state.language.a11yMode;
