import { CURRENCIES, LANGUAGES } from "#/lib/constants";
import { m } from "#/paraglide/messages";
import type { Locale } from "#/paraglide/runtime";
import { getLocale, setLocale } from "#/paraglide/runtime";
import { updateAppState } from "#/services/settings";
import type { AppState } from "#/types/app-state";

type AppSettingsListProps = {
  appState: AppState;
};

export function AppSettingsList({ appState }: AppSettingsListProps) {
  const handleLanguageChange = (value: string) => setLocale(value as Locale);

  const handleCurrencyChange = (value: string) => updateAppState({ currency: value });

  return (
    <ul className="list rounded-box bg-base-200">
      <li>
        <label className="list-row items-center">
          <span className="list-col-grow">{m.language()}</span>

          <select
            className="select"
            value={getLocale()}
            name="language"
            onChange={(e) => handleLanguageChange(e.currentTarget.value)}
          >
            {LANGUAGES.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </label>
      </li>

      <li>
        <label className="list-row items-center">
          <span className="list-col-grow">{m.currency()}</span>

          <select
            className="select"
            value={appState.currency}
            name="currency"
            onChange={(e) => handleCurrencyChange(e.currentTarget.value)}
          >
            {CURRENCIES.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </label>
      </li>
    </ul>
  );
}
