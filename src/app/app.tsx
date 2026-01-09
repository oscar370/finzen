import { AnimatedLayout } from "@/components/layouts/animated-layout";
import { AppLayout } from "@/components/layouts/app-layout";
import { IDBPerformanceTests } from "@/features/tests";
import "@/lib/i18next/i18next.ts";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Account } from "./routes/accounts/account/account";
import { Accounts } from "./routes/accounts/accounts";
import { NewAccount } from "./routes/accounts/new/new-account";
import { Categories } from "./routes/categories/categories";
import { Category } from "./routes/categories/category/category";
import { EditCategory } from "./routes/categories/edit/edit-category";
import { NewCategory } from "./routes/categories/new/new-category";
import { Expenses } from "./routes/expenses/expenses";
import { Home } from "./routes/home/home";
import { Incomes } from "./routes/incomes/incomes";
import { Landing } from "./routes/lading";
import { EditTransaction } from "./routes/transactions/edit/edit-transaction";
import { NewTransactions } from "./routes/transactions/new/new-transactions";
import { Transaction } from "./routes/transactions/transaction/transaction";
import { Welcome } from "./routes/welcome/welcome";

function App() {
  dayjs.extend(localizedFormat);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index Component={Landing} />
          <Route path="/tests" Component={IDBPerformanceTests} />
          <Route path="/welcome" Component={Welcome} />
          <Route Component={AppLayout}>
            <Route path="/home" Component={Home} />
            <Route path="/accounts" Component={AnimatedLayout}>
              <Route index Component={Accounts} />
              <Route path=":id" Component={Account} />
              <Route path="new" Component={NewAccount} />
            </Route>
            <Route path="/transactions" Component={AnimatedLayout}>
              <Route path="new" Component={NewTransactions} />
              <Route path=":id" Component={Transaction} />
              <Route path="edit/:id" Component={EditTransaction} />
            </Route>
            <Route path="/incomes" Component={Incomes} />
            <Route path="/expenses" Component={Expenses} />
            <Route path="/categories" Component={AnimatedLayout}>
              <Route index Component={Categories} />
              <Route path="new" Component={NewCategory} />
              <Route path=":id" Component={Category} />
              <Route path="edit/:id" Component={EditCategory} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
