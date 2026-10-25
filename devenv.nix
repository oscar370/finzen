{
  pkgs,
  lib,
  config,
  ...
}:
{
  # devenv.sh/languages/
  languages.javascript = {
    enable = true;
    pnpm.enable = true;
  };

  # devenv.sh/scripts/
  scripts = {
    dev.exec = "pnpm dev";
    format.exec = "pnpm format";
    lint.exec = "pnpm lint";
    shadcn.exec = ''pnpm dlx shadcn@latest "$@"'';
    add.exec = ''pnpm add "$@"'';
  };

  # See full reference at https://devenv.sh/reference/options/
}
