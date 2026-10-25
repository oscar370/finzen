import { describe, expect, it } from "vitest";
import {
  applyTransactionToSummary,
  createMonthlySummary,
} from "./summary-calculator";

describe("createMonthlySummary", () => {
  it("creates an empty summary for the given month", () => {
    expect(createMonthlySummary("2026-03")).toEqual({
      id: "2026-03",
      year: 2026,
      month: 3,
      income: 0,
      expense: 0,
      adjustments: 0,
    });
  });

  it("throws for an invalid year-month", () => {
    expect(() => createMonthlySummary("2026-13")).toThrow(
      "Invalid year-month: 2026-13"
    );
  });
});

describe("applyTransactionToSummary", () => {
  it("adds income and recalculates adjustments", () => {
    const summary = createMonthlySummary("2026-03");

    expect(
      applyTransactionToSummary(
        summary,
        { amount: 150.25, kind: "income" },
        "add"
      )
    ).toEqual({
      ...summary,
      income: 150.25,
      adjustments: 150.25,
    });
  });

  it("adds expenses and recalculates adjustments", () => {
    const summary = createMonthlySummary("2026-03");

    expect(
      applyTransactionToSummary(
        summary,
        { amount: 40.5, kind: "expense" },
        "add"
      )
    ).toEqual({
      ...summary,
      expense: 40.5,
      adjustments: -40.5,
    });
  });

  it("removes income from the summary", () => {
    const summary = {
      ...createMonthlySummary("2026-03"),
      income: 150,
      adjustments: 150,
    };

    expect(
      applyTransactionToSummary(
        summary,
        { amount: 50, kind: "income" },
        "remove"
      )
    ).toEqual({
      ...summary,
      income: 100,
      adjustments: 100,
    });
  });

  it("removes expenses from the summary", () => {
    const summary = {
      ...createMonthlySummary("2026-03"),
      expense: 80,
      adjustments: -80,
    };

    expect(
      applyTransactionToSummary(
        summary,
        { amount: 30, kind: "expense" },
        "remove"
      )
    ).toEqual({
      ...summary,
      expense: 50,
      adjustments: -50,
    });
  });

  it("rounds values to two decimals", () => {
    const summary = {
      ...createMonthlySummary("2026-03"),
      income: 0.1,
      adjustments: 0.1,
    };

    const result = applyTransactionToSummary(
      summary,
      { amount: 0.2, kind: "income" },
      "add"
    );

    expect(result.income).toBe(0.3);
    expect(result.adjustments).toBe(0.3);
  });

  it("does not mutate the provided summary", () => {
    const summary = createMonthlySummary("2026-03");

    applyTransactionToSummary(summary, { amount: 25, kind: "income" }, "add");

    expect(summary).toEqual(createMonthlySummary("2026-03"));
  });
});
