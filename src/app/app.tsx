import { AppLayout } from "@/components/layouts/app-layout";
import { AnimatedRoutes } from "@/components/ui/animated-routes";
import { ModalManager } from "@/components/ui/modal-manager";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route } from "react-router-dom";
import { Account } from "./routes/accounts/account/account";
import { Accounts } from "./routes/accounts/accounts";
import { ArchivedAccounts } from "./routes/accounts/archived/archived-accounts";
import { EditAccount } from "./routes/accounts/edit/edit-account";
import { NewAccount } from "./routes/accounts/new/new-account";
import { Analytics } from "./routes/analytics/analytics";
import { Budget } from "./routes/budgets/budget/budget";
import { Budgets } from "./routes/budgets/budgets";
import { EditBudget } from "./routes/budgets/edit/edit-budget";
import { NewBudget } from "./routes/budgets/new/new-budget";
import { ArchivedCategories } from "./routes/categories/archived/archived-categories";
import { Categories } from "./routes/categories/categories";
import { Category } from "./routes/categories/category/category";
import { EditCategory } from "./routes/categories/edit/edit-category";
import { NewCategory } from "./routes/categories/new/new-category";
import { Expenses } from "./routes/expenses/expenses";
import { Home } from "./routes/home/home";
import { Incomes } from "./routes/incomes/incomes";
import { Landing } from "./routes/landing/landing";
import { Settings } from "./routes/settings/settings";
import { ArchivedTransactions } from "./routes/transactions/archived/archived-transactions";
import { EditTransaction } from "./routes/transactions/edit/edit-transaction";
import { NewTransaction } from "./routes/transactions/new/new-transaction";
import { Transaction } from "./routes/transactions/transaction/transaction";
import { Welcome } from "./routes/welcome/welcome";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <>
      <BrowserRouter>
        <AnimatedRoutes>
          <Route index Component={Landing} />
          <Route path="welcome" Component={Welcome} />
          <Route Component={AppLayout}>
            <Route path="home" Component={Home} />
            <Route path="analytics" Component={Analytics} />
            <Route path="accounts">
              <Route index Component={Accounts} />
              <Route path="new" Component={NewAccount} />
              <Route path=":id" Component={Account} />
              <Route path="edit/:id" Component={EditAccount} />
              <Route path="archived" Component={ArchivedAccounts} />
            </Route>
            <Route path="incomes" Component={Incomes} />
            <Route path="expenses" Component={Expenses} />
            <Route path="categories">
              <Route index Component={Categories} />
              <Route path="new" Component={NewCategory} />
              <Route path=":id" Component={Category} />
              <Route path="edit/:id" Component={EditCategory} />
              <Route path="archived" Component={ArchivedCategories} />
            </Route>
            <Route path="transactions">
              <Route path="new" Component={NewTransaction} />
              <Route path=":id" Component={Transaction} />
              <Route path="edit/:id" Component={EditTransaction} />
              <Route path="archived" Component={ArchivedTransactions} />
            </Route>
            <Route path="settings" Component={Settings} />
            <Route path="budgets">
              <Route index Component={Budgets} />
              <Route path="new" Component={NewBudget} />
              <Route path=":id" Component={Budget} />
              <Route path="edit/:id" Component={EditBudget} />
            </Route>
          </Route>
        </AnimatedRoutes>
      </BrowserRouter>

      <Toaster
        toastOptions={{
          className: "bg-(--dialog-bg)!  text-(--text)!",
        }}
      />

      <ModalManager />
    </>
  );
}

export default App;
