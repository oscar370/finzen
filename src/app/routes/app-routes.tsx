import { AppLayout } from "@/components/layouts/app-layout";
import { Route, Routes } from "react-router-dom";
import Account from "./accounts/account/account";
import Accounts from "./accounts/accounts";
import ArchivedAccounts from "./accounts/archived/archived-accounts";
import EditAccount from "./accounts/edit/edit-account";
import NewAccount from "./accounts/new/new-account";
import Analytics from "./analytics/analytics";
import Budget from "./budgets/budget/budget";
import Budgets from "./budgets/budgets";
import EditBudget from "./budgets/edit/edit-budget";
import NewBudget from "./budgets/new/new-budget";
import ArchivedCategories from "./categories/archived/archived-categories";
import Categories from "./categories/categories";
import Category from "./categories/category/category";
import EditCategory from "./categories/edit/edit-category";
import NewCategory from "./categories/new/new-category";
import Expenses from "./expenses/expenses";
import Home from "./home/home";
import Incomes from "./incomes/incomes";
import Settings from "./settings/settings";
import ArchivedTransactions from "./transactions/archived/archived-transactions";
import EditTransaction from "./transactions/edit/edit-transaction";
import NewTransaction from "./transactions/new/new-transaction";
import Transaction from "./transactions/transaction/transaction";
import Welcome from "./welcome/welcome";

export default function AppRoutes() {
  return (
    <Routes>
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
    </Routes>
  );
}
