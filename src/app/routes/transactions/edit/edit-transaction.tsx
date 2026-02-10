import { useTransactionById } from "@/api/transactions";
import { NavigationPage } from "@/components/ui/navigation-page";
import { EditTransactionForm } from "@/features/transactions";
import { useParams } from "react-router-dom";

export default function EditTransaction() {
  const { id } = useParams();
  const transaction = useTransactionById(id!);

  if (transaction)
    return (
      <NavigationPage title={transaction.name} isSubPage>
        <EditTransactionForm transaction={transaction} />
      </NavigationPage>
    );
}
