import { GitHubIcon } from "@/components/icons/github-icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/paraglide/messages";

export function WelcomeNav() {
  return (
    <nav className="px-4 pt-2">
      <ul className="flex items-center justify-end">
        <li>
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  className={buttonVariants({ variant: "ghost" })}
                  href="https://github.com/oscar370/finzen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon />
                </a>
              }
            />
            <TooltipContent>
              <p>{m.repo()}</p>
            </TooltipContent>
          </Tooltip>
        </li>
        <li>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
}
