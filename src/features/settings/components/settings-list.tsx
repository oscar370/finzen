import {
  List,
  ListItem,
  ListItemContent,
  ListItemSuffix,
  ListItemTitle,
} from "@/components/list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notifyError } from "@/lib/errors/notify-error";
import { getCurrencies } from "@/lib/i18n/get-currencies";
import { getLanguageEndonyms } from "@/lib/i18n/get-language-endonyms";
import { getRegionalFormats } from "@/lib/i18n/get-regional-formats";
import { m } from "@/paraglide/messages";
import { getLocale, setLocale, type Locale } from "@/paraglide/runtime";
import { updateSettings } from "@/services/settings/update-settings";
import type { AppState } from "@/types/app-state/app-state";
import { useState } from "react";

type SettingSelectProps = {
  value: string;
  items: { label: string; value: string }[];
  onChange: (value: string) => void;
};

function SettingSelect({ value, items, onChange }: SettingSelectProps) {
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => onChange(next ?? value)}
    >
      <SelectTrigger className="min-w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type SettingsListProps = {
  appState: AppState;
};

export function SettingsList({ appState }: SettingsListProps) {
  const [locale, setCurrentLocale] = useState<Locale>(getLocale());
  const languages = getLanguageEndonyms();
  const currencies = getCurrencies();
  const regionalFormats = getRegionalFormats();

  async function update(patch: Partial<AppState>) {
    try {
      await updateSettings(patch);
    } catch (error) {
      notifyError(error);
    }
  }

  return (
    <List>
      <ListItem>
        <ListItemContent>
          <ListItemTitle>{m.language()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix>
          <SettingSelect
            value={locale}
            items={languages}
            onChange={(value) => {
              setCurrentLocale(value as Locale);
              setLocale(value as Locale);
            }}
          />
        </ListItemSuffix>
      </ListItem>

      <ListItem>
        <ListItemContent>
          <ListItemTitle>{m.currency()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix>
          <SettingSelect
            value={appState.currency}
            items={currencies}
            onChange={(currency) => void update({ currency })}
          />
        </ListItemSuffix>
      </ListItem>

      <ListItem>
        <ListItemContent>
          <ListItemTitle>{m.format()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix>
          <SettingSelect
            value={appState.regionalFormat}
            items={regionalFormats}
            onChange={(regionalFormat) => void update({ regionalFormat })}
          />
        </ListItemSuffix>
      </ListItem>
    </List>
  );
}
