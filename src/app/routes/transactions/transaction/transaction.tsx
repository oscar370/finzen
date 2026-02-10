import { useTransactionById } from "@/api/transactions";
import { NavigationPage } from "@/components/ui/navigation-page";
import { TransactionDetails } from "@/features/transactions";
import { useParams } from "react-router-dom";

export default function Transaction() {
  const { id } = useParams();
  const transaction = useTransactionById(id!);

  if (transaction)
    return (
      <NavigationPage title={transaction.name} isSubPage>
        <TransactionDetails transaction={transaction} />
      </NavigationPage>
    );
}
