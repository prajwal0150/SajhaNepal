import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import { Languages, PersonStanding } from 'lucide-react';
import { setLanguage, toggleA11yMode, selectLang, selectA11yMode } from '../redux/languageSlice';
import { cn } from '@shared/utils/format';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function LanguageToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const lang = useAppSelector(selectLang);
  return (
    <button
      onClick={() => dispatch(setLanguage(lang === 'en' ? 'ne' : 'en'))}
      aria-label={`Switch language to ${lang === 'en' ? 'Nepali' : 'English'}`}
      className="inline-flex items-center gap-1 rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
    >
      <Languages size={14} aria-hidden />
      {lang === 'en' ? 'नेपाली' : 'EN'}
    </button>
  );
}

export function AccessibilityToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const a11y = useAppSelector(selectA11yMode);
  return (
    <button
      onClick={() => dispatch(toggleA11yMode())}
      aria-pressed={Boolean(a11y)}
      aria-label="Toggle accessibility mode (larger text and stronger focus)"
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold',
        a11y ? 'border-secondary bg-secondary/10 text-secondary' : 'border-ink/15 text-ink hover:bg-surface',
      )}
    >
      <PersonStanding size={14} aria-hidden />
      A11y
    </button>
  );
}
