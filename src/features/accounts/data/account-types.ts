export const accountsTypes = [
  { type: "cash", label: "types.cash" },
  { type: "debit", label: "types.debit" },
  { type: "credit", label: "types.credit" },
  { type: "investment", label: "types.investment" },
];

export const accountsTypesDic = Object.fromEntries(
  accountsTypes.map((a) => [a.type, a.label]),
);
