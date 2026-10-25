import { m } from "@/paraglide/messages";

export function EmptyTransactions() {
  return (
    <div className="text-center">
      <p>{m.empty_transactions()}</p>
    </div>
  );
}
