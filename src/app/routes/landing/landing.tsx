import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <main>
      <div className="relative flex h-120 items-center justify-center text-white">
        <div className="container-pattern inset-0 opacity-90"></div>
        <div className="relative z-5 pr-4 pl-8">
          <section className="space-y-2">
            <div>
              <h1 className="text-4xl font-bold text-shadow-xs">Finzen</h1>
              <p className="text-xl font-bold text-shadow-xs">
                Track your expenses and income, plan for your future, and keep
                your data with you
                <br />
                Free, open source, and works 100% offline
              </p>
            </div>

            <Button
              className="bg-[#222226]"
              variant="pill"
              role="link"
              onClick={() => navigate("/welcome")}
            >
              Go to app
            </Button>
          </section>
        </div>
      </div>

      <div className="space-y-8 px-4 py-4 md:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <img
            className="h-60 rounded-sm"
            src="screenshots/home-desktop.webp"
          />

          <div className="flex-1 text-start">
            <h2 className="text-lg font-bold">The control is yours</h2>
            <p>
              Your finances live exclusively on your device. Fast, private, and
              available even offline
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse items-center gap-4 md:flex-row">
          <div className="flex-1 text-end">
            <h2 className="text-lg font-bold">Responsive design</h2>
            <p>
              Designed to feel native on both your smartphone and your desktop.
              A smooth, minimalist experience adapted to any screen
            </p>
          </div>

          <img
            className="h-75 rounded-sm"
            src="screenshots/budgets-mobile.webp"
          />
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row">
          <img
            className="h-60 rounded-sm"
            src="screenshots/budgets-desktop.webp"
          />

          <div className="flex-1 text-start">
            <h2 className="text-lg font-bold">
              Control your cash flow, not just your expenses
            </h2>
            <p>
              Compare your plan vs. reality in real time. The “Budgets” section
              allows you to see at a glance whether you are meeting your goals
              or if that extra coffee got out of hand
            </p>
          </div>
        </div>
      </div>

      <footer className="flex items-center gap-2 bg-linear-to-t from-emerald-500 to-teal-500 px-4 py-3 text-white">
        <p className="font-bold text-shadow-sm">Visit the repository on</p>
        <Button
          className="bg-(--accent)"
          variant="pill"
          role="link"
          onClick={() => window.open("https://github.com/oscar370/finzen")}
        >
          <span className="size-6">
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </span>
          <span>Github</span>
        </Button>
      </footer>
    </main>
  );
}
