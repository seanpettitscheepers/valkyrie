import { PageLayout } from "@/components/Layout/PageLayout";
import { APIGuides } from "@/components/Help/APIGuides";

export default function Help() {
  return (
    <PageLayout title="Help & Documentation">
      <APIGuides />
    </PageLayout>
  );
}