import { PageLayout } from "@/components/Layout/PageLayout";
import { AccountSettings } from "@/components/Account/AccountSettings";

export default function Account() {
  return (
    <PageLayout title="Account Settings">
      <AccountSettings />
    </PageLayout>
  );
}