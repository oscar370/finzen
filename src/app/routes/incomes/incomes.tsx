import { useCategories } from "@/api/categories";
import { useIncomes } from "@/api/transactions";
import { ButtonRow } from "@/components/ui/button-row";
import { EntryRow } from "@/components/ui/entry-row";
import { EntrySearchRow } from "@/components/ui/entry-search-row";
import { ExpanderRow } from "@/components/ui/expander-row";
import { ListBox } from "@/components/ui/list-box";
import { NavigationPage } from "@/components/ui/navigation-page";
import { SelectRow } from "@/components/ui/select-row";
import { TransactionItems } from "@/features/transactions";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function Incomes() {
  const firstDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const lastDate = dayjs().endOf("month").format("YYYY-MM-DD");
  const [from, setFrom] = useState(firstDate);
  const [to, setTo] = useState(lastDate);
  const categories = useCategories();
  const [categorySelected, setCategorySelected] = useState("");
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const incomes = useIncomes(
    dayjs(from).startOf("day").valueOf(),
    dayjs(to).endOf("day").valueOf(),
    limit,
    search,
    categorySelected,
  );
  const navigate = useNavigate();
  const { t } = useTranslation("transactions");

  const categoryOptions = [
    { value: "", label: t("filters.anyCategory") },
    ...categories.map((category) => ({
      value: category.id,
      label: t(category.name, { ns: "categories" }),
    })),
  ];

  function handleLoadMore() {
    setLimit((prev) => prev + 20);
  }

  return (
    <NavigationPage title={t("sections.incomes", { ns: "common" })}>
      <ListBox>
        <ExpanderRow title={t("filters.title")}>
          <EntrySearchRow
            placeholder={t("filters.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <EntryRow
            title={t("filters.startDate")}
            type="date"
            disabledIcon
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <EntryRow
            title={t("filters.endDate")}
            type="date"
            disabledIcon
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <SelectRow
            title={t("fields.category")}
            value={categorySelected}
            options={categoryOptions}
            onChange={(value) => setCategorySelected(value)}
          />
        </ExpanderRow>
      </ListBox>

      <ListBox>
        <ButtonRow role="link" onClick={() => navigate("/transactions/new")}>
          <Plus />
          <span> {t("buttons.addTransaction", { ns: "transactions" })} </span>
        </ButtonRow>
        <TransactionItems transactions={incomes} />

        {incomes.length >= limit && (
          <ButtonRow onClick={handleLoadMore}>Show more</ButtonRow>
        )}
      </ListBox>
    </NavigationPage>
  );
}
