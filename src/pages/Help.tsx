import { PageLayout } from "@/components/Layout/PageLayout";
import { UserGuide } from "@/components/Help/UserGuide/UserGuide";

export default function Help() {
  return (
    <PageLayout title="Help & Documentation">
      <UserGuide />
    </PageLayout>
  );
}