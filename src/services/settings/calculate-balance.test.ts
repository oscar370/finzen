import { describe, expect, it } from "vitest";
import { calculateBalance } from "./calculate-balance";

describe("calculateBalance", () => {
  it("adds income to the balance", () => {
    expect(calculateBalance(100, { amount: 25, kind: "income" }, "add")).toBe(
      125
    );
  });

  it("removes income from the balance", () => {
    expect(
      calculateBalance(100, { amount: 25, kind: "income" }, "remove")
    ).toBe(75);
  });

  it("subtracts expenses from the balance", () => {
    expect(calculateBalance(100, { amount: 25, kind: "expense" }, "add")).toBe(
      75
    );
  });

  it("restores expenses when removed", () => {
    expect(
      calculateBalance(100, { amount: 25, kind: "expense" }, "remove")
    ).toBe(125);
  });

  it("rounds the result to two decimals", () => {
    expect(calculateBalance(0.1, { amount: 0.2, kind: "income" }, "add")).toBe(
      0.3
    );
  });

  it("keeps the balance unchanged for a zero amount", () => {
    expect(calculateBalance(42.5, { amount: 0, kind: "expense" }, "add")).toBe(
      42.5
    );
  });
});
