import { getLanguageEndonyms } from "@/lib/i18n/get-language-endonyms";
import { m } from "@/paraglide/messages";
import { getLocale, setLocale } from "@/paraglide/runtime";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function LanguageSwitcher() {
  const languages = getLanguageEndonyms();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label={m.language()} />
              }
            >
              <Globe />
            </DropdownMenuTrigger>
          }
        ></TooltipTrigger>

        <TooltipContent>
          <p>{m.language()}</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={getLocale()}
          onValueChange={(v) => setLocale(v)}
        >
          {languages.map((lang) => (
            <DropdownMenuRadioItem key={lang.value} value={lang.value}>
              {lang.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
